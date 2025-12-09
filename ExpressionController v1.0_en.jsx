// After Effects Expression Controller v2.4 (Fixed Single Window)
// 智能环境检测，彻底解决双窗口和空白面板问题

(function(thisObj) {
    // 核心修复：准确判断脚本运行方式
    var isDockablePanel = (thisObj instanceof Panel);
    
    // 根据运行环境创建唯一正确的窗口对象
    var mainWindow;
    if (isDockablePanel) {
        // 情况1：作为可停靠面板从Window菜单打开
        mainWindow = thisObj;
        mainWindow.text = "Expression Controller v1.0 By | 舟午YueMoon |"; 
        
    } else {
        // 情况2：作为独立脚本通过File > Scripts运行
        mainWindow = new Window("window", "Expression Controller v1.0", undefined, {
            resizeable: true
        });
    }

    // 统一的UI构建开始
    mainWindow.orientation = "column";
    mainWindow.spacing = 8;
    mainWindow.margins = 12;
    
    var FinalText = mainWindow.add("statictext", undefined, "Blog：yuemoon.vip   Bilibili：UID223633562");
    FinalText.size = [350, 15];
    FinalText.alignment = ["left", "center"];
    
    // === 表达式输入区域 ===
    var inputGroup = mainWindow.add("group");
    inputGroup.orientation = "row";
    inputGroup.alignment = ["left", "center"];
    inputGroup.add("statictext", undefined, "Expression:");
    var expressionInput = inputGroup.add("edittext", undefined, "wiggle(2, 50)");
    expressionInput.size = [230, 25];
    expressionInput.characters = 35;

    // === "设置表达式"按钮组 ===
    var setPanel = mainWindow.add("panel", undefined, "Set Expressions");
    setPanel.orientation = "column";
    setPanel.spacing = 6;
    setPanel.margins = 10;
    setPanel.alignment = ["left", "center"];

    // 第1行： Anchor Point, Position, Scale
    var setRow1 = setPanel.add("group");
    setRow1.orientation = "row";
    setRow1.spacing = 8;
    var setAnchorPointBtn = setRow1.add("button", undefined, "Anchor Point(A)");
    setAnchorPointBtn.size = [85, 28];
    var setPositionBtn = setRow1.add("button", undefined, "Position(P)");
    setPositionBtn.size = [85, 28];
    var setScaleBtn = setRow1.add("button", undefined, "Scale(S)");
    setScaleBtn.size = [85, 28];
    
    // 第2行：Rotation, Opacity, Selected Property
    var setRow2 = setPanel.add("group");
    setRow2.orientation = "row";
    setRow2.spacing = 8;
    var setRotationBtn = setRow2.add("button", undefined, "Rotation(R)");
    setRotationBtn.size = [85, 28];
    var setOpacityBtn = setRow2.add("button", undefined, "Opacity(T)");
    setOpacityBtn.size = [85, 28];
    // 新增：选中属性设置按钮
    var setSelectedPropertyBtn = setRow2.add("button", undefined, "Selected Prop");
    setSelectedPropertyBtn.size = [85, 28];

    // === "清除表达式"按钮组 ===
    var clearPanel = mainWindow.add("panel", undefined, "Clear Expressions");
    clearPanel.orientation = "column";
    clearPanel.spacing = 6;
    clearPanel.margins = 10;
    clearPanel.alignment = ["left", "center"];

    // 第1行：清除 Anchor Point, Position, Scale
    var clearRow1 = clearPanel.add("group");
    clearRow1.orientation = "row";
    clearRow1.spacing = 8;
    var clearAnchorPointBtn = clearRow1.add("button", undefined, "Anchor Point(A)");
    clearAnchorPointBtn.size = [85, 28];
    var clearPositionBtn = clearRow1.add("button", undefined, "Position(P)");
    clearPositionBtn.size = [85, 28];
    var clearScaleBtn = clearRow1.add("button", undefined, "Scale(S)");
    clearScaleBtn.size = [85, 28];

    // 第2行：清除 Rotation, Opacity, Selected Property
    var clearRow2 = clearPanel.add("group");
    clearRow2.orientation = "row";
    clearRow2.spacing = 8;
    var clearRotationBtn = clearRow2.add("button", undefined, "Rotation(R)");
    clearRotationBtn.size = [85, 28];
    var clearOpacityBtn = clearRow2.add("button", undefined, "Opacity(T)");
    clearOpacityBtn.size = [85, 28];
    // 新增：选中属性清除按钮
    var clearSelectedPropertyBtn = clearRow2.add("button", undefined, "Selected Prop");
    clearSelectedPropertyBtn.size = [85, 28];


    // === 状态显示 ===
    var statusText = mainWindow.add("statictext", undefined, "Ready - Select and click a button");
    statusText.size = [350, 20];
    statusText.alignment = ["center", "center"];
    
    // === 开源声明 ===
    var FinalText = mainWindow.add("statictext", undefined, "——————————————————————");
    FinalText.size = [350, 15];
    FinalText.alignment = ["center", "center"];
    var FinalText = mainWindow.add("statictext", undefined, "Please note:Open-source project, Prohibited to resell.");
    FinalText.size = [350, 15];
    FinalText.alignment = ["center", "center"];
    var FinalText = mainWindow.add("statictext", undefined, "More free stuff in my blog: yuemoon.vip");
    FinalText.size = [350, 15];
    FinalText.alignment = ["center", "center"];



    // === 核心功能函数 ===
    function getLayerProperty(layer, propertyName) {
        try {
            // 首先尝试直接访问标准属性[1](@ref)
            switch(propertyName) {
                case "Anchor Point":
                    return layer.anchorPoint;
                case "Position":
                    return layer.position;
                case "Rotation":
                    return layer.rotation;
                case "Scale":
                    return layer.scale;
                case "Opacity":
                    return layer.opacity;
                default:
                    return null;
            }
        } catch (e) {
            // 如果直接访问失败，尝试通过属性组访问[1](@ref)
            try {
                var transformGroup = layer.property("ADBE Transform");
                if (!transformGroup) return null;
                
                switch(propertyName) {
                    case "Anchor Point":
                        return transformGroup.property("ADBE Anchor Point");
                    case "Position":
                        return transformGroup.property("ADBE Position");
                    case "Rotation":
                        return transformGroup.property("ADBE Rotate Z");
                    case "Scale":
                        return transformGroup.property("ADBE Scale");
                    case "Opacity":
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
            alert("Error: Please select a composition first.");
            statusText.text = "Error: No active composition";
            return false;
        }

        var selectedLayers = activeItem.selectedLayers;
        if (selectedLayers.length === 0 && propertyName !== "Selected Property") {
            alert("Error: Please select at least one layer.");
            statusText.text = "Error: No layers selected";
            return false;
        }

        app.beginUndoGroup((isClearOperation ? "Clear " : "Set ") + propertyName + " Expression");

        var successCount = 0;
        var errorMessages = [];

        // 处理选中属性的特殊情况
        if (propertyName === "Selected Property") {
            var selectedProps = app.project.activeItem.selectedProperties;
            if (!selectedProps || selectedProps.length === 0) {
                alert("Error: Please select at least one property first.");
                statusText.text = "Error: No properties selected";
                app.endUndoGroup();
                return false;
            }

            for (var i = 0; i < selectedProps.length; i++) {
                try {
                    var prop = selectedProps[i];
                    prop.expression = isClearOperation ? "" : expressionText;
                    successCount++;
                } catch (e) {
                    errorMessages.push("Property " + (i + 1) + ": " + e.toString());
                }
            }
        } else {
            // 处理常规属性
            for (var i = 0; i < selectedLayers.length; i++) {
                var layer = selectedLayers[i];
                try {
                    var targetProperty = null;
                    var finalExpression = isClearOperation ? "" : expressionText;

                    // 特殊处理PositionX和PositionY[1](@ref)
                    if (propertyName === "PositionX") {
                        targetProperty = getLayerProperty(layer, "Position");
                        if (targetProperty && !isClearOperation) {
                            finalExpression = "[" + expressionText + ", value[1]]";
                        }
                    } else if (propertyName === "PositionY") {
                        targetProperty = getLayerProperty(layer, "Position");
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
                        errorMessages.push(layer.name + ": Property not accessible");
                    }
                } catch (e) {
                    errorMessages.push(layer.name + ": " + e.toString());
                }
            }
        }

        // 更新状态信息
        if (errorMessages.length === 0) {
            var action = isClearOperation ? "cleared from" : "applied to";
            statusText.text = "Success: Expression " + action + " " + successCount + " item(s)";
        } else {
            statusText.text = "Partial: " + successCount + " success, " + errorMessages.length + " failed";
            if (errorMessages.length > 0) {
                alert("Failed on items:\n" + errorMessages.slice(0, 5).join("\n"));
            }
        }

        app.endUndoGroup();
        return successCount > 0;
    }

    // === 按钮事件绑定 ===
    setAnchorPointBtn.onClick = function() { handleExpressionOperation("Anchor Point", expressionInput.text, false); };
    setPositionBtn.onClick = function() { handleExpressionOperation("Position", expressionInput.text, false); };
    setRotationBtn.onClick = function() { handleExpressionOperation("Rotation", expressionInput.text, false); };
    setScaleBtn.onClick = function() { handleExpressionOperation("Scale", expressionInput.text, false); };
    setOpacityBtn.onClick = function() { handleExpressionOperation("Opacity", expressionInput.text, false); };
    // 新增：选中属性设置按钮事件
    setSelectedPropertyBtn.onClick = function() { handleExpressionOperation("Selected Property", expressionInput.text, false); };

    clearAnchorPointBtn.onClick = function() { handleExpressionOperation("Anchor Point", "", true); };
    clearPositionBtn.onClick = function() { handleExpressionOperation("Position", "", true); };
    clearRotationBtn.onClick = function() { handleExpressionOperation("Rotation", "", true); };
    clearScaleBtn.onClick = function() { handleExpressionOperation("Scale", "", true); };
    clearOpacityBtn.onClick = function() { handleExpressionOperation("Opacity", "", true); };
    // 新增：选中属性清除按钮事件
    clearSelectedPropertyBtn.onClick = function() { handleExpressionOperation("Selected Property", "", true); };

    // === 窗口显示逻辑 ===
    if (isDockablePanel) {
        // 对于可停靠面板，确保布局正确更新[6](@ref)
        mainWindow.layout.layout(true);
    } else {
        // 对于独立窗口，居中并显示
        mainWindow.center();
        mainWindow.show();
    }

})(this); // 关键：传递全局this对象用于环境检测