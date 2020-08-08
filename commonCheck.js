
/**
* author：liuwh5
* date: 2018-04-17
* funcs: 输入检查
* dependency: JQuery 1.4.4 +
* description：所有验证均使用标签属性的方式提供，属性都是可选，验证属性加前缀：data-，其他属性不用
* version：1.0.0
*
* eg: <input type="text" tipname="姓名" tipinfo="自定义提示信息" data-must="true" data-mobile="true" data-maxlength="30" data-rangelength="4,6" data-max="4"  />
* 调用:  var cc = commonCheck({
*                   cformid:"#formid", //需要验证的表单ID
*                   isAllCheck:false,  //是否一次性全部检查，目前未实现
*                   autoCloseTipTime: 1000, 自动撤销错误提示的时间，大于0就会实现，不需要取消的话就设置为0
*                   otherTipObj: "commonCCHRTip" //其他提示对象名称，必须带"show"方法
*                 });
* 
* 属性：
* isfocus：是否聚焦，默认为 true
* showpre：是否显示提示前缀，默认为 true  如：姓名
* tipname：显示的前缀，不填将获取 input父亲节点上一个节点的文本内容
* tipinfo：显示的提示信息，不提供则使用默认的
* tipshowtime: 显示的提示信息显示时长，是给其他提示插件用的
* focusfor：是否聚焦到指定ID的表单控件上，需要就用这个属性指定聚焦到的ID
* data-must：是否必须，默认 false
* data-mobile：是否验证为手机号，默认 false
* data-date：是否验证为日期，默认 false，注意:日期控件验证不要聚焦，否则会出现一个另类的BUG
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
    ///<param name="opt.cformid">参数对象，{cformid:'表单ID(带#)或者class(带.)'}</param>
    ///<param name="opt.isAllCheck">是否全部一次性检查，否：如果有一个不满足条件直接退出，是：全部检查，以不通过为准，{isAll:false}</param>
    ///<param name="opt.autoCloseTipTime">自动撤销错误提示的时间,单位:毫秒，{autoCloseTipTime:5000}</param> 
    ///<param name="opt.otherTipObj">其他提示信息对象的名字</param>
    var checkFormId = opt.cformid,
        isCheckAll = opt.isAllCheck || false,  //默认false
        errPosition = opt.errPosition || "botton", //错误信息显示的位置 默认为 botton
        autoCloseErrorTipTime = opt.autoCloseTipTime >= 0 ? opt.autoCloseTipTime : 5000, //默认 5000, 5秒
        otherTipObjName = opt.otherTipObj; //其他提示信息对象的名称
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
        checkFailTagObj: {}, //储存检查失败的标签对象，格式: tagname = {...}， 标签名称=错误提示信息参数对象
        checkFailTagEventBindObj: {}, //错误对象的事件绑定，绑定了就缓存到这里，之后不要在绑定，格式: tagname=$tagobj，标签名称=当前操作的表单标签JQuery对象
        otherShowTipObjName: otherTipObjName, //其他提示信息对象的名称
        showErrPosition: errPosition, //错误信息显示的位置
        rules: { //规则
            rulesname: ["must", "mobile", "date", "number", "digits", "minlength", "maxlength", "rangelength", "max", "min", "range"],
            "reg": {
                mobile: /^1[3|4|5|6|7|8|9][0-9]{9}$/, //手机格式
                date: /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/, //日期验证 格式
                number: /^-?\d+(\.\d+)?$/, //合法的数字 正数 负数 小数 整数
                digits: /^[0-9]{1,10}$/  //整数 
            },
            "input": {
                must: false, //必须
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
                must: ["无", "请选择"]  //必选的不包含项，如果是这里的值 表示没有选择
            },
            "checkb": {

            },
            "radiob": {

            }
        },
        message: {
            "input": {
                must: "必须填写",
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
            "textarea": {
                must: "必须填写"
            },
            "select": {
                must: "必须选择"
            }
        },
        methods: {
            "must": function (value, element) {
                //select
                if (element.nodeName.toLowerCase() === "select") {
                    return !interObj.inArray(interObj.rules.dropd["must"], value);
                }
                //radio
                //待定 
                //input
                return value.length > 0;
            },
            "mobile": function (value, element) {
                var reg = interObj.rules["reg"]["mobile"];
                return reg.test(value);
            },
            "date": function (value, element) {
                var reg = interObj.rules["reg"]["date"];
                return reg.test(value);
            },
            "number": function (value, element) {
                var reg = interObj.rules["reg"]["number"];
                return reg.test(value);
            },
            "digits": function (value, element) {
                var reg = interObj.rules["reg"]["digits"];
                return reg.test(value);
            },
            "minlength": function (value, element, param) {
                return value.length >= Number(param);
            },
            "maxlength": function (value, element, param) {
                return value.length <= Number(param);
            },
            "rangelength": function (value, element, param) {
                return (value.length >= param[0] && value.length <= param[1]);
            },
            "max": function (value, element, param) {
                //数值大小验证必须是数字，不是数字直接返回false
                return !this.methods["number"](value, element) || value <= param;
            },
            "min": function (value, element, param) {
                //数值大小验证必须是数字，不是数字直接返回false
                return !this.methods["number"](value, element) || value >= param;
            },
            "range": function (value, element, param) {
                //数值范围验证必须是数字，不是数字直接返回false
                return !this.methods["number"](value, element) || (value >= param[0] && value <= param[1]);
            }
        },
        cinput: function () {
            ///<summary>检查input标签</summary>
            //找出所有显示的input
            var inputs = this.checkForm.find("input:text:visible,textarea:visible");
            inputs.each(function () {
                var obj = this;
                //返回 false 就会结束遍历
                //isAll为true，一次性全部验证
                var cf = interObj.commonCheck({ obj: obj });
                return interObj.isAll ? true : cf;
            });
            //checkFailTagObj不是空的，表示有错误验证
            interObj.isRight = $.isEmptyObject(this.checkFailTagObj);
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
                thistipshowtime = thisobj.attr("tipshowtime"), //提示信息显示的时长，用于其他提示插件
                thisshowpre = thisobj.attr("showpre"), //是否显示前缀 
                thisfocus = opt.curfocus, //是否聚焦
                thisfocusfor = thisobj.attr("focusfor"), //聚焦在哪个表单标签
                thisnum = opt.curnum, //主要为 长度 和 数字大小 做另外处理
                thisrange = opt.currange; //主要是为 range区间类 做另外的处理
            //区间替换
            if (thisrange) {
                var rangearr = thisrange.split(",");
                thismsg = thismsg.replace("{0}", rangearr[0]).replace("{1}", rangearr[1]);
            }

            //长度 或 数字大小替换
            if (thisnum) {
                thismsg = thismsg.replace("{0}", thisnum);
            }
            //没有设置提示信息前缀，并且需要显示，就获取前一个标签下的中文
            if ((!thismsgpre || !thismsgpre.length) && !thisshowpre) {
                var thtext = thisobj.parent().prev().text().replace(/(\s)+/gi, ""),
                  matchtext = /[\u4e00-\u9fa5(\s)+]+/.exec(thtext);
                thismsgpre = matchtext[0];
            }

            //提示信息，显示在标签后面
            var showTipText = (thisshowpre === "false" ? "" : thismsgpre) + (thistipinfo || thismsg),
                tipTop = thisobj.offset().top + thisobj.height() - 2 + "px",
                tipLeft = thisobj.offset().left + 2 + "px";

            //错误信息显示的位置
            switch (this.showErrPosition) {
                case "right":
                    tipTop = thisobj.offset().top + "px";
                    tipLeft = thisobj.offset().left + thisobj.width() + 3 + "px";
                    break;
                case "left":
                    tipTop = thisobj.offset().top + "px";
                    tipLeft = thisobj.offset().left - thisobj.width() + "px";
                    break;
                default: break;
            }

            var tipTagSpan = "<label class=\"tiperr\" title=\"" + showTipText + "\" style=\"background-color: white;color:red; position:absolute; top: " + tipTop + "; left: " + tipLeft + "; z-index:10000; width: auto; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;\">" + showTipText + "</label>";

            //如果有其他提示信息对象的名字，那么就使用其他的提示,目前只支持commonCCHRTip 这个提示对象，否则就使用 本身的追加提示
            if (interObj.otherShowTipObjName && window[interObj.otherShowTipObjName]) {
                if (window[interObj.otherShowTipObjName] && window[interObj.otherShowTipObjName]["show"]) {
                    window[interObj.otherShowTipObjName].show(showTipText);
                } else if (window[interObj.otherShowTipObjName]) {
                    window[interObj.otherShowTipObjName](showTipText, Number(thistipshowtime));
                }
            } else {
                //是否已经显示提示，是：替换提示信息，否：直接显示提示标签
                if (thisobj.parent().has("label.tiperr").length) {
                    thisobj.next("label.tiperr").text(showTipText).attr("title", showTipText);
                } else {
                    thisobj.after(tipTagSpan);
                }
            }
            interObj.isRight = false;
            if (thisfocus) {
                if (thisfocusfor && thisfocusfor.length && this.checkForm.find("[id$=" + thisfocusfor + "]").length) {
                    var focusdom = this.checkForm.find("[id$=" + thisfocusfor + "]")[0];
                    focusdom.focus();
                    thisobj.next("label.tiperr").attr("for", focusdom.id);
                    setTimeout(function () { thisobj.next("label.tiperr").trigger("click"); }, 10);
                }
                else { thisobj.focus(); thisobj.next("label.tiperr").attr("for", thisobj[0].id); }
            }

            //这里设置 当前验证对象的即时 验证，就是有修改就验证
            //方案：将这个对象缓存起来，缓存是判断是否已经缓存了，不要重复缓存，并设置修改事件，一旦有修改就执行验证方法
            interObj.initChange({ obj: thisobj });

            //自动撤销错误提示
            if (interObj.autoCloseErrTipIntervalId) {
                clearInterval(interObj.autoCloseErrTipIntervalId);
                interObj.autoCloseErrTipIntervalId = undefined;
            }
            interObj.autoCloseErrTipTime && typeof (interObj.autoCloseErrTipTime) === "number" && Number(interObj.autoCloseErrTipTime) > 0 && (interObj.autoCloseErrTipIntervalId = setTimeout(function () { interObj.closeTip(); }, interObj.autoCloseErrTipTime));
        },
        commonCheck: function (opt) {
            ///<summary>公共验证方法</summary>
            ///<param name="opt.obj">当前验证的标签Dom对象</param>
            //初始化 验证结果 
            interObj.isRight = true; //这里初始化验证结果为通过 true
            var checkFlag = true, //验证通过标识，默认为 true 通过
                domObj = opt.obj, //当前验证的表单标签对象，DOM
                obj = $(opt.obj);  //当前验证的表单标签对象，转为JQuery方便操作

            //获取标签的验证属性
            var tagCheckAttr; //= obj.data(); //标签中使用带前缀：data- 设置的属性，如果引入的jQuery小于1.4.4那么就获取不到data-属性的设置
            //if (!tagCheckAttr) {
            //获取不到，尝试使用属性的方式获取
            tagCheckAttr = {};
            var allRN = interObj.rules["rulesname"];
            for (var i = 0; i < allRN.length; i++) {
                var curObjAttrVal = obj.attr("data-" + allRN[i]);
                if (curObjAttrVal === undefined) { continue; }
                tagCheckAttr[allRN[i]] = curObjAttrVal === "" ? true : curObjAttrVal;
            }
            //使用属性获取，还是没有就真的没有了
            if (!tagCheckAttr) {
                return checkFlag;
            }
            //}

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
                    checkparam = tagCheckAttr[ruleName]; //obj.data(ruleName); //获取对应验证的信息
                if (checkparam === null || checkparam === undefined) continue;

                //存在检查错误对象，先删掉
                if (this.checkFailTagObj[domObj.name]) {
                    delete this.checkFailTagObj[domObj.name];
                }
                //对象的值
                var objVal = $.trim(obj.val());

                //使用参数对象的方式去获取判断类型并判断
                checkFlag = interObj.methods[ruleName].call(this, objVal, domObj, checkparam);

                if (!checkFlag) {
                    //不通过，缓存当前验证不通过的数据；提示信息
                    //是否聚焦，未设置isfocus或设置为true，则聚焦，否则不聚焦
                    var cfocus = (obj.attr("isfocus") === null || obj.attr("isfocus") === undefined) ? true : (obj.attr("isfocus") === "true" ? true : false),
                        cnum, crange;
                    //大小 长度 以及范围需要传递  cnum  crange信息
                    cnum = "minlength,maxlength,max,min".indexOf(ruleName) >= 0 ? checkparam : undefined;
                    crange = "rangelength,range".indexOf(ruleName) >= 0 ? checkparam : undefined;

                    this.checkFailTagObj[domObj.name] = {
                        curobj: obj,
                        curmsg: interObj.message[domObj.nodeName.toLowerCase()][ruleName],
                        curfocus: cfocus,
                        curnum: cnum,
                        currange: crange
                    };
                    //有一个类型错误就结束判断
                    break;
                } 
            };
            return checkFlag;
        },
        initChange: function (opt) {
            ///<summary>初始化改变事件</summary>
            ///<param name="opt.obj">当前验证的JQuery DOM对象</param>
            var $thisobj = opt.obj,
                domthisobj = $thisobj[0];
            //缓存对象，不用重复对一个控件绑定事件
            if (interObj.checkFailTagEventBindObj[domthisobj.id]) { return; }
            else { interObj.checkFailTagEventBindObj[domthisobj.id] = $thisobj; }

            var changeTimeoutId;
            $thisobj.bind("blur focusout input keyup change propertychange", function (e) {//
                var changeInputObj = this,
                    $changeInputObj = $(changeInputObj);
                //判断IE中 propertychange改变事件，光标闪烁也会出发这个事件
                if ((e.type === "blur" || e.type === "focusout" || e.type === "propertychange") && (changeInputObj.tagName.toLowerCase() === "input" || changeInputObj.tagName.toLowerCase() === "select") && (!$.trim($changeInputObj.val()).length || !changeInputObj.readOnly)) { //
                    return false;
                }

                changeTimeoutId && clearInterval(changeTimeoutId);
                changeTimeoutId = setTimeout(function () {
                    var checkFlag = interObj.commonCheck({ obj: changeInputObj });
                    if (checkFlag) {
                        //通过，删除提示
                        $changeInputObj.next("label.tiperr").remove();
                        if (interObj.checkFailTagEventBindObj[changeInputObj.id]) {
                            //删除掉缓存
                            //delete interObj.checkFailTagEventBindObj[changeInputObj.id];
                        }
                    } else {
                        //不通过，显示错误
                        interObj.showError(changeInputObj);
                    }
                }, 500);
            });
        },
        closeTip: function () {
            ///<summary>清空所有错误提示信息</summary>
            interObj.checkForm.find("label.tiperr").remove();
            if (interObj.autoCloseErrTipIntervalId) {
                clearInterval(interObj.autoCloseErrTipIntervalId);
                interObj.autoCloseErrTipIntervalId = undefined;
            }
        },
        showError: function (domObj) {
            ///<summary>显示错误信息</summary>
            ///<param name="domObj">当前验证的表单标签DOM对象</param>
            if (domObj) {
                //在 checkFailTagObj 找出对应的错误信息显示对象进行显示
                this.commonshow(this.checkFailTagObj[domObj.name]);
            }
            else {
                if (!$.isEmptyObject(this.checkFailTagObj)) {
                    for (msg in this.checkFailTagObj) {
                        if (this.checkFailTagObj.hasOwnProperty(msg)) {
                            var errObj = this.checkFailTagObj[msg];
                            this.commonshow(errObj);
                        }
                    }
                    //获取第一个聚焦
                    var keyArr = Object.keys(this.checkFailTagObj);
                    var $firstFailObj = $("#" + keyArr[0].replace(/\$/gi, "_"));
                    if (($firstFailObj.attr("isfocus") === null || $firstFailObj.attr("isfocus") === undefined) ? true : ($firstFailObj.attr("isfocus") === "true" ? true : false)) {
                        $firstFailObj.trigger("focus");
                    }
                }
            }
        },
        cselect: function () {  //检查select
            ///<summary>检查select标签</summary>
            //找出所有显示的检查select   
            var selects = this.checkForm.find("select:visible");
            selects.each(function () {
                var obj = this;
                //返回 false 就会结束遍历
                //isAll为true，一次性全部验证
                var cf = interObj.commonCheck({ obj: obj });
                return interObj.isAll ? true : cf;
            });
              
            //checkFailTagObj不是空的，表示有错误验证
            interObj.isRight = $.isEmptyObject(this.checkFailTagObj);
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

            //显示错误
            this.showError();
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

//IE兼容 Object.keys
var DONT_ENUM = "propertyIsEnumerable,isPrototypeOf,hasOwnProperty,toLocaleString,toString,valueOf,constructor".split(","),
    hasOwn = ({}).hasOwnProperty;
for (var i in { toString: 1 }) {
    DONT_ENUM = false;
}
Object.keys = Object.keys || function (obj) {//ecma262v5 15.2.3.14
    var result = [];
    for (var key in obj) if (hasOwn.call(obj, key)) {
        result.push(key);
    }
    if (DONT_ENUM && obj) {
        for (var i = 0; key = DONT_ENUM[i++]; ) {
            if (hasOwn.call(obj, key)) {
                result.push(key);
            }
        }
    }
    return result;
};


///公共提示信息
var commonCCHRTip = {
    /* white-space: nowrap; text-overflow: ellipsis;*/
    defaults: { tipcss: { classstr: "cctipinfo", stylestr: "background-color: white; color:red; position:absolute; z-index:555; width: auto; height: auto; overflow: hidden;" }, closeInfoTime: 3000, closeInfoTimeout: undefined, cclose: true },
    show: function (opt) {
        ///<summary>显示信息</summary>
        ///<param name="opt">字符串 | 对象{obj: domObj,info: '',closetime: 3,position: 'right'}</param>
        ///<param name="opt.obj">提示信息对应的表单标签,dom对象</param>
        ///<param name="opt.info">提示信息</param>
        ///<param name="opt.closetime">自动撤销提示的时间 毫秒</param>
        ///<param name="opt.cclose">点击关闭 默认为true</param>
        ///<param name="opt.position">信息显示的位置：botton  left  right:默认</param>

        this.clear();

        if (typeof (opt) === "string") {
            var tinfo = opt;
            opt = { info: tinfo };
        }

        //没传对象，就默认为body
        opt.obj = opt.obj || "body";

        var $thisobj = $(opt.obj);
        var showTipText = opt.info,
            closeTime = Number(opt.closetime),
            showPosition = opt.position,
            ccClose = typeof (opt.cclose) === "boolean" ? Boolean(opt.cclose) : true,
            tipTop = $thisobj.offset().top + "px",
            tipLeft = $thisobj.offset().left + $thisobj.width() + 3 + "px";

        this.defaults.closeInfoTime = (closeTime && closeTime >= 0) ? closeTime : this.defaults.closeInfoTime;
        this.defaults.clickClose = ccClose;

        //信息显示的位置
        switch (showPosition) {
            case "botton":
                tipTop = $thisobj.offset().top + $thisobj.height() - 2 + "px";
                tipLeft = $thisobj.offset().left + 2 + "px";
                break;
            case "left":
                tipTop = $thisobj.offset().top + "px";
                tipLeft = $thisobj.offset().left - $thisobj.width() + "px";
                break;
            default: break;
        }

        var appendOrafter = "after", isCenter = false;
        //没有传递对象，显示在中间
        if ($thisobj[0].nodeName.toLowerCase() === "body") {
            isCenter = true;
            appendOrafter = "append";
            tipTop = "0px"; tipLeft = "0px";
        }
        this.defaults.tipcss.stylestr += " top: " + tipTop + "; left: " + tipLeft + " ;";

        var tipTagSpan = "<span class=\"" + this.defaults.tipcss.classstr + "\" title=\"点击可关闭(" + showTipText + ")\" style=\"" + this.defaults.tipcss.stylestr + "\">" + showTipText + "</span>";

        //是否已经显示提示，是：替换提示信息，否：直接显示提示标签
        if ($thisobj.has("span.cctipinfo").length) {
            $thisobj.find("span.cctipinfo").text(showTipText).attr("title", "点击可关闭(" + showTipText + ")");
        } else {
            $thisobj[appendOrafter](tipTagSpan);
        }

        //位置
        if (isCenter) {
            var $tipObj = $thisobj.find("span.cctipinfo"), $body = $(document), $window = $(document),
                scrollTop = $window.scrollTop(), scrollLeft = $window.scrollLeft(),
                bodyHeight = $body.height(), bodyWidth = $body.width(),
                tipObjWidth = $tipObj.width(),
                tipWidth = tipObjWidth > 300 ? "300px" : "auto",
                tipObjWidth = tipObjWidth > 300 ? 300 : tipObjWidth,
                centerHeight = bodyHeight / 2 + scrollTop / 2 - 60,
                centerLeft = (bodyWidth - tipObjWidth) / 2 - 10;
            $tipObj.css({
                "border": "1px solid green", "backgroundColor": "#efefef",
                "padding": "10px", "fontSize": "15px",
                "top": centerHeight + "px", "left": centerLeft + "px",
                "width": tipWidth
            });
            this.reCalculate();
        }

        //是否自动关闭，可能为0，若为0就不自动关闭
        this.defaults.closeInfoTime && this.close();

        //点击关闭
        this.defaults.clickClose && $("body").find("span.cctipinfo").live("click", function () {
            if (commonCCHRTip.defaults.closeInfoTimeout) {
                clearTimeout(commonCCHRTip.defaults.closeInfoTimeout);
                commonCCHRTip.defaults.closeInfoTimeout = undefined;
            }
            $(this).remove();
        });
    },
    clear: function () {
        ///<summary>初始化为最初状态</summary>
        if (this.defaults.closeInfoTimeout) {
            clearTimeout(this.defaults.closeInfoTimeout);
            this.defaults.closeInfoTimeout = undefined;
        }
        $("body").find("span.cctipinfo").remove();
        this.defaults.tipcss.stylestr = "background-color: white; color:red; position:absolute; z-index:555; width: auto; height: auto; overflow: hidden;"; // white-space: nowrap; text-overflow: ellipsis;
        this.defaults.tipcss.classstr = "cctipinfo";
        this.defaults.closeInfoTime = 3000;
        this.defaults.clickClose = true;
    },
    close: function () {
        ///<summary>关闭提示</summary>
        ///<param name="time">显示时长(毫秒)，过了这个时间(毫秒)就关闭</param>
        !this.defaults.closeInfoTimeout && (this.defaults.closeInfoTimeout = setTimeout(function () {
            $("body").find("span.cctipinfo").remove();
        }, this.defaults.closeInfoTime));
    },
    reCalculate: function () {
        $(window).scroll(function (e) {
            ///<summary>重新计算高度</summary>
            var tipObj = $("body").find("span.cctipinfo"),
                $body = $(document), $window = $(document),
                scrollTop = $window.scrollTop(), scrollLeft = $window.scrollLeft(),
                bodyHeight = $body.height(), bodyWidth = $body.width(),
                centerHeight = (bodyHeight + scrollTop) / 2 - 50;
            tipObj.css({
                "top": centerHeight + "px"
            });
        });
    }
};