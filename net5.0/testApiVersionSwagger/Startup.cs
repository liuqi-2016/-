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
            //��Ӱ汾���֣�ʹ�� AddMvc ��  AddControllers �Զ����ð汾����
            //ʹ�� AddMvcCore ��Ҫ�ֶ���Ӱ汾���� AddApiExplorer
            //services.AddControllers();
            services.AddMvcCore(c =>
            {
                //�Զ���ģ�Ͱ��ṩ������������ӣ���ӵ���һ��������Ϊ��ѯ˳���Ǵ������£��ҵĵ�һ����Ӧ�ľ�ʹ�õ�һ�� ���������Ҫ��Ӧ�Ľ���������
                c.ModelBinderProviders.Insert(0, new TokenModelBinderProvider());
            }).AddApiExplorer();

            //��Ӱ汾�ŷ���
            services.AddApiVersioning(options =>
            {
                //��response��header�б����汾��
                options.ReportApiVersions = true;
                //��û��ָ���汾��ʱ������ΪĬ�ϵİ汾��
                options.AssumeDefaultVersionWhenUnspecified = true;
                //����Ĭ�ϰ汾
                options.DefaultApiVersion = new ApiVersion(1, 0);
            });

            //IApiVersionDescriptionProvider ���API�汾��������
            services.AddVersionedApiExplorer(
                options =>
                {
                    //���ð汾��ʽ������Զ��ڰ汾ǰ������: v  ����
                    options.GroupNameFormat = "'v'VVV";
                    //�����·���������� {version:apiVersion} ��������������Ϊtrue�����Զ��������滻Ϊ��ʵ�İ汾��
                    options.SubstituteApiVersionInUrl = true;
                });

            //��̬����swagger�ĵ�
            services.AddTransient<IConfigureOptions<SwaggerGenOptions>, ConfigureSwaggerOptions>();
            services.AddSwaggerGen(options =>
            {

                //Action�����Զ������
                options.OperationFilter<ParameterFilter>();

                //����ע��
                var basePath = PlatformServices.Default.Application.ApplicationBasePath; //PlatformServices Ҫ��װ��չ Microsoft.Extensions.PlatformAbstractions
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
            //��̬����swagger�ĵ���Ҫ��json����
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
