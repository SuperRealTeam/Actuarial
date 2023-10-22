using Actuarial.Domain.Audit;
using Actuarial.Domain.Enumerable;
using Actuarial.Domain.Identity;
using Actuarial.Infrastructure.Repo.Data.Classes.Audit;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Actuarial.Infrastructure.Repo.Data
{

    public abstract class AuditableContext : IdentityDbContext<User, Role, Guid, IdentityUserClaim<Guid>, IdentityUserRole<Guid>, IdentityUserLogin<Guid>, RoleClaim, IdentityUserToken<Guid>>
    {
        protected AuditableContext(DbContextOptions options) : base(options)
        {

        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {

            //optionsBuilder
            //    .UseMySql(p => p.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery));
        }

        public DbSet<Audit> AuditTrails { get; set; }

        public virtual async Task<int> SaveChangesAsync(string userId = null, CancellationToken cancellationToken = new())
        {
            var auditEntries = OnBeforeSaveChanges(userId);
            var result = await base.SaveChangesAsync(cancellationToken);
            await OnAfterSaveChanges(auditEntries, cancellationToken);
            return result;
        }

        private List<AuditEntry> OnBeforeSaveChanges(string userId)
        {
            ChangeTracker.DetectChanges();
            var auditEntries = new List<AuditEntry>();
            foreach (var entry in ChangeTracker.Entries())
            {
                if (entry.Entity is Audit || entry.State == EntityState.Detached || entry.State == EntityState.Unchanged)
                    continue;

                var auditEntry = new AuditEntry(entry)
                {
                    TableName = entry.Entity.GetType().Name,
                    UserId = userId
                };
                auditEntries.Add(auditEntry);
                foreach (var Property in entry.Properties)
                {
                    if (Property.IsTemporary)
                    {
                        auditEntry.TemporaryProperties.Add(Property);
                        continue;
                    }

                    string PropertyName = Property.Metadata.Name;
                    if (Property.Metadata.IsPrimaryKey())
                    {
                        auditEntry.KeyValues[PropertyName] = Property.CurrentValue;
                        continue;
                    }

                    switch (entry.State)
                    {
                        case EntityState.Added:
                            auditEntry.AuditType = AuditType.Create;
                            auditEntry.NewValues[PropertyName] = Property.CurrentValue;
                            break;

                        case EntityState.Deleted:
                            auditEntry.AuditType = AuditType.Delete;
                            auditEntry.OldValues[PropertyName] = Property.OriginalValue;
                            break;

                        case EntityState.Modified:
                            if (Property.IsModified && Property.OriginalValue?.Equals(Property.CurrentValue) == false)
                            {
                                auditEntry.ChangedColumns.Add(PropertyName);
                                auditEntry.AuditType = AuditType.Update;
                                auditEntry.OldValues[PropertyName] = Property.OriginalValue;
                                auditEntry.NewValues[PropertyName] = Property.CurrentValue;
                            }
                            break;
                    }
                }
            }
            foreach (var auditEntry in auditEntries.Where(_ => !_.HasTemporaryProperties))
            {
                AuditTrails.Add(auditEntry.ToAudit());
            }
            return auditEntries.Where(_ => _.HasTemporaryProperties).ToList();
        }

        private Task OnAfterSaveChanges(List<AuditEntry> auditEntries, CancellationToken cancellationToken = new())
        {
            if (auditEntries == null || auditEntries.Count == 0)
                return Task.CompletedTask;

            foreach (var auditEntry in auditEntries)
            {
                foreach (var property in auditEntry.TemporaryProperties)
                {
                    if (property.Metadata.IsPrimaryKey())
                    {
                        auditEntry.KeyValues[property.Metadata.Name] = property.CurrentValue;
                    }
                    else
                    {
                        auditEntry.NewValues[property.Metadata.Name] = property.CurrentValue;
                    }
                }
                AuditTrails.Add(auditEntry.ToAudit());
            }
            return SaveChangesAsync(cancellationToken);
        }
    }
}
