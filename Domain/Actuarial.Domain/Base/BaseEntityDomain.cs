using Actuarial.Domain.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Actuarial.Domain.Base
{
    /// <summary>
    ///     the base domain entity
    /// </summary>
    public class BaseEntityDomain : BaseDomain
    {
        /// <summary>
        ///     Owner
        /// </summary>
        public User Owner { get; set; }

        /// <summary>
        ///     the deal Owner Id
        /// </summary>
        public Guid? OwnerId { get; set; }
    }
}
