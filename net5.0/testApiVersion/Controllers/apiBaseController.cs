using System;
using Microsoft.AspNetCore.Mvc;

namespace testApiVersion.Controllers
{
  /// <summary>
  /// 一、这个模式是查询字符串【api-version】进行版本控制
  /// 可能一个控制器存在多个版本交错的情况，可以使用【MapToApiVersion】指定方法属于那个版本
  /// Deprecated = true 指定过期，只是提示，还是可以使用
  /// </summary>
  [ApiVersion("1.0")]
  [ApiVersion("1.1")]
  //[AdvertiseApiVersions("1.1")]
  [Route("/api/[controller]/[action]")]
  [ApiController]
  public class apiBaseController : ControllerBase
  {

    [HttpGet]
    public string Get()
    {
      return "1.0 apiversion data，use: api-version params set version-no";
    }

    /// <summary>
    /// 一个控制器指定了多个版本号，可以通过【MapToApiVersion】指定方法属于那个版本
    /// 这种适用于大版本号下有小改动的情况
    /// </summary>
    /// <returns></returns>
    [HttpGet, MapToApiVersion("1.1")]
    public string GetV1dot1()
    {
      return "1.1 apiversion data.";
    }

    [HttpGet]
    public IActionResult apiVersionInfo()
    {
      //获取版本号信息
      var apiVersion = HttpContext.GetRequestedApiVersion();
      return Ok(apiVersion);
    }

  }


  /// <summary>
  /// 二、URL路径版本控制，在路由配置中使用{version:apiVersion}指定版本号
  /// </summary>
  [ApiVersion("2.0")]
  [ApiController]
  [Route("api/v{version:apiVersion}/[controller]")]
  public class apiBaseUrlController : ControllerBase
  {
    [HttpGet]
    public string getUrl()
    {
      return "2.0 base url apiversion.";
    }
  }


  /// <summary>
  /// 三、基于自定义请求header，指定版本
  /// 需要改变默认的API版本读取方式：options => options.ApiVersionReader = new HeaderApiVersionReader("x-ms-version");
  /// 四、基于媒体配置，在 content-type 中增加自定义的属性，如 v=2.0，同样需要改api版本的读取方式
  /// </summary>
  [ApiVersion("3.0")]
  [ApiController]
  [Route("api/[controller]")]
  public class apiBaseHeaderController : ControllerBase
  {
    public string getHeader()
    {
      return "3.0 base custome request header";
    }
  }


  /// <summary>
  /// 不在这里设置版本号，通过代码约定来设置
  /// </summary>
  [ApiController]
  [Route("api/[controller]")]
  public class apiConvertionController : ControllerBase
  {
    [HttpGet]
    public string get()
    {
      return "use convertion set version no";
    }
  }

  /// <summary>
  /// 使用继承定义特性指定版本，方便管理
  /// </summary>
  [VersionDefined.V5]
  [ApiController]
  [Route("api/[controller]")]
  public class apiDefinedController : ControllerBase
  {
    [HttpGet]
    public string get()
    {
      return "extend apiversionattribute set version-no.";
    }
  }
}
