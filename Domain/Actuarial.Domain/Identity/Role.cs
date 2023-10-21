using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Actuarial.Domain.Identity
{
    /// <summary>
    ///     the role entity
    /// </summary>
    public class Role : IdentityRole<Guid>
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="roleName"></param>
        /// <param name="roleDescription"></param>

        /// <summary>
        ///     the role description
        /// </summary>
        public string Description { get; set; }
    }
}
