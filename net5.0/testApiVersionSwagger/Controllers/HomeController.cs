using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using testApiVersionSwagger.DTO;
using testApiVersionSwagger.ModelBinder;
using testApiVersionSwagger.VersionDefined;

namespace testApiVersionSwagger.Controllers
{
    /// <summary>
    /// 版本1.0控制器
    /// </summary>
    [V1]
    [ApiController]
    [Route("api/v{version:apiVersion}/[controller]/[action]")]
    public class HomeController : ControllerBase
    {
        /// <summary>
        /// 用户登录
        /// </summary>
        /// <param name="loginUser"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult Login([FromBody] LoginUser loginUser)
        {
            var response = new { code = 200, msg = "登录成功" };

            if (loginUser.UserName == "admin" && loginUser.Pwd == "111111") { }

            return Ok(response);
        }

        /// <summary>
        /// 获取全部职员
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [TokenValidate] //自定义Token验证特性
        public IActionResult GetAllEmployee([FromQuery] SearchEmpDTO searchEmpDto, [FromQuery] TokenModel tokenModel)
        {
            return Ok(new
            {
                code = 200,
                msg = "",
                data = new { empName = "test123", phone = "13222111112", age = 23, sex = 0, address = "test address" }
            });
        }


        /// <summary>
        /// 新增职员
        /// </summary>
        /// <param name="newEmpDto"></param>
        /// <param name="tokenModel"></param>
        /// <returns></returns>
        [HttpPost]
        [TokenValidate]
        public IActionResult AddEmployee([FromBody] SearchEmpDTO newEmpDto, [FromQuery] TokenModel tokenModel)
        {
            return Ok(new { code = 200, msg = "新增职员成功" });
        }

    }
}
