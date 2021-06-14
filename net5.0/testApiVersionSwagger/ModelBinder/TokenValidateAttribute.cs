using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace testApiVersionSwagger.ModelBinder
{
    /// <summary>
    /// Token验证，在Action执行时
    /// </summary>
    public class TokenValidateAttribute : ActionFilterAttribute
    {


        public override void OnActionExecuting(ActionExecutingContext context)
        {


            base.OnActionExecuting(context);
        }

    }
}
