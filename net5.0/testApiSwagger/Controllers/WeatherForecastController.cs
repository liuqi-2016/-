using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace testApiSwagger.Controllers
{
    /// <summary>
    /// 
    /// </summary>
    [ApiController]
    [Route("[controller]/[action]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="logger"></param>
        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// get请求
        /// </summary>
        /// <returns></returns>
        //[HttpPost(Name = "GetInfoNoParams")] //可以自定义一个名称，分配给 operateId，这个ID作为这个请求的唯一标识
        [HttpGet]
        public IEnumerable<WeatherForecast> Get()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            })
            .ToArray();
        }

        /// <summary>
        /// 指定返回的状态和类型
        /// </summary>
        /// <remarks>test get by id</remarks>
        /// <param name="id" example="123">ID</param>
        /// <response code="200">返回对象</response>
        /// <response code="400">返回错误字典</response>
        /// <response code="500">返回错误信息</response>
        /// <returns>IActionResult</returns>
        [HttpGet]
        [ProducesResponseType(typeof(WeatherForecast), 200)]
        [ProducesResponseType(typeof(Dictionary<string, string>), 400)]
        [ProducesResponseType(500)]
        public IActionResult GetById(int id)
        {
            return Ok(new WeatherForecast()
            {
                Date = DateTime.Now,
                Summary = "test"
            });
        }

        /// <summary>
        /// 指定必选参数
        /// 1.设置BindRequired 
        /// 2.参数如果是对象，在对象中设置[Required]特性
        /// </summary>
        /// <param name="keywords">关键字</param>
        /// <param name="pagesParams">分页参数</param>
        /// <returns></returns>
        [HttpGet]
        public IActionResult Search([FromQuery, Microsoft.AspNetCore.Mvc.ModelBinding.BindRequired] string keywords, [FromQuery] PagesParams pagesParams)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            return Ok(new { test = "test required" });
        }

        /// <summary>
        /// Post请求必填项
        /// </summary>
        /// <param name="pages"></param>
        /// <returns></returns>
        [HttpPost]
        //设置了多个文档，这里可以这样设置文档名称，就会在那个文档显示
        [ApiExplorerSettings(GroupName = "v2")]
        public IActionResult Put([FromBody] PagesParams pages)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            return Ok(new { test = "body required" });
        }

        /// <summary>
        /// 测试排序
        /// </summary>
        /// <returns></returns>
        [HttpPatch]
        public string orderTest()
        {
            return "test order by";
        }

        /// <summary>
        /// 忽略特性
        /// </summary>
        /// <returns></returns>
        [HttpPut]
        [Obsolete]
        public string OmitFunc() => "omit function";

    }


    /// <summary>
    /// 分页类
    /// </summary>
    public class PagesParams
    {
        /// <summary>
        /// 页大小
        /// </summary>
        [Required]
        public int PageSize { get; set; }

        /// <summary>
        /// 当前页
        /// </summary>
        [Obsolete]
        public int PageIndex { get; set; }

    }
}
