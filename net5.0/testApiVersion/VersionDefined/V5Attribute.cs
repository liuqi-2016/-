using System;
using Microsoft.AspNetCore.Mvc;

namespace testApiVersion.VersionDefined
{

  /// <summary>
  /// 扩展版本特性，便于管理版本号
  /// </summary>
  [AttributeUsage(AttributeTargets.Class, AllowMultiple = true, Inherited = false)]
  public sealed class V5Attribute : ApiVersionAttribute
  {

    public V5Attribute() : base(new ApiVersion(5, 0)) { }

  }
}
