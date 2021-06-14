using System;
using Microsoft.AspNetCore.Mvc;

namespace testApiVersion.Controllers.v2_5
{

  /// <summary>
  /// 不在这里设置版本号，通过代码内置的命名空间约定来设置
  /// </summary>
  [ApiController]
  [Route("api/[controller]")]
  public class apiNamespaceController : ControllerBase
  {
    [HttpGet]
    public string get()
    {
      return "use namespace set version no";
    }
  }
}
