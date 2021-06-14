using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace testApiVersionSwagger.ModelBinder
{
    /// <summary>
    /// TokenModel模型绑定，这里给Action中 TokenModel类型的参数设置值
    /// </summary>
    public class TokenModelBinder : IModelBinder
    {


        /// <summary>
        /// 如果需要其他对象，可以在这里构造函数注入的方式加入进来
        /// </summary>
        public TokenModelBinder()
        {

        }

        /// <summary>
        /// 设置绑定模型的值
        /// </summary>
        /// <param name="bindingContext"></param>
        /// <returns></returns>
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {

            if (bindingContext == null)
            {
                throw new ArgumentNullException(nameof(bindingContext));
            }


            //bindingContext.Result = ModelBindingResult.Success(null);

            return Task.CompletedTask;

        }
    }
}
