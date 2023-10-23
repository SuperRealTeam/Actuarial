using Actuarial.Domain.DTO;
using Actuarial.Domain.Emp;
using Actuarial.Domain.Enumerable;
using Actuarial.Infrastructure.Repo.Interfaces;
using Actuarial.Infrastructure.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Actuarial.Infrastructure.Services.Classes
{
    public class DashboardServices : IDashboardServices
    {
        private readonly IUnitOfWork _unitOfWork;
        public DashboardServices(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;

        }

        public ResultClassModel<CategoryGraphModel> GetCategoriesCount()
        {
            ResultClassModel<CategoryGraphModel> result = new();
            var query = _unitOfWork.GetRepository<Employer>().GetAllAsync().Result;
            var departs = query.Select(p => p.Department).Distinct().ToList();
            
            string[] labels=new string[] { };
            long[] data= new long[] { };
            Array.Resize(ref data, Convert.ToInt16(departs.Count()));
            Array.Resize(ref labels, Convert.ToInt16(departs.Count()));

            for (int i = 0; i < departs.Count(); i++)
            {
                labels[i] = departs[i];

                data[i] = (_unitOfWork.GetRepository<Employer>().GetAllAsync(p => p.Department.Equals(departs[i].ToString())).Result).ToList().Count();
           

            }

            result.Object = new();
            result.Object.labelsheading = labels;
           result.Object.data = data;
            result.Object.label = "Departments";
            result.Object.backgroundColor = "rgb(193, 62, 62)";
            result.Object.borderWidth = 0;

            return result;
        }

        public ResultClassModel<AdminDashBoardModel> GetDashboardsCount()
        {
            ResultClassModel<AdminDashBoardModel> result = new();

            var query=_unitOfWork.GetRepository<Employer>().GetAllAsync().Result;

            AdminDashBoardModel adminDashBoard = new();
            if (query != null && query.Count() > 0)
            {
                adminDashBoard.TotalEmployers = query.Count();
                adminDashBoard.TotalMales = query.Where(p => p.Gender == 0).Count();
                adminDashBoard.TotalFemales = query.Where(p => p.Gender == 1).Count();
                adminDashBoard.TotalDepartments = query.Select(p => p.Department).Distinct().Count();
                adminDashBoard.AvgBasicSalary = Queryable.Average(query.Select(p => p.BasicSalary).AsQueryable());
                adminDashBoard.AvgTotalSalary = Queryable.Average(query.Select(p => p.TotalSalary).AsQueryable());
            }
            else
            {
                adminDashBoard.TotalEmployers = 0;
                adminDashBoard.TotalMales = 0;
                adminDashBoard.TotalFemales = 0;
                adminDashBoard.TotalDepartments = 0;
                adminDashBoard.AvgBasicSalary = 0;
                adminDashBoard.AvgTotalSalary =0;
            }
            result.Status = ActionStatus.Successfull;
            result.Object=adminDashBoard;

            return result;
        }

       
    }
}
