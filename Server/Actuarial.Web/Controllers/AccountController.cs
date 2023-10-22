using Actuarial.Web.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Security.Claims;
using Actuarial.Web.Attributes;
using Actuarial.Domain.DTO;
using Newtonsoft.Json;
using Actuarial.Domain.Enumerable;
using Microsoft.AspNetCore.Identity;
using Actuarial.Domain.Identity;
using Actuarial.Infrastructure.Repo.Interfaces;
using Actuarial.Common.Resource;
using Actuarial.Web.Extensions;

namespace Actuarial.Web.Controllers
{
    public class AccountController : BaseController
    {
        private readonly ILogger<AccountController> _logger;
        protected readonly IUnitOfWork _unitOfWork;




        private readonly SignInManager<User> _signInManager;

        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly ViewRender view;
        public AccountController(ILogger<AccountController> logger,SignInManager<User> signInManager,UserManager<User> userManager,RoleManager<Role> roleManager, ViewRender view)
        {
            _logger = logger;
            _signInManager = signInManager;
            _userManager = userManager;
            _roleManager = roleManager;
            this.view=view;
        }

        public IActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// Login get
        /// </summary>
        /// <returns></returns>
        public IActionResult Login(string id)
        {
            return View(new LoginModal() {  });
        }
        [HttpPost, AjaxOnly]
        public async Task<JsonResult> LoginUser(LoginModal model)
        {
            if (!this.ModelState.IsValid)
            {
                var errorList = this.ModelState.ToDictionary(
                    x => x.Key.Replace("model.", string.Empty),
                    x => x.Value.Errors[0].ErrorMessage);

                return JsonResult(new ResultClassModel() { Status = ActionStatus.Error, Message = "Validation Error!" });
            }
            var user = await _userManager.FindByEmailAsync(model.UserName);
            if (user == null)
            {
                return JsonResult(new ResultClassModel() { Status = ActionStatus.Error, Message = "User Not Found." }); 
            }

          
            var passwordValid = await _userManager.CheckPasswordAsync(user, model.Password);
            if (!passwordValid)
            {
                return JsonResult(new ResultClassModel() { Status = ActionStatus.Error, Message = " Invalid Credentials." });
            }


            LoggedIn_User = user;
            var newSession = new Token()
            {
                CreatedDate = DateTime.Now,
                Token1 = Guid.NewGuid().ToString(),
                UserLoginId = user.Id,
            };
            // Create the identity from the user info
            var identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme, LoggedIn_User.Email,"Admin");
            identity.AddClaim(new Claim("Email", LoggedIn_User.Email));
            identity.AddClaim(new Claim("FirstName", LoggedIn_User.FirstName));
            identity.AddClaim(new Claim("LastName", LoggedIn_User.LastName));
            identity.AddClaim(new Claim("Session", newSession.Token1));
            identity.AddClaim(new Claim("userRoleID", "Admin"));
            identity.AddClaim(new Claim("UserId", LoggedIn_User.Id.ToString()));
           
            var principal = new ClaimsPrincipal(identity);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, new AuthenticationProperties { IsPersistent = model.RememberMe, ExpiresUtc = DateTime.UtcNow.AddDays(25) });
           
            
            var result = new ResultClassModel<User>();
            result.Object = user;
            result.Message = UserResource.UserDetails;
            result.Status = ActionStatus.Successfull;
            return JsonResult(result);
          
          
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}