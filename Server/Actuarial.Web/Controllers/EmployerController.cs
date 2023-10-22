using Microsoft.AspNetCore.Mvc;

namespace Actuarial.Web.Controllers
{
    public class EmployerController : Controller
    {
        public IActionResult Employers()
        {
            return View();
        }
    }
}
