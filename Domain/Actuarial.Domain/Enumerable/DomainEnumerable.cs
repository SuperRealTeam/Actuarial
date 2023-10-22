using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Actuarial.Domain.Enumerable
{
    /// <summary>
    /// 
    /// </summary>
    public enum EntityExtendedAttributeType : byte
    {
        /// <summary>
        /// 
        /// </summary>
        Decimal = 1,
        /// <summary>
        /// 
        /// </summary>
        Text = 2,
        /// <summary>
        /// 
        /// </summary>
        DateTime = 3,
        /// <summary>
        /// 
        /// </summary>
        Json = 4
    }
    /// <summary>
    /// 
    /// </summary>
    public enum AuditType : byte
    {
        None = 0,
        Create = 1,
        Update = 2,
        Delete = 3
    }
}
