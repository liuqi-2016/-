using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace testApiSwagger.SwaggerFilters
{
    /// <summary>
    /// 自定义操作过滤器，每个Action都会走一遍这里
    /// </summary>
    public class CustomerOperationFilter : IOperationFilter
    {
        /// <summary>
        /// 这里可以对Action做自定义设置
        /// </summary>
        /// <param name="operation"></param>
        /// <param name="context"></param>
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {

        }
    }
}
