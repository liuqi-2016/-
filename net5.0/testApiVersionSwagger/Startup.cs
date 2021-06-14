using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.PlatformAbstractions;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using testApiVersionSwagger.ModelBinder;
using testApiVersionSwagger.Swagger;

namespace testApiVersionSwagger
{
    /// <summary>
    /// 
    /// </summary>
    public class Startup
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="configuration"></param>
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        /// <summary>
        /// 
        /// </summary>
        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //添加版本发现，使用 AddMvc 或  AddControllers 自动启用版本发现
            //使用 AddMvcCore 需要手动添加版本发现 AddApiExplorer
            //services.AddControllers();
            services.AddMvcCore(c =>
            {
                //自定义模型绑定提供程序在这里添加，添加到第一个，是因为查询顺序是从上往下，找的第一个对应的就使用第一个 后面如果还要对应的将不起作用
                c.ModelBinderProviders.Insert(0, new TokenModelBinderProvider());
            }).AddApiExplorer();

            //添加版本号服务
            services.AddApiVersioning(options =>
            {
                //在response的header中报道版本号
                options.ReportApiVersions = true;
                //在没有指定版本号时，假设为默认的版本号
                options.AssumeDefaultVersionWhenUnspecified = true;
                //设置默认版本
                options.DefaultApiVersion = new ApiVersion(1, 0);
            });

            //IApiVersionDescriptionProvider 添加API版本描述服务
            services.AddVersionedApiExplorer(
                options =>
                {
                    //设置版本格式，这会自动在版本前面增加: v  符号
                    options.GroupNameFormat = "'v'VVV";
                    //如果在路由中设置了 {version:apiVersion} 参数，这里设置为true，会自动将参数替换为真实的版本号
                    options.SubstituteApiVersionInUrl = true;
                });

            //动态生成swagger文档
            services.AddTransient<IConfigureOptions<SwaggerGenOptions>, ConfigureSwaggerOptions>();
            services.AddSwaggerGen(options =>
            {

                //Action参数自定义操作
                options.OperationFilter<ParameterFilter>();

                //包含注解
                var basePath = PlatformServices.Default.Application.ApplicationBasePath; //PlatformServices 要安装扩展 Microsoft.Extensions.PlatformAbstractions
                var fileName = typeof(Startup).GetTypeInfo().Assembly.GetName().Name + ".xml";
                options.IncludeXmlComments(Path.Combine(basePath, fileName));

            });
            //services.AddSwaggerGen(c =>
            //{
            //    c.SwaggerDoc("v1", new OpenApiInfo { Title = "testApiVersionSwagger", Version = "v1" });
            //});


        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IApiVersionDescriptionProvider provider)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseSwagger();
            //动态生成swagger文档需要的json数据
            app.UseSwaggerUI(options =>
            {
                foreach (var desc in provider.ApiVersionDescriptions)
                {
                    options.SwaggerEndpoint($"/swagger/{desc.GroupName}/swagger.json", desc.GroupName.ToLowerInvariant());
                }
            });
            //app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1.0/swagger.json", "v1.0"));

            app.UseHttpsRedirection();

            app.UseRouting();

            //app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
