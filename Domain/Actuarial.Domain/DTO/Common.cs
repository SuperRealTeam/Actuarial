using Actuarial.Domain.Constant;
using Actuarial.Domain.Enumerable;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Actuarial.Domain.DTO
{
    public class ActionOutputBase
    {
        public ActionStatus Status { get; set; }
        public String Message { get; set; }
        public List<String> Results { get; set; }
    }

    public class ActionOutput<T> : ActionOutputBase
    {
        public T Object { get; set; }
        public List<T> List { get; set; }
    }

    public class ActionOutput : ActionOutputBase
    {
    }

    public class ResultClassModel
    {
        public int ID { get; set; }
        public string sUID { get; set; }
        public String Message { get; set; }
        public ActionStatus Status { get; set; }
        public List<Error> errors { get; set; }
        public ResultClassModel() { }
        public ResultClassModel(ActionOutput result)
        {
            Message = result.Message;
            Status = result.Status;
        }
    }
    public class ResultClassModel<T> : ActionOutput
    {
        public int ID { get; set; }
        public string sUID { get; set; }
        public T Object { get; set; }
        public List<T> List { get; set; }
        public int TotalCount { get; set; }

    }

    public class PagingResult<T>
    {
        public List<T> List { get; set; }
        public int TotalCount { get; set; }
        public ActionStatus Status { get; set; }
        public String Message { get; set; }
    }

    public class PagingModel
    {
        public int PageNo { get; set; }
        public int RecordsPerPage { get; set; }
        public PagingModel()
        {
            if (PageNo <= 1)
            {
                PageNo = 1;
            }
            if (RecordsPerPage <= 0)
            {
                RecordsPerPage = AppDefaults.PageSize;
            }
        }

        public string SortBy { get; set; }
        public string SortOrder { get; set; }
        public int UserID { get; set; }
        public string Search { get; set; }

        public static PagingModel DefaultModel(string sortBy = "CreatedOn", string sortOder = "Asc")
        {
            return new PagingModel { PageNo = 1, RecordsPerPage = 10, SortBy = sortBy, SortOrder = sortOder };
        }
    }
   

 
  
    public class PagingRequestModel : PagingModel
    {
        public DateTime? minDate { get; set; }
        public DateTime? maxDate { get; set; }
        public int? Status { get; set; }
    }


    public class EmployerRequestModel : PagingModel
    {
        
    }



    public class PasswordEncryptedModel
    {
        public string Password { get; set; }
        public string Password_Salt { get; set; }
    }
  
   

   

}
