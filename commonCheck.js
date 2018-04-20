
/**
* 检查输入 liuwh5 add 2018-04-17 
* eg: <input type="text" tipname="姓名" tipinfo="自定义提示信息" data-required="true" data-mobile="true" data-maxlength="30" data-rangelength="4,6" data-max="4"  />
* 所有属性都是可选，验证属性加前缀：data-，其他属性不用
* isfocus：是否聚焦，默认为 true
* showpre：是否显示提示前缀，默认为 true  如：姓名
* tipname：显示的前缀，必填将获取 input父亲节点上一个节点的文本内容
* tipinfo：显示的提示信息，不提供则使用默认的
* data-required：是否必须，默认 false
* data-mobile：是否验证为手机号，默认 false
* data-date：是否验证为日期，默认 false
* data-number：是否验证为数字(负数 小数 正数 整数)，默认 false
* data-digits：是否验证为整数数字
* data-minlength：验证最小内容长度 
* data-maxlength：验证最大内容长度 
* data-rangelength：验证区间内容长度  [n,m]
* data-min：验证最小数值
* data-max：验证最大数值
* data-range：验证区间数值 [n,m] 
* @returns {} 
*/
var commonCheck = function (opt) {
    ///<summary>检查表单</summary>
    ///<param name="opt.cformid">参数对象，{cformid:'表单ID(要带#)'}</param>
    ///<param name="opt.isAll">是否全部一次性检查，否：如果有一个不满足条件直接退出，是：全部检查，以不通过为准，{isAll:false}</param>
    ///<param name="opt.autoCloseTipTime">自动撤销错误提示的时间,单位:毫秒，{autoCloseTipTime:5000}</param> 
    var checkFormId = opt.cformid,
        isCheckAll = opt.isAll || false,  //默认false
        autoCloseErrorTipTime = opt.autoCloseTipTime || 5000; //默认 5000, 5秒
    //是否已经存在验证对象，是：直接返回，只要产生了一个验证对象，就始终只用这个，不要重复创建防止内存泄漏
    //这样可以实现一个页面多个表单验证
    if (window["ccIdObj" + checkFormId]) {
        return window["ccIdObj" + checkFormId];
    }
    var interObj = {
        checkFormIdStr: checkFormId,
        checkForm: $(checkFormId), //form表单 对象
        isRight: true, //整体状态 默认为通过
        isAll: isCheckAll, //是否全部一次性检查，否：如果有一个不满足条件直接退出，是：全部检查，以不通过为准
        autoCloseErrTipTime: autoCloseErrorTipTime, //自动撤销错误提示的时间，单位:毫秒
        autoCloseErrTipIntervalId: undefined, //自动撤销错误提示的实例ID
        checkFailTagObj: {}, //储存检查失败的标签对象，格式: tagname = $tagobj， 标签名称=标签的Jquery对象
        rules: { //规则
            rulesname: ["required", "mobile", "date", "number", "digits", "minlength", "maxlength", "rangelength", "max", "min", "range"],
            "reg": {
                mobile: /^1[3|4|5|7|8][0-9]{9}$/, //手机格式
                date: /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/, //日期验证 格式
                number: /^-?\d+(\.\d+)?$/, //合法的数字 正数 负数 小数 整数
                digits: /^[0-9]{1,10}$/  //整数 
            },
            "input": {
                required: false, //必须
                mobile: false, //手机
                date: false, //日期验证 格式
                number: false, //合法的数字 正数 负数 小数
                digits: false, //整数
                minlength: 0, //最小长度 ，0表示不需要
                maxlength: 0, //最大长度 ，0表示不需要
                rangelength: [0, 0], //介于长度之间
                max: 0, //不能大于，0表示不需要
                min: 0, //不能小于，0表示不需要
                range: [0, 0] //介于范围
            },
            "dropd": {
                required: ["无", "请选择"]  //必选的不包含项，如果是这里的表示没有选择
            },
            "checkb": {

            },
            "radiob": {

            }
        },
        message: {
            "input": {
                required: "必须填写",
                mobile: "格式不正确", //手机
                date: "日期格式不正确", //日期验证 格式
                number: "不合法的数字", //合法的数字 正数 负数 小数
                digits: "请输入整数", //整数
                minlength: "长度必须大于{0}", //最小长度
                maxlength: "长度必须小于{0}", //最大长度
                rangelength: "长度必须在{0}-{1}之间", //介于长度之间
                max: "数值不能大于{0}", //不能大于
                min: "数值不能小于{0}", //不能小于
                range: "数值必须在{0}-{1}之间" //介于范围
            },
            "select": {
                required: "必须选择"
            }
        },
        cinput: function () {
            ///<summary>检查input标签</summary>
            //找出所有显示的input
            var inputs = this.checkForm.find("input:text:visible,textarea:visible");
            inputs.each(function () {
                var obj = this;
                return interObj.commonCheck({ obj: obj });
            });
            return interObj.isRight;
        },
        commonshow: function (opt) {
            ///<summary>显示提示信息</summary>
            ///<param name="opt">参数对象,{curobj:当前验证的JQuery DOM对象,curmsg:提示信息,curfocus:是否聚焦,curnum:长度或数字大小,currange:区间值(2,6)}</param>
            ///<param name="opt.curobj">当前验证的JQuery DOM对象</param>
            ///<param name="opt.curmsg">显示提示信息</param>
            ///<param name="opt.curfocus">是否需要聚焦</param>
            ///<param name="opt.curnum">长度 或 数字大小 如：5</param>
            ///<param name="opt.currange">区间值，如：3,6 </param> 
            ///<returns></returns>
            var thisobj = opt.curobj,   //操作 Jquery对象
                thistipinfo = thisobj.attr("tipinfo"), //自定义提示信息
                thismsg = opt.curmsg,   //提示信息
                thismsgpre = thisobj.attr("tipname"), //提示信息前缀 如：姓名
                thisshowpre = thisobj.attr("showpre"), //是否显示前缀 
                thisfocus = opt.curfocus, //是否聚焦
                thisnum = opt.curnum, //主要为 长度 和 数字大小 做另外处理
                thisrange = opt.currange; //主要是为 range区间类 做另外的处理
            //区间替换
            if (thisrange) {
                var rangearr = thisrange.split(",");
                thismsg = thismsg.replace("{0}", rangearr[0]).replace("{1}", rangearr[1]);
            }
            //debugger;
            //长度 或 数字大小替换
            if (thisnum) {
                thismsg = thismsg.replace("{0}", thisnum);
            }
            //没有设置提示信息前缀，就获取前一个标签下的中文
            if (!thismsgpre || !thismsgpre.length) {
                var thtext = thisobj.parent().prev().text().replace(/(\s)+/gi, ""),
                  matchtext = /[\u4e00-\u9fa5(\s)+]+/.exec(thtext);
                thismsgpre = matchtext[0];
            }

            //提示信息，显示在标签后面
            var showTipText = (thisshowpre === "false" ? "" : thismsgpre) + (thistipinfo || thismsg),
                tipTop = thisobj.offset().top + thisobj.height() - 2 + "px",
                tipLeft = thisobj.offset().left + 2 + "px",
                tipTagSpan = "<span class=\"tiperr\" style=\"background-color: white;color:red; position:absolute; top: " + tipTop + "; left: " + tipLeft + ";\">" + showTipText + "</span>";

            //是否已经显示提示，是：替换提示信息，否：直接显示提示标签
            if (thisobj.parent().has("span.tiperr").length) {
                thisobj.next("span.tiperr").text(showTipText);
            } else {
                thisobj.after(tipTagSpan);
            }

            //AlertTipInfo((thisshowpre==="false" ? "" : thismsgpre) + (thistipinfo || thismsg)); 
            interObj.isRight = false;
            if (thisfocus) { thisobj.focus(); }

            //这里设置 当前验证对象的即时 验证，就是有修改就验证
            //方案：将这个对象缓存起来，缓存是判断是否已经缓存了，不要重复缓存，并设置修改事件，一旦有修改就执行验证方法
            interObj.initChange({ obj: thisobj });

            //自动撤销错误提示
            if (interObj.autoCloseErrTipIntervalId) {
                clearInterval(interObj.autoCloseErrTipIntervalId);
                interObj.autoCloseErrTipIntervalId = undefined;
            }
            interObj.autoCloseErrTipTime && (interObj.autoCloseErrTipIntervalId = setTimeout(function () { interObj.closeTip(); }, interObj.autoCloseErrTipTime));
        },
        commonCheck: function (opt) {
            ///<summary>公共验证方法</summary>
            ///<param name="opt.obj">当前验证的标签Dom对象</param>
            //初始化 验证结果 
            interObj.isRight = true; //这里初始化验证结果为通过 true
            var checkFlag = true, //验证通过标识，默认为 true 通过
                obj = $(opt.obj);  //当前验证的表单标签对象，转为JQuery方便操作
            //获取标签的验证属性
            var tagCheckAttr = obj.data(); //标签中使用带前缀：data- 设置的属性
            if (!tagCheckAttr) {
                return checkFlag;
            }
            //验证规则
            var allRuleNames = interObj.rules["rulesname"];
            //取出需要验证的规则名称
            var needCheckRuleName = [];
            for (var i = 0; i < allRuleNames.length; i++) {
                if (!tagCheckAttr[allRuleNames[i]]) { continue; }
                needCheckRuleName.push(allRuleNames[i]);
            }
            for (var i = 0; i < needCheckRuleName.length; i++) {
                var ruleName = needCheckRuleName[i],
                        checkparam = obj.data(ruleName); //获取对应验证的信息
                if (checkparam === null || checkparam === undefined) continue;

                var objVal = $.trim(obj.val());
                switch (ruleName) {
                    case "required":
                        if (!$.trim(objVal).length) {
                            //如果是日期类型的就不聚焦
                            var cfocus = (!obj.attr("isfocus") || obj.attr("isfocus") === "true") ? true : false;
                            interObj.commonshow({
                                curobj: obj, curmsg: interObj.message["input"][ruleName], curfocus: cfocus
                            });
                            checkFlag = false;
                        }
                        break;
                    case "date":
                        var datereg = interObj.rules["reg"][ruleName];
                        if (!datereg.test(objVal)) {
                            interObj.commonshow({
                                curobj: obj, curmsg: interObj.message["input"][ruleName]
                            });
                            checkFlag = false;
                        }
                        break;
                    case "mobile":
                    case "number":
                    case "digits":
                        var digitsreg = interObj.rules["reg"][ruleName];
                        if (!digitsreg.test(objVal)) {
                            interObj.commonshow({
                                curobj: obj, curmsg: interObj.message["input"][ruleName], curfocus: true
                            });
                            checkFlag = false;
                        }
                        break;
                    case "minlength":
                    case "maxlength":
                        var isFlag = ruleName === "minlength" ?
                                (objVal.length < Number(checkparam))
                                    : (objVal.length > Number(checkparam));
                        if (isFlag) {
                            interObj.commonshow({
                                curobj: obj, curmsg: interObj.message["input"][ruleName], curfocus: true, curnum: checkparam
                            });
                            checkFlag = false;
                        }
                        break;
                    case "rangelength":
                        var rangelengtharr = checkparam.split(",");
                        if (objVal && (objVal.length < Number(rangelengtharr[0]) || objVal.length > Number(rangelengtharr[1]))) {
                            interObj.commonshow({
                                curobj: obj, curmsg: interObj.message["input"][ruleName], curfocus: true, currange: checkparam
                            });
                            checkFlag = false;
                        }
                        break;
                    case "max":
                    case "min":
                        var isFlag = ruleName === "max" ?
                                    (objVal && objVal && Number(objVal) > Number(checkparam))
                                : (objVal && objVal && Number(objVal) < Number(checkparam));
                        //首先要匹配为数字，然后再匹配大小
                        var numsreg = interObj.rules["reg"]["number"];
                        if (!numsreg.test(objVal)) {
                            interObj.commonshow({
                                curobj: obj, curmsg: interObj.message["input"]["number"], curfocus: true
                            });
                            checkFlag = false;
                        }
                        if (isFlag) {
                            interObj.commonshow({
                                curobj: obj, curmsg: interObj.message["input"][ruleName], curfocus: true, curnum: checkparam
                            });
                            checkFlag = false;
                        }
                        break;
                    case "range":
                        var rangearr = checkparam.split(",");
                        if (objVal && (objVal < Number(rangearr[0]) || objVal > Number(rangearr[1]))) {
                            interObj.commonshow({
                                curobj: obj, curmsg: interObj.message["input"][ruleName], curfocus: true, currange: checkparam
                            });
                            checkFlag = false;
                        }
                        break;
                    default: break;
                }
                //有一个错误就结束判断
                if (!checkFlag) break;
            };
            return checkFlag;
        },
        initChange: function (opt) {
            ///<summary>初始化改变事件</summary>
            ///<param name="opt.obj">当前验证的JQuery DOM对象</param>
            var $thisobj = opt.obj,
                domthisobj = $thisobj[0];
            //缓存对象，不用重复对一个空间绑定事件，防止内存泄漏
            if (interObj.checkFailTagObj[domthisobj.id]) { return; }
            else { interObj.checkFailTagObj[domthisobj.id] = $thisobj; }

            var changeIntervalId;
            $thisobj.bind("input keyup change propertychange", function (e) {
                var changeInputObj = this,
                    $changeInputObj = $(changeInputObj);
                //判断IE中 propertychange改变事件，光标闪烁也会出发这个事件
                if (e.type === "propertychange" && changeInputObj.tagName === "INPUT" && !$.trim($changeInputObj.val()).length) {
                    return;
                }
                clearInterval(changeIntervalId);
                changeIntervalId = setTimeout(function () {
                    var checkFlag = interObj.commonCheck({ obj: changeInputObj });
                    if (checkFlag) {
                        //通过，删除提示
                        $changeInputObj.next("span.tiperr").remove();
                        if (interObj.checkFailTagObj[changeInputObj.id]) {
                            //删除掉缓存
                            delete interObj.checkFailTagObj[changeInputObj.id];
                        }
                    }
                }, 500);
            });
        },
        closeTip: function () {
            ///<summary>清空所有错误提示信息</summary>
            interObj.checkForm.find("span.tiperr").remove();
            if (interObj.autoCloseErrTipIntervalId) {
                clearInterval(interObj.autoCloseErrTipIntervalId);
                interObj.autoCloseErrTipIntervalId = undefined;
            }
        },
        cselect: function () {  //检查select
            ///<summary>检查select标签</summary>
            //找出所有显示的检查select   
            var selects = this.checkForm.find("select:visible");
            selects.each(function () {
                var obj = $(this);
                //获取标签的验证属性
                var tagCheckAttr = obj.data(); //标签中使用带前缀：data- 设置的属性
                if (!tagCheckAttr) {
                    return true;
                }
                //验证规则
                var allRuleNames = interObj.rules["rulesname"];
                //取出需要验证的规则名称
                var needCheckRuleName = [];
                for (var i = 0; i < allRuleNames.length; i++) {
                    if (!tagCheckAttr[allRuleNames[i]]) { continue; }
                    needCheckRuleName.push(allRuleNames[i]);
                }
                for (var i = 0; i < needCheckRuleName.length; i++) {
                    var ruleName = needCheckRuleName[i],
                        checkparam = obj.data(ruleName); //获取对应验证的信息
                    if (checkparam === null || checkparam === undefined) continue;

                    var objVal = $.trim(obj.val());
                    switch (ruleName) {
                        case "required":
                            if (interObj.inArray(interObj.rules.dropd.required, objVal)) {
                                interObj.commonshow({
                                    curobj: obj, curmsg: interObj.message["select"][ruleName], curfocus: true
                                });
                                return false;
                            }
                            break;
                    }
                }
            });

            return interObj.isRight;
        },
        ccheckb: function () { //检查 checkbox
            ///<summary>检查checkbox</summary>
            //找出所有显示的检查checkbox
            var inputs = this.checkForm.find("input:checkbox:visible");

        },
        cradiob: function () { //检查 radio
            ///<summary>检查radio</summary>
            //找出所有显示的检查radio
            var inputs = this.checkForm.find("input:radio:visible");
        },
        ckall: function () {
            ///<summary>检查所有</summary>
            var flagInput = this.cinput();
            var flagSelect = flagInput && this.cselect();

            //只要有错误, isRight就为false
            return this.isRight;
        },
        serializeData: function () {
            ///<summary>序列化参数对象</summary>
            ///<param name="rel"><input type="text" rel="字段名字(必须与实体类一致)"/></param>
            ///<param name="rbl"><input type="radio" rbl="字段名字(必须与实体类一致)"/></param>
            ///<param name="ddl"><select ddl="字段名字(必须与实体类一致)"></select></param>
            ///<param name="ckl"><input type="checkbox" ckl="字段名字(必须与实体类一致)"/></param>
            var vData = "{";
            //取文本框的值
            $(this.checkFormIdStr + " [rel]").each(function (index, item) {
                vData += ',"' + $(this).attr("rel") + '":"' + $(this).val() + '"';
            });
            //取单选框的值
            $(this.checkFormIdStr + " [rbl]").each(function (index, item) {
                vData += ',"' + $(this).attr("rbl") + '":"' + $(this).find("input[type='radio']:checked").val() + '"';
            });
            //取下拉框的值
            $(this.checkFormIdStr + " [ddl]").each(function (index, item) {
                vData += ',"' + $(this).attr("ddl") + '":"' + $(this).find("option:selected").val() + '"';
            });
            //取复选框的值
            $(this.checkFormIdStr + " [ckl]").each(function (index, item) {
                var thisObj = $(this).find("input[type=checkbox]"),
                    val = thisObj.attr("checked"), //是否选择
                    setVal = thisObj.attr("setval");  //是否设置了 选择需要赋的值，没有的话就默认为 1 或 0
                //选择了，如果设置了要赋的值，那么就是设置的值，否则为1，没选择，如果设置了要赋的值，那么就是设置的值，否则为0
                setVal = val ? (setVal || 1) : (setVal || 0);
                vData += ',"' + $(this).attr("ckl") + '":"' + setVal + '"';
            });
            vData += "}";
            vData = vData.replace("{,", "{");
            return vData;
        },
        inArray: function (arr, val) {
            ///<summary>值是否存在数组中</summary>
            ///<param name="arr">数组</param>
            ///<param name="val">检查是否存在于数组中的值</param>
            var testStr = "," + arr.join(",") + ",";
            return testStr.indexOf("," + val + ",") >= 0;
        }
    };

    window["ccIdObj" + checkFormId] = interObj;
    return interObj;
}; 