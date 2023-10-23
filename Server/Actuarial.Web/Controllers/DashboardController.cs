using Actuarial.Domain.DTO;
using Actuarial.Infrastructure.Services.Interfaces;
using Actuarial.Web.Attributes;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Actuarial.Web.Controllers
{
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
    
    public class DashboardController : BaseController
    {
        private readonly IDashboardServices _dashboardServices;
        public DashboardController(IDashboardServices dashboardServices)
        {
                _dashboardServices = dashboardServices;
        }
        public IActionResult Dashboard()
        {

            ResultClassModel<AdminDashBoardModel> retmodel = new ResultClassModel<AdminDashBoardModel>();
            retmodel = _dashboardServices.GetDashboardsCount();

            return View(retmodel);
        }


        [HttpPost, AjaxOnly]
        public JsonResult GetCategoriesGraph(string suburb, int? catType, int? level1Id, int? level2Id)
        {
            var result = new ResultClassModel<CategoryGraphModel>();

            result = _dashboardServices.GetCategoriesCount();
            return JsonResult(result);
        }
    }
}
