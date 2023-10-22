using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.ActionConstraints;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using System.Reflection;
using Actuarial.Domain.DTO;
using Newtonsoft.Json;
using Actuarial.Domain.Enumerable;

namespace Actuarial.Web.Attributes
{
    public class AuthenticateUser : Attribute { }

    public class Public : Attribute { }

    public class MemberAccess : Attribute { }

    public class DontValidate : Attribute { }

    public class AjaxOnlyAttribute : ActionMethodSelectorAttribute
    {
        public override bool IsValidForRequest(RouteContext routeContext, ActionDescriptor action)
        {
            return routeContext.HttpContext.Request.Headers["X-Requested-With"] == "XMLHttpRequest";
        }
    }
    public class ModuleAccessAttribute : ActionMethodSelectorAttribute
    {
        private int id { get; set; }

        public ModuleAccessAttribute(int id)
        {
            this.id = id;
        }

        public override bool IsValidForRequest(RouteContext routeContext, ActionDescriptor action)
        {
            return routeContext.HttpContext.Request.Headers["X-Requested-With"] == "XMLHttpRequest";
        }
    }

    /// <summary>
    /// This will be used to skip model validations
    /// </summary>
    public class IgnoreModelErrorsAttribute : ActionFilterAttribute
    {
        private string keysString;

