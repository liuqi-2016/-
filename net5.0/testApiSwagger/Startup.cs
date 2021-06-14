using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using testApiSwagger.Conventions;
using testApiSwagger.SwaggerFilters;

namespace testApiSwagger
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

        /// This method gets called by the runtime. Use this method to add services to the container. 
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers(c =>
            {
                //自定义约定实现让Action分配到对应的swagger文档中显示
                c.Conventions.Add(new CustomerActionShowToDocConvention());
            });
            services.AddSwaggerGen(c =>
            {
                //生成多个swagger文档
                //配置了多个swagger文档，那么需要为对应的文档名称(v1 v2等这些)添加SwaggerEndPoint，否则将显示不了对应文档名称的接口信息
                /*
                    指定哪些Action显示在哪个swagger文档中，原理都是指定GroupName
                    1.给Action添加ApiExplorerSettings特性，指定GroupName为对应显示到的文档名称（v1 v2等）
                    2.继承IControllerModelConvention，实现里面的Apply方法，在里面设置 controller.ApiExplorer.GroupName，在上面的AddControllers中添加这个实现的约定
                    3.重写默认的Action选择过程，就是下面的DocInclusionPredicate，返回true就显示在文档中
                 */
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "testApiSwagger", Version = "v1" });
                c.SwaggerDoc("v2", new OpenApiInfo { Title = "testApiSwagger", Version = "v2" });


                //自定义Action选择过程，默认是通过 GroupName 分配Action到对应的swagger文档，默认的判断是 GroupName为null或跟当前选择的文档名称相同就返回true，返回true就会显示在文档
                //选择文档名称后，每个Action都会走一遍这个方法，通过返回true 或 false来做显示或不显示在文档中
                c.DocInclusionPredicate((docName, apiDesc) =>
                      {
                          if (!apiDesc.TryGetMethodInfo(out MethodInfo methodInfo)) return false;

                          return true;
                      });

                /*
                 省略过时的Action或Controller
                    1.设置Obsolute 特性
                    2.设置[ApiExplorerSettings(IgnoreApi = true)]特性
                    3.自定义约定，实现 IActionModelConvention 接口判断
                 */
                c.IgnoreObsoleteActions();
                c.IgnoreObsoleteProperties(); //针对实体类的属性，如果这个实体类作为Action的一个入参，那么是不会被省略的


                /*
                    在文档中分组显示Action
                    1.将不同类别的Action归类到一个手风琴的分组中显示，方便管理
                    2.对Action进行排序显示
                 */
                c.TagActionsBy(apiDesc =>
                {
                    return new string[] { $"{apiDesc.HttpMethod}" }; //这里是将Action通过请求类型分组 Get Post Put Delete等，属于一类的就放到一起
                });
                //这里设置Action的排序规则，这是在分组之前进行的排序
                //c.OrderActionsBy((apiDesc) => $"{apiDesc.ActionDescriptor.RouteValues["controller"]}_{apiDesc.ActionDescriptor.DisplayName}");


                //加载XML描述文档，可以加载多个，会自动合并
                var filePath = Path.Combine(System.AppContext.BaseDirectory, "testApiSwagger.xml");
                c.IncludeXmlComments(filePath);

                //三类扩展生成器(过滤器)：Operation  Schema  Document ，用于生成更加丰富的自定义信息
                c.OperationFilter<CustomerOperationFilter>();
                c.DocumentFilter<CustomerDocumentFilter>();
            });

        }

        /// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();

            }
            app.UseSwagger(c =>
            {
                //自定义swagger路由端点/swagger/{documentName}/swagger.json, documentName 对应的是上面添加的 SwaggerDoc 的名称（v1 v2等）
                //同时要对 SwaggerEndpoint 做相应的变更
                c.RouteTemplate = "api-test/{documentName}/swagger.json";
            });
            app.UseSwaggerUI(c =>
            {
                //路由前缀默认为：swagger，如果重新指定需要用新指定的前缀：xxx:90/api-demo/index.html
                c.RoutePrefix = "api-demo";
                //要匹配上 RouteTemplate 的设置，这里是根据上面配置的 RouteTemplate 来获取swagger对接口的描述信息json文件的
                c.SwaggerEndpoint("/api-test/v1/swagger.json", "testApiSwagger v1");
                c.SwaggerEndpoint("/api-test/v2/swagger.json", "testApiSwagger v2");
            });

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
