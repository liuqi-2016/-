using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace testApiSwagger.SwaggerFilters
{
    /// <summary>
    /// 
    /// </summary>
    public class CustomerDocumentFilter : IDocumentFilter
    {
        /// <summary>
        /// 这里对文档信息做自定义设置
        /// </summary>
        /// <param name="swaggerDoc"></param>
        /// <param name="context"></param>
        public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context)
        {

        }
    }
}
