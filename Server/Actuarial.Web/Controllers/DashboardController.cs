using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Actuarial.Web.Controllers
{
 
    public class DashboardController : BaseController
    {
        public IActionResult Dashboard()
        {
            return View();
        }
    }
}
