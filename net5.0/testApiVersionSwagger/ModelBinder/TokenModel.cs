using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace testApiVersionSwagger.ModelBinder
{
    /// <summary>
    /// Token模型
    /// </summary>
    public class TokenModel
    {
        /// <summary>
        /// 有效时间
        /// </summary>
        public DateTime ValidateTo { get; set; }
        /// <summary>
        /// IP地址
        /// </summary>
        public string IPAddress { get; set; }

    }
}
