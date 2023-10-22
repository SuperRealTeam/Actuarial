using Microsoft.AspNetCore.Mvc;

namespace Actuarial.Web.Controllers
{
    public class EmployerController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
