using Actuarial.Common.Resource;
using Actuarial.Domain.DTO;
using Actuarial.Domain.Emp;
using Actuarial.Domain.Enumerable;
using Actuarial.Domain.Identity;
using Actuarial.Infrastructure.Repo.Interfaces;
using Actuarial.Infrastructure.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Actuarial.Infrastructure.Services.Classes
{
    public class EmpServcies : IEmpServcies
    {
        private readonly IUnitOfWork _unitOfWork;
        
        public EmpServcies(IUnitOfWork unitOfWork)
        {
                _unitOfWork = unitOfWork;
          
        }
        public  ResultClassModel<Employer> GetEmpPagedList(EmployerRequestModel model)
        {
            ResultClassModel<Employer> result = new();
            var skipRec = 0;
            var pageNum = model.PageNo - 1;
            if (pageNum > 0)
                skipRec = pageNum * model.RecordsPerPage;
            var query=_unitOfWork.GetRepository<Employer>().GetAllAsync(null,null,"Owner").Result;
            var pi = typeof(Employer).GetProperty(model.SortBy);
            if (model.SortOrder.Equals("Desc"))
            {
                query = query.OrderByDescending(x => pi.GetValue(x, null));
            }
            else
            {
                query = query.OrderBy(x => pi.GetValue(x, null));
            }
            if (!string.IsNullOrEmpty(model.Search))
            {
                query = query.Where(p =>  p.Birthday.ToString().Contains(model.Search)||p.DOH.ToString().Contains(model.Search) || p.Name.Contains(model.Search)||p.Gender==(model.Search.Contains("Female")?1:0)||p.BasicSalary.ToString().Contains(model.Search)||p.TotalSalary.ToString().Contains(model.Search));
            }
          
                result.List = query.Skip(skipRec).Take(model.RecordsPerPage).ToList();
            result.Status = ActionStatus.Successfull;
            result.Message = CommonResource.List;
            result.TotalCount = query.Count();
            return result;
        }
    }
}
