using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace testApiVersionSwagger.VersionDefined
{
    /// <summary>
    /// v1.0 版本号
    /// </summary>
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = true, Inherited = false)]
    public sealed class V1Attribute : ApiVersionAttribute
    {
        /// <summary>
        /// 版本1.0
        /// </summary>
        public V1Attribute() : base(new ApiVersion(1, 0)) { }
    }

    /// <summary>
    /// v2.0 版本号
    /// </summary>
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = true, Inherited = false)]
    public sealed class V2Attribute : ApiVersionAttribute
    {
        /// <summary>
        /// 版本2.0
        /// </summary>
        public V2Attribute() : base(new ApiVersion(2, 0)) { }
    }
}
