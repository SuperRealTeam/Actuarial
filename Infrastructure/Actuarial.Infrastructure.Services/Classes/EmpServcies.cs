using Actuarial.Common.Resource;
using Actuarial.Domain.DTO;
using Actuarial.Domain.Emp;
using Actuarial.Domain.Enumerable;
using Actuarial.Infrastructure.Repo.Interfaces;
using Actuarial.Infrastructure.Services.Interfaces;
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
            var query=_unitOfWork.GetRepository<Employer>().GetAllAsync(p=>p.BasicSalary.ToString()==model.Search||p.Birthday.ToString()==model.Search||p.Name.Contains(model.Search)).Result;
            result.List = query.ToList();
            result.Status = ActionStatus.Successfull;
            result.Message = CommonResource.List;
            result.TotalCount = query.Count();
            return result;
        }
    }
}
