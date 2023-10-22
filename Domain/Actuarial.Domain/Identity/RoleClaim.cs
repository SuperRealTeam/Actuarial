using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Actuarial.Domain.Identity
{
    /// <summary>
    /// 
    /// </summary>
    public class RoleClaim : IdentityRoleClaim<Guid>
    {
        /// <summary>
        /// 
        /// </summary>
        public virtual Role Role { get; set; }
    }
}
