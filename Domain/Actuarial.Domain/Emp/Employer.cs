using Actuarial.Domain.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Actuarial.Domain.Emp
{
    [Table("EMPLOYERS")]
    public class Employer:BaseEntityDomain
    {
        public string Name { get; set; }

        public int Gender { get; set; }

        public DateTime Birthday { get; set; }

        public DateTime DOH { get; set; }
        public string Department { get; set; }
        public decimal BasicSalary { get; set; }
        public decimal TotalSalary { get; set; }
        public int Mflg { get; set; }
        
        
    }
}
