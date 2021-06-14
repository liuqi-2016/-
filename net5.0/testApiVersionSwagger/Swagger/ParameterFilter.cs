using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using testApiVersionSwagger.ModelBinder;

namespace testApiVersionSwagger.Swagger
{
    /// <summary>
    /// 
    /// </summary>
    public class ParameterFilter : IOperationFilter
    {
        /// <summary>
        /// Action过滤器，每个Action都会走一遍这个里，所有可以在这里对Action做些操作
        /// </summary>
        /// <param name="operation"></param>
        /// <param name="context"></param>
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {

            //Action是否标识了 TokenValidateAttribute 特性
            var hasTokenValidate = context.ApiDescription.ActionDescriptor.FilterDescriptors.Select(filter => filter.Filter).Any(filter => filter is TokenValidateAttribute);
            //标记了token验证特性，就做些操作
            if (hasTokenValidate)
            {
                //Action本身是否包含了参数，没有就实例化一个参数列表
                if (operation.Parameters == null)
                {
                    operation.Parameters = new List<OpenApiParameter>();
                }
                //只有FromQuery，从地址栏获取的参数才会加到operation.Parameters中
                //.net5.0参数不设置[FromXXX]，默认是[FromBody]，从请求body中获取，TokenModel这个参数要设置从Query中获取，即给参数增加[FromQuery]特性
                //查找Action是否存在TokenModel类型的参数
                //存在：全部查出来并循环，然后将这个类型参数的字段删除
                context.ApiDescription.ParameterDescriptions
                    .Where(desc => desc.ParameterDescriptor != null && desc.ParameterDescriptor.ParameterType != null && desc.ParameterDescriptor.ParameterType == typeof(TokenModel))
                    .ToList()
                    .ForEach(param =>
                    {
                        //删除TokenModel类型参数的字段
                        var toRemove = operation.Parameters.FirstOrDefault(p => p.Name == param.Name);
                        if (toRemove != null)
                        {
                            operation.Parameters.Remove(toRemove);
                        }
                    });

                //添加Token参数
                operation.Parameters.Add(new OpenApiParameter()
                {
                    Name = "token",
                    In = ParameterLocation.Header,
                    Description = "访问token",
                    Required = true,
                    //必须添加Schema信息，否则对应的验证将不起作用
                    Schema = new OpenApiSchema()
                    {
                        Type = "string"
                    }
                });

            }

        }
    }
}
