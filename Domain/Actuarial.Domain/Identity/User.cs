using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Actuarial.Domain.Identity
{
    /// <summary>
    ///     the user entity
    /// </summary>
    public class User : IdentityUser<Guid>
    {



        /// <summary>
        ///     the first name
        /// </summary>
        public string? FirstName { get; set; }

        /// <summary>
        ///     the last name
        /// </summary>/.. 
        public string LastName { get; set; }





        // public UserType UserType { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string? RefreshToken { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public DateTime RefreshTokenExpiryTime { get; set; }
        /// <summary>
        /// </summary>
        [NotMapped]
        public IEnumerable<string> RoleNames { get; set; }

        /// <summary>
        ///     role name
        /// </summary>

        [NotMapped]
        public IEnumerable<Role> Roles { get; set; }
    }
}
