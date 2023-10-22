using Actuarial.Domain.Identity;
using Actuarial.Infrastructure.Repo.Interfaces;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Actuarial.Infrastructure.Repo
{
    public static class IdentityDataInitializer
    {
        public static async Task SeedRoles(RoleManager<Role> roleManager)
        {
            Task.Run(async () =>
            {
                //Check if Role Exists
                var adminRole = new Role { Name = "Admin", Description = "Administrator role with full permissions" };
                var adminRoleInDb = await roleManager.FindByNameAsync("Admin");
                if (adminRoleInDb == null)
                {
                    await roleManager.CreateAsync(adminRole);
                    adminRoleInDb = await roleManager.FindByNameAsync("Admin");

                }
               

            }).GetAwaiter().GetResult();
        }

        public static async Task SeedUser(UserManager<User> userManager)
        {

            var superUser = new User
            {
                FirstName = "Admin",
                LastName = "Admin",
                Email = "admin@demo.com",
                UserName = "admin",
                EmailConfirmed = true,
                PhoneNumberConfirmed = true,
                SecurityStamp=Guid.NewGuid().ToString(),    
                
            };
            var superUserInDb = await userManager.FindByEmailAsync(superUser.Email);
            if (superUserInDb == null)
            {
               var result= await userManager.CreateAsync(superUser, "P@ssw0rd");
                if (result.Succeeded)
                {
                 await userManager.AddToRoleAsync(superUser, "Admin");
                }

            }

        }

      
    }
  
}
