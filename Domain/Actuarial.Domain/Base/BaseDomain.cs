using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Actuarial.Domain.Base
{
    /// <summary>
    ///     the base domain entity
    /// </summary>
    public class BaseDomain
    {
        /// <summary>
        ///     the Application name that create / update the  entiy
        /// </summary>
        public string? ApplicationName => this.InternalApplicationName;

        /// <summary>
        ///     the creation Datetime
        /// </summary>
        public DateTime CreationDateTimeUtc => this.InternalCreationDateTimeUtc;

        /// <summary>
        ///     id
        /// </summary>

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        /// <summary>
        ///     Set Creation Date time
        /// </summary>
        [IgnoreDataMember]
        [JsonIgnore]
        public string? InternalApplicationName { get; set; }

        /// <summary>
        ///     Set Creation Date time
        /// </summary>
        [IgnoreDataMember]
        [JsonIgnore]

        public DateTime InternalCreationDateTimeUtc { get; set; }

        /// <summary>
        ///     Set Creation Date time
        /// </summary>
        [IgnoreDataMember]
        [JsonIgnore]

        public DateTime InternalModificationDateTimeUtc { get; set; }

        /// <summary>
        ///     set the validation
        /// </summary>
        [IgnoreDataMember]
        [JsonIgnore]
        public bool InternalValidation { get; set; }

        /// <summary>
        ///     Storage Validation of entity
        /// </summary>
        public bool? IsValid => this.InternalValidation;

        /// <summary>
        /// 
        /// </summary>
        [IgnoreDataMember]
        [JsonIgnore]
        public bool InternalIsDelete { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public bool? IsDelete => this.InternalIsDelete;

        /// <summary>
        ///     the Modification Datetime
        /// </summary>
        public DateTime ModificationDateTimeUtc => this.InternalModificationDateTimeUtc;
    }
}
