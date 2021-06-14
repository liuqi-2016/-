using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace testApiSwagger.Controllers.v2
{
    /// <summary>
    /// 自定义约定分配action给到对应的swagger文档中显示
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class ConventionController : ControllerBase
    {

        /// <summary>
        /// 通过自定义约定分配给swagger文档的方法
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public string ShowToV2Doc()
        {
            return "通过自定义约定分配给swagger文档的方法";
        }

    }
}
