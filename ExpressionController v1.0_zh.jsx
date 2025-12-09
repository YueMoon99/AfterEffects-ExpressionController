// After Effects 表达式控制器 v2.4 (修复单窗口)
// 智能环境检测，彻底解决双窗口和空白面板问题

(function(thisObj) {
    // 核心修复：准确判断脚本运行方式
    var isDockablePanel = (thisObj instanceof Panel);
    
    // 根据运行环境创建唯一正确的窗口对象
    var mainWindow;
    if (isDockablePanel) {
        // 情况1：作为可停靠面板从Window菜单打开
        mainWindow = thisObj;
        mainWindow.text = "表达式控制器 v1.0 By丨舟午YueMoon丨"; 
        
    } else {
        // 情况2：作为独立脚本通过File > Scripts运行
        mainWindow = new Window("window", "表达式控制器 v1.0", undefined, {
            resizeable: true
        });
    }

    // 统一的UI构建开始
    mainWindow.orientation = "column";
    mainWindow.spacing = 8;
    mainWindow.margins = 12;
    
    var FinalText = mainWindow.add("statictext", undefined, "博客：yuemoon.vip   B站：UID223633562");
    FinalText.size = [350, 15];
    FinalText.alignment = ["left", "center"];
    
    // === 表达式输入区域 ===
    var inputGroup = mainWindow.add("group");
    inputGroup.orientation = "row";
    inputGroup.alignment = ["left", "center"];
    inputGroup.add("statictext", undefined, "表达式:");
    var expressionInput = inputGroup.add("edittext", undefined, "wiggle(2, 50)");
    expressionInput.size = [240, 25];
    expressionInput.characters = 35;

    // === "设置表达式"按钮组 ===
    var setPanel = mainWindow.add("panel", undefined, "设置表达式");
    setPanel.orientation = "column";
    setPanel.spacing = 6;
    setPanel.margins = 10;
    setPanel.alignment = ["left", "center"];

    // 第1行：锚点, 位置, 缩放
    var setRow1 = setPanel.add("group");
    setRow1.orientation = "row";
    setRow1.spacing = 8;
    var setAnchorPointBtn = setRow1.add("button", undefined, "锚点(A)");
    setAnchorPointBtn.size = [85, 28];
    var setPositionBtn = setRow1.add("button", undefined, "位置(P)");
    setPositionBtn.size = [85, 28];
    var setScaleBtn = setRow1.add("button", undefined, "缩放(S)");
    setScaleBtn.size = [85, 28];
    
    // 第2行：旋转, 不透明度, 选中属性
    var setRow2 = setPanel.add("group");
    setRow2.orientation = "row";
    setRow2.spacing = 8;
    var setRotationBtn = setRow2.add("button", undefined, "旋转(R)");
    setRotationBtn.size = [85, 28];
    var setOpacityBtn = setRow2.add("button", undefined, "不透明度(T)");
    setOpacityBtn.size = [85, 28];
    // 新增：选中属性设置按钮
    var setSelectedPropertyBtn = setRow2.add("button", undefined, "选中属性");
    setSelectedPropertyBtn.size = [85, 28];

    // === "清除表达式"按钮组 ===
    var clearPanel = mainWindow.add("panel", undefined, "清除表达式");
    clearPanel.orientation = "column";
    clearPanel.spacing = 6;
    clearPanel.margins = 10;
    clearPanel.alignment = ["left", "center"];

    // 第1行：清除 锚点, 位置, 缩放
    var clearRow1 = clearPanel.add("group");
    clearRow1.orientation = "row";
    clearRow1.spacing = 8;
    var clearAnchorPointBtn = clearRow1.add("button", undefined, "锚点(A)");
    clearAnchorPointBtn.size = [85, 28];
    var clearPositionBtn = clearRow1.add("button", undefined, "位置(P)");
    clearPositionBtn.size = [85, 28];
    var clearScaleBtn = clearRow1.add("button", undefined, "缩放(S)");
    clearScaleBtn.size = [85, 28];

    // 第2行：清除 旋转, 不透明度, 选中属性
    var clearRow2 = clearPanel.add("group");
    clearRow2.orientation = "row";
    clearRow2.spacing = 8;
    var clearRotationBtn = clearRow2.add("button", undefined, "旋转(R)");
    clearRotationBtn.size = [85, 28];
    var clearOpacityBtn = clearRow2.add("button", undefined, "不透明度(T)");
    clearOpacityBtn.size = [85, 28];
    // 新增：选中属性清除按钮
    var clearSelectedPropertyBtn = clearRow2.add("button", undefined, "选中属性");
    clearSelectedPropertyBtn.size = [85, 28];


    // === 状态显示 ===
    var statusText = mainWindow.add("statictext", undefined, "就绪 - 选择并点击按钮");
    statusText.size = [350, 20];
    statusText.alignment = ["center", "center"];
    
    // === 开源声明 ===
    var FinalText = mainWindow.add("statictext", undefined, "——————————————————————");
    FinalText.size = [350, 15];
    FinalText.alignment = ["center", "center"];
    var FinalText = mainWindow.add("statictext", undefined, "开源声明：完全开源免费，禁止转售！");
    FinalText.size = [350, 15];
    FinalText.alignment = ["center", "center"];
    var FinalText = mainWindow.add("statictext", undefined, "更多免费资源请访问我的博客：yuemoon.vip");
    FinalText.size = [350, 15];
    FinalText.alignment = ["center", "center"];



    // === 核心功能函数 ===
    function getLayerProperty(layer, propertyName) {
        try {
            // 首先尝试直接访问标准属性
            switch(propertyName) {
                case "锚点":
                    return layer.anchorPoint;
                case "位置":
                    return layer.position;
                case "旋转":
                    return layer.rotation;
                case "缩放":
                    return layer.scale;
                case "不透明度":
                    return layer.opacity;
                default:
                    return null;
            }
        } catch (e) {
            // 如果直接访问失败，尝试通过属性组访问
            try {
                var transformGroup = layer.property("ADBE Transform");
                if (!transformGroup) return null;
                
                switch(propertyName) {
                    case "锚点":
                        return transformGroup.property("ADBE Anchor Point");
                    case "位置":
                        return transformGroup.property("ADBE Position");
                    case "旋转":
                        return transformGroup.property("ADBE Rotate Z");
                    case "缩放":
                        return transformGroup.property("ADBE Scale");
                    case "不透明度":
                        return transformGroup.property("ADBE Opacity");
                    default:
                        return null;
                }
            } catch (e2) {
                return null;
            }
        }
    }

    function handleExpressionOperation(propertyName, expressionText, isClearOperation) {
        var activeItem = app.project.activeItem;
        if (!activeItem || !(activeItem instanceof CompItem)) {
            alert("错误：请先选择一个合成。");
            statusText.text = "错误：无活动合成";
            return false;
        }

        var selectedLayers = activeItem.selectedLayers;
        if (selectedLayers.length === 0 && propertyName !== "选中属性") {
            alert("错误：请至少选择一个图层。");
            statusText.text = "错误：未选择图层";
            return false;
        }

        app.beginUndoGroup((isClearOperation ? "清除 " : "设置 ") + propertyName + " 表达式");

        var successCount = 0;
        var errorMessages = [];

        // 处理选中属性的特殊情况
        if (propertyName === "选中属性") {
            var selectedProps = app.project.activeItem.selectedProperties;
            if (!selectedProps || selectedProps.length === 0) {
                alert("错误：请先选择至少一个属性。");
                statusText.text = "错误：未选择属性";
                app.endUndoGroup();
                return false;
            }

            for (var i = 0; i < selectedProps.length; i++) {
                try {
                    var prop = selectedProps[i];
                    prop.expression = isClearOperation ? "" : expressionText;
                    successCount++;
                } catch (e) {
                    errorMessages.push("属性 " + (i + 1) + "：" + e.toString());
                }
            }
        } else {
            // 处理常规属性
            for (var i = 0; i < selectedLayers.length; i++) {
                var layer = selectedLayers[i];
                try {
                    var targetProperty = null;
                    var finalExpression = isClearOperation ? "" : expressionText;

                    // 特殊处理PositionX和PositionY（保留原有逻辑，中文环境下暂不使用）
                    if (propertyName === "PositionX") {
                        targetProperty = getLayerProperty(layer, "位置");
                        if (targetProperty && !isClearOperation) {
                            finalExpression = "[" + expressionText + ", value[1]]";
                        }
                    } else if (propertyName === "PositionY") {
                        targetProperty = getLayerProperty(layer, "位置");
                        if (targetProperty && !isClearOperation) {
                            finalExpression = "[value[0], " + expressionText + "]";
                        }
                    } else {
                        targetProperty = getLayerProperty(layer, propertyName);
                    }

                    if (targetProperty) {
                        targetProperty.expression = finalExpression;
                        successCount++;
                    } else {
                        errorMessages.push(layer.name + "：属性不可访问");
                    }
                } catch (e) {
                    errorMessages.push(layer.name + "：" + e.toString());
                }
            }
        }

        // 更新状态信息
        if (errorMessages.length === 0) {
            var action = isClearOperation ? "已从" : "已应用到";
            statusText.text = "成功：表达式" + action + " " + successCount + " 个项目";
        } else {
            statusText.text = "部分成功：" + successCount + " 个成功，" + errorMessages.length + " 个失败";
            if (errorMessages.length > 0) {
                alert("以下项目失败：\n" + errorMessages.slice(0, 5).join("\n"));
            }
        }

        app.endUndoGroup();
        return successCount > 0;
    }

    // === 按钮事件绑定 ===
    setAnchorPointBtn.onClick = function() { handleExpressionOperation("锚点", expressionInput.text, false); };
    setPositionBtn.onClick = function() { handleExpressionOperation("位置", expressionInput.text, false); };
    setRotationBtn.onClick = function() { handleExpressionOperation("旋转", expressionInput.text, false); };
    setScaleBtn.onClick = function() { handleExpressionOperation("缩放", expressionInput.text, false); };
    setOpacityBtn.onClick = function() { handleExpressionOperation("不透明度", expressionInput.text, false); };
    // 选中属性设置按钮事件
    setSelectedPropertyBtn.onClick = function() { handleExpressionOperation("选中属性", expressionInput.text, false); };

    clearAnchorPointBtn.onClick = function() { handleExpressionOperation("锚点", "", true); };
    clearPositionBtn.onClick = function() { handleExpressionOperation("位置", "", true); };
    clearRotationBtn.onClick = function() { handleExpressionOperation("旋转", "", true); };
    clearScaleBtn.onClick = function() { handleExpressionOperation("缩放", "", true); };
    clearOpacityBtn.onClick = function() { handleExpressionOperation("不透明度", "", true); };
    // 选中属性清除按钮事件
    clearSelectedPropertyBtn.onClick = function() { handleExpressionOperation("选中属性", "", true); };

    // === 窗口显示逻辑 ===
    if (isDockablePanel) {
        // 对于可停靠面板，确保布局正确更新
        mainWindow.layout.layout(true);
    } else {
        // 对于独立窗口，居中并显示
        mainWindow.center();
        mainWindow.show();
    }

})(this); // 关键：传递全局this对象用于环境检测