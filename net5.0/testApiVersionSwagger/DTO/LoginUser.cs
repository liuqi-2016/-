using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace testApiVersionSwagger.DTO
{
    /// <summary>
    /// 登录信息
    /// </summary>
    public class LoginUser
    {
        /// <summary>
        /// tenantId
        /// </summary>
        public string TenantId { get; set; }
        /// <summary>
        /// 用户名
        /// </summary>
        [Required]
        public string UserName { get; set; }
        /// <summary>
        /// 密码
        /// </summary>
        [Required]
        public string Pwd { get; set; }

    }
}
