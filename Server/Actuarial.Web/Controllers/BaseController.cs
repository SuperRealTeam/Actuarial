using Actuarial.Domain.DTO;
using Actuarial.Domain.Enumerable;
using Actuarial.Domain.Identity;
using Actuarial.Infrastructure.Repo.Interfaces;
using Actuarial.Web.Attributes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;
using System.Reflection;
using System.Security.Claims;
using System.Text;

namespace Actuarial.Web.Controllers
{
    [AuthorizationBlocker, BasicInitialization]
    [TypeFilter(typeof(HandelExceptionFilterAttribute))]
    public class BaseController : Controller
    {
        protected User LoggedIn_User;
       

        public class AccountRequirement : IAuthorizationRequirement { }



        public class AuthorizationBlocker : ActionFilterAttribute
        {
            public override void OnActionExecuting(ActionExecutingContext actionContext)
            {
               // string secretKey = Config.BulkBillingCodeSecretKey;
                string sessionToken = actionContext.HttpContext.Request.Headers["SessionToken"].FirstOrDefault();
                var skipAuth = (actionContext.ActionDescriptor as ControllerActionDescriptor).MethodInfo.GetCustomAttributes<SkipAuthorization>().Any();

                var cController = actionContext.Controller;
                var cAction = ((Microsoft.AspNetCore.Mvc.Controllers.ControllerActionDescriptor)actionContext.ActionDescriptor).ActionName;

                //Check session is valid or not if not then throw error
                if (sessionToken != null && skipAuth != true)
                    actionContext.Result = new ObjectResult(new ResultClassModel() { Message = "Request coming from Dashboard.", Status = ActionStatus.Error });
              //  else
                    //  actionContext.Result = new ObjectResult(new ResultClassModel() { Message = "Normal request.", Status = ActionStatus.Error });


                    base.OnActionExecuting(actionContext);
            }
        }




        public Int64 GetClaimValueFromType(string type)
        {
            string value = User.Claims.Where(c => c.Type == type)
                   .Select(c => c.Value).SingleOrDefault();
            return Convert.ToInt64(value);
        }
        /// <summary>
        /// For Logged In users
        /// </summary>
     
        public string GetStringClaimValueFromType(string type)
        {
            string value = User.Claims.Where(c => c.Type == type)
                   .Select(c => c.Value).SingleOrDefault();
            return value;
        }

        public Claim GetClaimFromType(string type)
        {
            return User.Claims.Where(c => c.Type == type)
                              .SingleOrDefault();
        }

        public void UpdateClaimValueByType(string type, string value)
        {
            var user = User as ClaimsPrincipal;
            var identity = user.Identity as ClaimsIdentity;
            var claim = User.Claims.Where(c => c.Type == type)
                              .SingleOrDefault();
            if (claim != null)
            {
                identity.RemoveClaim(claim);
                identity.AddClaim(new Claim(type, value));
            }
        }

        public bool AddNewClaimintoIdentity(Claim type)
        {
            try
            {
                var user = User as ClaimsPrincipal;
                var identity = user.Identity as ClaimsIdentity;
                identity.AddClaim(type);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        #region Json Result Methods
        protected JsonResult JsonResult(List<string> resultString)
        {
            JsonResult result = Json(new ActionOutput { Status = ActionStatus.Successfull, Message = "", Results = resultString });
            return result;
        }
        protected JsonResult JsonResult(List<string> resultString, string message)
        {
            JsonResult result = Json(new ActionOutput { Status = ActionStatus.Successfull, Message = message, Results = resultString });
            return result;
        }

        protected JsonResult JsonResult(ResultClassModel actionOutput)
        {
            return Json(actionOutput);
        }
        protected JsonResult JsonResult<T>(ResultClassModel<T> actionOutput)
        {
            return Json(actionOutput);
        }
        #endregion

    }
}
