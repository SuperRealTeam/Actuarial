using Actuarial.Domain.DataContracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Actuarial.Domain.Audit
{

    /// <summary>
    /// 
    /// </summary>
    public class Audit : IEntity<int>
    {
        /// <summary>
        /// 
        /// </summary>
        public int Id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string UserId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Type { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string TableName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public DateTime DateTime { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string OldValues { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string NewValues { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string AffectedColumns { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string PrimaryKey { get; set; }
    }
}
