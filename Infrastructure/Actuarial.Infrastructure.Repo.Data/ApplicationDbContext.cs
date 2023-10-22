using Actuarial.Domain.Emp;
using Actuarial.Domain.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Actuarial.Infrastructure.Repo.Data
{

    public class ApplicationDbContext : AuditableContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {

        }
        public virtual async Task<int> CommitAsync(string userid = null)
        {
            if (userid == null)
            {
                return await base.SaveChangesAsync();
            }
            else
            {
                return await base.SaveChangesAsync(userid);
            }

        }

        #region Emp
        public virtual DbSet<Employer> Employers { get; set; }
        #endregion
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            int stringMaxLength = 100;
            // User IdentityRole and IdentityUser in case you haven't extended those classes
            modelBuilder.Entity<Role>(x => x.Property(m => m.Name).HasMaxLength(stringMaxLength));
            modelBuilder.Entity<Role>(x => x.Property(m => m.NormalizedName).HasMaxLength(stringMaxLength));
            modelBuilder.Entity<User>(x => x.Property(m => m.NormalizedUserName).HasMaxLength(stringMaxLength));

            // We are using int here because of the change on the PK
            modelBuilder.Entity<IdentityUserLogin<Guid>>(x => x.Property(m => m.LoginProvider).HasMaxLength(stringMaxLength));
            modelBuilder.Entity<IdentityUserLogin<Guid>>(x => x.Property(m => m.ProviderKey).HasMaxLength(stringMaxLength));

            // We are using int here because of the change on the PK
            modelBuilder.Entity<IdentityUserToken<Guid>>(x => x.Property(m => m.LoginProvider).HasMaxLength(stringMaxLength));
            modelBuilder.Entity<IdentityUserToken<Guid>>(x => x.Property(m => m.Name).HasMaxLength(stringMaxLength));
        }
    }
}
