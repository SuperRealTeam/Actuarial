using Actuarial.Domain.Identity;
using Actuarial.Infrastructure.Repo.Interfaces;
using Actuarial.Infrastructure.Repo;
using Microsoft.AspNetCore.Identity;

namespace Actuarial.Web.Init
{

    /// <summary>
    /// </summary>
    public static class SeedDataInDatabase
    {
        /// <summary>
        /// </summary>
        /// <param name="serviceProvider">
        /// </param>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        public static async Task SeedData(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<Role>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<User>>();
            var unitOfWork = serviceProvider.GetRequiredService<IUnitOfWork>();

            await IdentityDataInitializer.SeedRoles(roleManager);
            await IdentityDataInitializer.SeedUser(userManager);

        
            await unitOfWork.CommitAsync();
        }
    }
}
