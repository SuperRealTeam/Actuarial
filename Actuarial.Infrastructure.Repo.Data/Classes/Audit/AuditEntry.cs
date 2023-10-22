using System.Text.Json;
using Actuarial.Domain.Enumerable;
using Microsoft.EntityFrameworkCore.ChangeTracking;
namespace Actuarial.Infrastructure.Repo.Data.Classes.Audit
{

    /// <summary>
    /// 
    /// </summary>
    public class AuditEntry
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="entry"></param>
        public AuditEntry(EntityEntry entry)
        {
            Entry = entry;
        }
        /// <summary>
        /// 
        /// </summary>
        public EntityEntry Entry { get; }
        /// <summary>
        /// 
        /// </summary>
        public string UserId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string TableName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public Dictionary<string, object> KeyValues { get; } = new();
        /// <summary>
        /// 
        /// </summary>
        public Dictionary<string, object> OldValues { get; } = new();
        /// <summary>
        /// 
        /// </summary>
        public Dictionary<string, object> NewValues { get; } = new();
        /// <summary>
        /// 
        /// </summary>
        public List<PropertyEntry> TemporaryProperties { get; } = new();
        /// <summary>
        /// 
        /// </summary>
        public AuditType AuditType { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<string> ChangedColumns { get; } = new();
        /// <summary>
        /// 
        /// </summary>
        public bool HasTemporaryProperties => TemporaryProperties.Any();
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public Domain.Audit.Audit ToAudit()
        {
            var audit = new Domain.Audit.Audit
            {
                UserId = UserId,
                Type = AuditType.ToString(),
                TableName = TableName,
                DateTime = DateTime.UtcNow,
                PrimaryKey = JsonSerializer.Serialize(KeyValues),
                OldValues = OldValues.Count == 0 ? null : JsonSerializer.Serialize(OldValues),
                NewValues = NewValues.Count == 0 ? null : JsonSerializer.Serialize(NewValues),
                AffectedColumns = ChangedColumns.Count == 0 ? null : JsonSerializer.Serialize(ChangedColumns)
            };
            return audit;
        }
    }
}
