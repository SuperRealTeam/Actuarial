using Actuarial.Common.Resource;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Actuarial.Domain.DTO
{
    /// <summary>
    /// Login Model this will be  used to login in the application
    /// </summary>
    public class LoginModal
    {
        [Required(ErrorMessageResourceType = typeof(CommonResource),
         ErrorMessageResourceName = "Required")]
        [RegularExpression(@"^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-??]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$", ErrorMessage = "Invalid Email")]
        [StringLength(50, ErrorMessageResourceType = typeof(UserResource),
        ErrorMessageResourceName = "MaximumLength50")]
        public string UserName { get; set; }

        [Required(ErrorMessageResourceType = typeof(CommonResource),
 ErrorMessageResourceName = "Required")]
        [StringLength(20, MinimumLength = 6, ErrorMessageResourceType = typeof(CommonResource),
        ErrorMessageResourceName = "PasswordLength")]
        public string Password { get; set; }
        
        public bool RememberMe { get; set; }
       

    }
    public class UserModel
    {
        public uint UserId { get; set; }
        public string UserUniqueId { get; set; }
        [Required(ErrorMessageResourceType = typeof(CommonResource),
ErrorMessageResourceName = "Required")]
        [RegularExpression(@"^[a-zA-Z ]+$", ErrorMessageResourceType = typeof(UserResource),
        ErrorMessageResourceName = "OnlyAlphabetics")]
        [StringLength(25, ErrorMessageResourceType = typeof(UserResource),
        ErrorMessageResourceName = "MaximumLength15")]
        public string FirstName { get; set; }
        [Required(ErrorMessageResourceType = typeof(CommonResource),
ErrorMessageResourceName = "Required")]
        
        [StringLength(25, ErrorMessageResourceType = typeof(UserResource),
        ErrorMessageResourceName = "MaximumLength15")]
        public string LastName { get; set; }
        [Required(ErrorMessageResourceType = typeof(CommonResource),
ErrorMessageResourceName = "Required")]
        [RegularExpression(@"^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-??]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$", ErrorMessageResourceType = typeof(CommonResource),
        ErrorMessageResourceName = "InvalidEmail")]
        [StringLength(50, ErrorMessageResourceType = typeof(UserResource),
        ErrorMessageResourceName = "MaximumLength50")]
        public string Email { get; set; }
    


       

        public UserModel() { }
    }

    public class UserDetails : UserModel
    {
        public String ProfilePicture { get; set; }
        public String UserName { get; set; }
        public String UserEmail { get; set; }
        public bool? IsActive { get; set; }
      
        public DateTime? LastUpdated { get; set; }
        public bool IsAuthenticated { get; set; }
     
       
        public string token { get; set; }

    }

    public class ForgetPasswordModel
    {
        [Required(ErrorMessageResourceType = typeof(CommonResource),
        ErrorMessageResourceName = "Required")]
        [RegularExpression(@"^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-??]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$", ErrorMessage = "Invalid Email")]
        public string Email { get; set; }



    }

    public class ForgetPasswordResponseModel
    {
        //[Required(ErrorMessageResourceType = typeof(CommonResource),
        //ErrorMessageResourceName = "Required")]
        //[RegularExpression(@"^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-??]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$", ErrorMessage = "Invalid Email")]
        //public string Email { get; set; }
        public string uID { get; set; }
        public int OTP { get; set; }
       

    }

}
