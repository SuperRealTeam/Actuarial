using Actuarial.Domain.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Actuarial.Domain.DTO
{
    public partial class Token
    {
        public uint TokenId { get; set; }
        public string Token1 { get; set; }
        public uint? Otp { get; set; }
        public DateTime? ExpiryTime { get; set; }
        public DateTime? CreatedDate { get; set; }
        public Guid UserLoginId { get; set; }
        public int? DeviceType { get; set; }
        public string DeviceToken { get; set; }
        public bool? IsExpired { get; set; }
        public string VoicToken { get; set; }

        public User UserLogin { get; set; }
    }
}
