using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace testApiVersionSwagger.DTO
{
    /// <summary>
    /// 查询全部职员
    /// </summary>
    public class SearchEmpDTO
    {

        /// <summary>
        /// 职员姓名
        /// </summary>
        public string empName { get; set; }
        /// <summary>
        /// 性别
        /// </summary>
        [Required]
        public int Sex { get; set; }
        /// <summary>
        /// 域账号
        /// </summary>
        public string domainAccount { get; set; }
        /// <summary>
        /// 状态
        /// </summary>
        public int status { get; set; }

    }
}
