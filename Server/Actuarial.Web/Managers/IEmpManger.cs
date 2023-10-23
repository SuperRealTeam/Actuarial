using Actuarial.Domain.DTO;
using System.Data;

namespace Actuarial.Web.Managers
{
    public interface IEmpManger
    {
        ResultClassModel<DataTable> Documentupload(IFormFile formFile);
       // DataTable CustomerDataTable(string path);
        void ImportCustomer(DataTable customer,HttpContext httpContext);
    }
}