        public IgnoreModelErrorsAttribute(string keys)
            : base()
        {
            this.keysString = keys;
        }

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            ModelStateDictionary modelState = filterContext.ModelState;
            string[] keyPatterns = keysString.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
            for (int i = 0; i < keyPatterns.Length; i++)
            {
                string keyPattern = keyPatterns[i]
                    .Trim()
                    .Replace(@".", @"\.")
                    .Replace(@"[", @"\[")
                    .Replace(@"]", @"\]")
                    .Replace(@"\[\]", @"\[[0-9]+\]")
                    .Replace(@"*", @"[A-Za-z0-9]+");
                IEnumerable<string> matchingKeys = modelState.Keys.Where(x => Regex.IsMatch(x, keyPattern));
                foreach (string matchingKey in matchingKeys)
                    modelState[matchingKey].Errors.Clear();
            }
        }
    }

    /// <summary>
    /// Handle exception which occurs throughout the application
    /// </summary>
    public class HandelExceptionFilterAttribute : ExceptionFilterAttribute
    {
        private readonly IWebHostEnvironment _env;
        public HandelExceptionFilterAttribute(IWebHostEnvironment env)
        {
            _env = env;
        }

        public override void OnException(ExceptionContext actionExecutedContext)
        {
            ErrorLogModel _errorModel = new ErrorLogModel() { Source = actionExecutedContext.Exception.Source, InnerExeption = actionExecutedContext.Exception.InnerException, LoggedOn = DateTime.UtcNow, Message = actionExecutedContext.Exception.Message, StackTrace = actionExecutedContext.Exception.StackTrace };
            var errorFile = string.Format("{0}{1}", _env.WebRootPath, "\\ErrorLog.txt");
            var ex = JsonConvert.SerializeObject(_errorModel);
            System.IO.StreamWriter sw = null;
            try
            {
                sw = new StreamWriter(errorFile, true); sw.WriteLine(ex); sw.WriteLine("http://jsonformat.com/");
                sw.WriteLine(ex); sw.WriteLine(""); sw.WriteLine("");
            }
            catch { }
            finally { sw.Close(); }


            ////Log error on Database
            //IErrorLogManager _err = new ErrorLogManager();
            //_err.LogExceptionToDatabase(_errorModel);

            //throw error on result
            actionExecutedContext.Result = new ObjectResult(new ResultClassModel() { Message = "An Unexpected Error Has Occured!", Status = ActionStatus.Error });
        }
    }

    /// <summary>
    /// For Logged In users
    /// </summary>
    public class AuthorizationBlocker : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext actionContext)
        {
     
            string sessionToken = actionContext.HttpContext.Request.Headers["SessionToken"].FirstOrDefault();
            var skipAuth = (actionContext.ActionDescriptor as ControllerActionDescriptor).MethodInfo.GetCustomAttributes<SkipAuthorization>().Any();

            var cController = actionContext.Controller;
            var cAction = ((Microsoft.AspNetCore.Mvc.Controllers.ControllerActionDescriptor)actionContext.ActionDescriptor).ActionName;

            //Check session is valid or not if not then throw error
            if (sessionToken != null && skipAuth != true)
                actionContext.Result = new ObjectResult(new ResultClassModel() { Message = "Request coming from Dashboard.", Status = ActionStatus.Error });
            else
                //  actionContext.Result = new ObjectResult(new ResultClassModel() { Message = "Normal request.", Status = ActionStatus.Error });

                base.OnActionExecuting(actionContext);
        }
    }

    /// <summary>
    /// For Basic Checks
    /// </summary>
    public class BasicInitialization : ActionFilterAttribute
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="actionContext"></param>
        public override void OnActionExecuting(ActionExecutingContext actionContext)
        {
           
            string sessionToken = actionContext.HttpContext.Request.Headers["SessionToken"].FirstOrDefault();
            var skipAuth = (actionContext.ActionDescriptor as ControllerActionDescriptor).MethodInfo.GetCustomAttributes<SkipAuthorization>().Any();

            var cController = actionContext.Controller;
            var cAction = ((Microsoft.AspNetCore.Mvc.Controllers.ControllerActionDescriptor)actionContext.ActionDescriptor).ActionName;

            var cc = (Microsoft.AspNetCore.Mvc.Controller)actionContext.Controller;
            if (cc.User.Identity.IsAuthenticated)
            {
                ((Microsoft.AspNetCore.Mvc.Controllers.ControllerActionDescriptor)actionContext.ActionDescriptor).ActionName = "Index";
            }

            //Check session is valid or not if not then throw error
            //if (sessionToken != null && skipAuth != true)
            //    actionContext.Result = new ObjectResult(new ResultClassModel() { Message = "Request coming from Dashboard.", Status = ActionStatus.Error });
            //else
            //      actionContext.Result = new ObjectResult(new ResultClassModel() { Message = "Normal request.", Status = ActionStatus.Error });




            base.OnActionExecuting(actionContext);
        }
    }

    /// <summary>
    /// methods marked with this will not be checked for authorization
    /// </summary>
    public class SkipAuthorization : Attribute { }

    /// <summary>
    /// methods marked with this will not be checked for authentication
    /// </summary>
    public class SkipAuthentication : Attribute { }

    /// <summary>
    /// validates the incomming model
    /// </summary>
    ///
    public class ValidateModelActionFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext actionContext)
        {
            // do something before the action executes
            if (!actionContext.ModelState.IsValid)
            {
                //Check made for attribute if SkipModelValidation attribute is exist then skip this validation error 
                if (!(actionContext.ActionDescriptor as ControllerActionDescriptor).MethodInfo.GetCustomAttributes<SkipModelValidation>(false).Any())
                    actionContext.Result = new ObjectResult(new ResultClassModel() { Message = "Validation Error!", Status = ActionStatus.Error });
            }
        }

        public override void OnActionExecuted(ActionExecutedContext actionContext)
        {
            // do something after the action executes
            base.OnActionExecuted(actionContext);
        }
    }

    public class MayNeedAuthentication : Attribute { }
    //This attribute skip the model validation if any exist
    public class SkipModelValidation : Attribute { }


    public class ErrorResultObjectResult : ObjectResult
    {
        public ErrorResultObjectResult(object value) : base(value)
        {
            StatusCode = StatusCodes.Status500InternalServerError;
        }
    }

    /// <summary>
    /// 
    /// </summary>
    public class UnprocessableObjectResult : ObjectResult
    {
        public UnprocessableObjectResult(object value)
            : base(value)
        {
            StatusCode = StatusCodes.Status422UnprocessableEntity;

        }

        public UnprocessableObjectResult(ModelStateDictionary modelState)
            : this(new SerializableError(modelState))
        { }
    }

    /// <summary>
    /// 
    /// </summary>
    public class AuthorizeRequestFilterAttribute : Attribute,
       IResourceFilter
    {
        public void OnResourceExecuting(ResourceExecutingContext context)
        {
            //context.Result = new ContentResult()
            //{
            //    Content = "Resource unavailable - header should not be set"
            //};
        }

        public void OnResourceExecuted(ResourceExecutedContext context)
        {
            //final call
            context.Result = new ObjectResult(new ResultClassModel() { Message = "OnResource Executed final call!", Status = ActionStatus.Error });
        }
    }
}
