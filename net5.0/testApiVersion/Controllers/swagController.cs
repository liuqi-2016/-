using Microsoft.AspNetCore.Mvc;
using System;

namespace testApiVersion.Controllers
{
    [ApiVersion("11.0")]
    [ApiController]
    [Route("[controller]")]
    public class swagController : ControllerBase
    {
        [HttpGet]
        public string Get()
        {
            return "test swagger one";
        }
    }
}
