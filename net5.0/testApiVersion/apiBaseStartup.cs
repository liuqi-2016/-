using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Versioning;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace testApiVersion
{
  public class apiBaseStartup
  {
    public apiBaseStartup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    public void ConfigureServices(IServiceCollection services)
    {
      services.AddMvcCore();
      services.AddApiVersioning(options =>
      {
        #region 获取版本号的方式
        //1、更改使用查询字符串指定版本号的关键字，默认是api-version，这里改成v
        //options.ApiVersionReader = new QueryStringApiVersionReader("v");
        //2、这个配置是改变api版本的读取方式，从请求头的自定义标识获取，默认：api-version
        //options.ApiVersionReader = new HeaderApiVersionReader("x-ms-version");
        //3、媒体查询：设置 Content-Type:application/json; api-version=2，默认：api-version
        //options.ApiVersionReader = new MediaTypeApiVersionReader();

        //可以组合多个方式
        // options.ApiVersionReader = ApiVersionReader.Combine(
        //   new QueryStringApiVersionReader(),
        //   new HeaderApiVersionReader()
        //   {
        //     HeaderNames = { "api-version" }
        //   });
        #endregion

        #region 不在控制器指定版本号，通过代码约定指定版本号
        /**
          可以实现：IControllerConvention  来自定义约定，使用 add 追加
          options.Conventions.Add(new CustomeControllerConvertion())
        */

        //指定控制器的版本为：1.9
        options.Conventions.Controller<Controllers.apiConvertionController>().HasApiVersion(new Microsoft.AspNetCore.Mvc.ApiVersion(1, 9));

        //内置的使用命名空间指定版本，
        /**
          命名规范：
          'v' | 'V' : [<year> : ['_'] : <month> : ['_'] : <day>] : [<major['_' : minor]>] : [<status>]
          “ v”| “ v”: [年份 > : [’_’] : < 月份 > : [’_’] : < 天 > : [主要[’_’: 小]] : [状态 > ]
        */
        options.Conventions.Add(new Microsoft.AspNetCore.Mvc.Versioning.Conventions.VersionByNamespaceConvention());

        /**
          支持多个版本控制的约定
          安装：PB.ITOps.AspNetCore.Versioning，可以指定版本范围在构造函数
          参考：https://github.com/purplebricks/PB.ITOps.AspNetCore.Versioning
        */
        //options.Conventions = new IntroducedApiVersionConventionBuilder(1, 1);

        #endregion

        #region 修改默认的错误响应，可以自定义实现：IErrorResponseProvider  接口提供
        //        options.ErrorResponses = new CustomeErrorResponseProvider();
        #endregion

        //设置默认版本，未指定版本号访问接口时使用的版本
        options.AssumeDefaultVersionWhenUnspecified = true;
        options.DefaultApiVersion = new Microsoft.AspNetCore.Mvc.ApiVersion(1, 0);
      });
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }

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
