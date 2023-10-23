using Actuarial.Domain.DTO;
using Actuarial.Domain.Emp;
using Actuarial.Domain.Enumerable;
using Actuarial.Domain.Identity;
using Actuarial.Infrastructure.Services.Interfaces;
using Actuarial.Web.Attributes;
using Actuarial.Web.Extensions;
using Actuarial.Web.Managers;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace Actuarial.Web.Controllers
{
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
    
    public class EmployerController : BaseController
    {
        private readonly IEmpServcies _employer;
        private readonly IEmpManger _empManger;
        private readonly ViewRender view;
        public EmployerController(IEmpServcies empServcies,IEmpManger empManger,ViewRender _view)
        {
            _employer = empServcies;
            _empManger = empManger;
            this.view = _view;
        }
        public  IActionResult Employers()
        {
            ResultClassModel<Employer> model = new ResultClassModel<Employer>();
            var result =  _employer.GetEmpPagedList(new EmployerRequestModel() { RecordsPerPage = 10, SortBy = "Id", SortOrder = "Desc" });
            if (result.Status == ActionStatus.Successfull)
                model = result;
            return View(model);
        }
        [AjaxOnly,HttpPost]
        public JsonResult GetEmployersPagingList(EmployerRequestModel reqModel)
        {
            ResultClassModel<Employer> model = new ResultClassModel<Employer>();
            model = _employer.GetEmpPagedList(reqModel);
            var html = this.view.Render("Partials/_employers", model);
            List<string> resultString = new List<string>();
            resultString.Add(html.ToString());
            resultString.Add(model.TotalCount.ToString());
            return JsonResult(resultString);
        }
        public IActionResult ImportEmps()
        {

            return View();
        }

        [HttpPost]
        [AutoValidateAntiforgeryToken]
        public IActionResult ImportEmps(IFormFile fromFiles)
        {
            ResultClassModel<DataTable> result = _empManger.Documentupload(fromFiles);
            if (result.Status == ActionStatus.Successfull)
            {
                _empManger.ImportCustomer(result.Object,HttpContext);
            }
            else
            {
                ModelState.AddModelError("Error",result.Message);
            }
            return View();
        }
    }
}
