using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;

namespace Actuarial.Web.Extensions
{
    public static class ServiceExtensions
    {
        public static IServiceCollection RegisterServices(
            this IServiceCollection services)
        {
           
            // Add all other services here.
            return services;
        }

      
    }
}
