using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Actuarial.Domain.DTO
{
    public class ErrorLogModel
    {
        public string Message { get; set; }
        public string StackTrace { get; set; }
        public DateTime LoggedOn { get; set; }
        public Exception InnerExeption { get; set; }
        public string Source { get; set; }
    }

    public class Error
    {
        public Error(string key, string message)
        {
            Key = key;
            Message = message;
        }

        public string Key { get; set; }
        public string Message { get; set; }
    }
}
