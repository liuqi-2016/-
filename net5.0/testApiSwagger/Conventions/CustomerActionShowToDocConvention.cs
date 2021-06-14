using Microsoft.AspNetCore.Mvc.ApplicationModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace testApiSwagger.Conventions
{

    /// <summary>
    /// 实现IControllerModelConvention接口，分配控制器的Action显示到哪个swagger文档中
    /// </summary>
    public class CustomerActionShowToDocConvention : IControllerModelConvention
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="controller"></param>
        public void Apply(ControllerModel controller)
        {
            var controllerNamespace = controller.ControllerType.Namespace; // eg: Controllers.V1
            var apiVersion = controllerNamespace.Split(".").Last().ToLower();

            if (!string.IsNullOrEmpty(apiVersion) && apiVersion.IndexOf("v") != -1)
            {
                //设置GroupName
                controller.ApiExplorer.GroupName = apiVersion;
            }

        }
    }
}
