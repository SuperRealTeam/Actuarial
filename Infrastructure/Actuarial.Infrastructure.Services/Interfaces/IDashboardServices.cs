using Actuarial.Domain.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Actuarial.Infrastructure.Services.Interfaces
{
    public interface IDashboardServices
    {
        ResultClassModel<AdminDashBoardModel> GetDashboardsCount();
        ResultClassModel<CategoryGraphModel> GetCategoriesCount();
    }
}
