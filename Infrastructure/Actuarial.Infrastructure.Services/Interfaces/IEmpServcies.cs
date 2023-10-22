using Actuarial.Domain.DTO;
using Actuarial.Domain.Emp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Actuarial.Infrastructure.Services.Interfaces
{
    public interface IEmpServcies
    {
        ResultClassModel<Employer> GetEmpPagedList(EmployerRequestModel employerRequest);
    }
}
