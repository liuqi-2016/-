using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace testApiVersionSwagger.ModelBinder
{
    /// <summary>
    /// 模型绑定提供程序，可以通过ModelType判断 使用哪个自定义模型绑定
    /// </summary>
    public class TokenModelBinderProvider : IModelBinderProvider
    {
        /// <summary>
        /// 获取模型绑定类型
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public IModelBinder GetBinder(ModelBinderProviderContext context)
        {

            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            //判断当前要绑定的模型参数类型
            if (context.Metadata.ModelType == typeof(TokenModel))
            {
                return new TokenModelBinder();
            }

            return null;
        }
    }
}
