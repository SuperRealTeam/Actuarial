using Actuarial.Domain.DTO;
using Actuarial.Domain.Emp;
using Actuarial.Domain.Enumerable;
using Actuarial.Domain.Identity;
using Actuarial.Infrastructure.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Actuarial.Web.Controllers
{
    public class EmployerController : BaseController
    {
        private readonly IEmpServcies _employer;
        public EmployerController(IEmpServcies empServcies)
        {
            _employer = empServcies;
        }
        public  IActionResult Employers()
        {
            ResultClassModel<Employer> model = new ResultClassModel<Employer>();
            var result =  _employer.GetEmpPagedList(new EmployerRequestModel() { RecordsPerPage = 10, SortBy = "Id", SortOrder = "Desc" });
            if (result.Status == ActionStatus.Successfull)
                model = result;
            return View(model);
        }
    }
}
