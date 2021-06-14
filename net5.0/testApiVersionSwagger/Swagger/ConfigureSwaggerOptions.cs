using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace testApiVersionSwagger.Swagger
{
    /// <summary>
    /// 动态配置swagger文档生成
    /// 通过【IApiVersionDescriptionProvider】Api版本服务为每个API版本生成对应的swagger文档
    /// </summary>
    public class ConfigureSwaggerOptions : IConfigureOptions<SwaggerGenOptions>
    {

        /// <summary>
        /// API版本描述
        /// </summary>
        readonly IApiVersionDescriptionProvider provider;

        /// <summary>
        /// 初始化，自动注入API版本描述，这个将用于生成swagger文档
        /// </summary>
        /// <param name="provider"></param>
        public ConfigureSwaggerOptions(IApiVersionDescriptionProvider provider)
        {
            this.provider = provider;
        }

        /// <summary>
        /// 根据API版本描述 生成swagger文档
        /// </summary>
        /// <param name="options"></param>
        public void Configure(SwaggerGenOptions options)
        {
            //为每个发现的API版本生成swagger文档
            //这里可以自定义跳过过期的版本
            foreach (var desc in provider.ApiVersionDescriptions)
            {
                options.SwaggerDoc(desc.GroupName, new OpenApiInfo()
                {
                    Title = "dynomic SwaggerDoc",
                    Version = desc.ApiVersion.ToString(),
                    Description = "动态生成的swagger文档",
                    Contact = new OpenApiContact() { Name = "liuwh5", Email = "liuwh5@qq.com" }
                });
            }
        }
    }
}
