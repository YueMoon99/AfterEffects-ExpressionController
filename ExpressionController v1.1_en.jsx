// After Effects Expression Controller v2.4 (Fixed single window + multi-line input support)
// Intelligent environment detection, solves dual window and blank panel issues, supports multi-line input

(function(thisObj) {
    // Core fix: Accurately determine script execution mode
    var isDockablePanel = (thisObj instanceof Panel);
    
    // Create correct window object based on environment
    var mainWindow;
    if (isDockablePanel) {
        // Case 1: Dockable panel opened from Window menu
        mainWindow = thisObj;
        mainWindow.text = "Expression Controller v1.1 by YueMoon"; 
    } else {
        // Case 2: Standalone script run via File > Scripts
        mainWindow = new Window("window", "Expression Controller v1.0", undefined, {
            resizeable: true
        });
    }

    // Unified UI construction
    mainWindow.orientation = "column";
    mainWindow.spacing = 8;
    mainWindow.margins = 12;

    var FinalText = mainWindow.add("statictext", undefined, "Blog：yuemoon.vip   Bilibili：UID223633562");
    FinalText.size = [350, 15];
    FinalText.alignment = ["left", "center"];
    
    // === Expression input area (multi-line support) ===
    var inputGroup = mainWindow.add("group");
    inputGroup.orientation = "row";
    inputGroup.alignment = ["left", "top"];
    inputGroup.spacing = 8;
    inputGroup.add("statictext", undefined, "Expression:");
    
    var expressionInput = inputGroup.add("edittext", undefined, "wiggle(2, 50)", {
        multiline: true,
        wordWrap: true
    });
    expressionInput.size = [245, 80];
    expressionInput.characters = 200;
    expressionInput.scrollable = true;

    // === "Set Expression" button group ===
    var setPanel = mainWindow.add("panel", undefined, "Set Expression");
    setPanel.orientation = "column";
    setPanel.spacing = 6;
    setPanel.margins = 10;
    setPanel.alignment = ["left", "center"];

    // Row 1: Anchor Point, Position, Scale
    var setRow1 = setPanel.add("group");
    setRow1.orientation = "row";
    setRow1.spacing = 8;
    var setAnchorPointBtn = setRow1.add("button", undefined, "Anchor (A)");
    setAnchorPointBtn.size = [90, 28];
    var setPositionBtn = setRow1.add("button", undefined, "Position (P)");
    setPositionBtn.size = [90, 28];
    var setScaleBtn = setRow1.add("button", undefined, "Scale (S)");
    setScaleBtn.size = [90, 28];
    
    // Row 2: Rotation, Opacity, Selected Property
    var setRow2 = setPanel.add("group");
    setRow2.orientation = "row";
    setRow2.spacing = 8;
    var setRotationBtn = setRow2.add("button", undefined, "Rotation (R)");
    setRotationBtn.size = [90, 28];
    var setOpacityBtn = setRow2.add("button", undefined, "Opacity (T)");
    setOpacityBtn.size = [90, 28];
    var setSelectedPropertyBtn = setRow2.add("button", undefined, "Selected Prop");
    setSelectedPropertyBtn.size = [90, 28];

    // === "Clear Expression" button group ===
    var clearPanel = mainWindow.add("panel", undefined, "Clear Expression");
    clearPanel.orientation = "column";
    clearPanel.spacing = 6;
    clearPanel.margins = 10;
    clearPanel.alignment = ["left", "center"];

    // Row 1: Clear Anchor, Position, Scale
    var clearRow1 = clearPanel.add("group");
    clearRow1.orientation = "row";
    clearRow1.spacing = 8;
    var clearAnchorPointBtn = clearRow1.add("button", undefined, "Anchor (A)");
    clearAnchorPointBtn.size = [90, 28];
    var clearPositionBtn = clearRow1.add("button", undefined, "Position (P)");
    clearPositionBtn.size = [90, 28];
    var clearScaleBtn = clearRow1.add("button", undefined, "Scale (S)");
    clearScaleBtn.size = [90, 28];

    // Row 2: Clear Rotation, Opacity, Selected Property
    var clearRow2 = clearPanel.add("group");
    clearRow2.orientation = "row";
    clearRow2.spacing = 8;
    var clearRotationBtn = clearRow2.add("button", undefined, "Rotation (R)");
    clearRotationBtn.size = [90, 28];
    var clearOpacityBtn = clearRow2.add("button", undefined, "Opacity (T)");
    clearOpacityBtn.size = [90, 28];
    var clearSelectedPropertyBtn = clearRow2.add("button", undefined, "Selected Prop");
    clearSelectedPropertyBtn.size = [90, 28];

    // === Status display ===
    var statusText = mainWindow.add("statictext", undefined, "Ready - Select layers and click buttons (multi-line supported)");
    statusText.size = [350, 20];
    statusText.alignment = ["center", "center"];
    
    // Open source notice
    var FinalText = mainWindow.add("statictext", undefined, "——————————————————————");
    FinalText.size = [350, 15];
    FinalText.alignment = ["left", "center"];
    var FinalText = mainWindow.add("statictext", undefined, "Note: Totally FREE project, Resale Prohibited");
    FinalText.size = [350, 15];
    FinalText.alignment = ["left", "center"];

    // === Core functions ===
    function getLayerProperty(layer, propertyName) {
        try {
            switch(propertyName) {
                case "Anchor":
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
            try {
                var transformGroup = layer.property("ADBE Transform");
                if (!transformGroup) return null;
                
                switch(propertyName) {
                    case "Anchor":
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
        if (selectedLayers.length === 0 && propertyName !== "Selected Prop") {
            alert("Error: Please select at least one layer.");
            statusText.text = "Error: No layers selected";
            return false;
        }

        app.beginUndoGroup((isClearOperation ? "Clear " : "Set ") + propertyName + " expression");

        var successCount = 0;
        var errorMessages = [];

        if (propertyName === "Selected Prop") {
            var selectedProps = app.project.activeItem.selectedProperties;
            if (!selectedProps || selectedProps.length === 0) {
                alert("Error: Please select at least one property.");
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
            for (var i = 0; i < selectedLayers.length; i++) {
                var layer = selectedLayers[i];
                try {
                    var targetProperty = null;
                    var finalExpression = isClearOperation ? "" : expressionText;

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
                        errorMessages.push(layer.name + ": Property unavailable");
                    }
                } catch (e) {
                    errorMessages.push(layer.name + ": " + e.toString());
                }
            }
        }

        if (errorMessages.length === 0) {
            var action = isClearOperation ? "cleared from" : "applied to";
            statusText.text = "Success: Expression " + action + " " + successCount + " items";
        } else {
            statusText.text = "Partial success: " + successCount + " succeeded, " + errorMessages.length + " failed";
            if (errorMessages.length > 0) {
                alert("Failed items:\n" + errorMessages.slice(0, 5).join("\n"));
            }
        }

        app.endUndoGroup();
        return successCount > 0;
    }

    // === Button event bindings ===
    setAnchorPointBtn.onClick = function() { handleExpressionOperation("Anchor", expressionInput.text, false); };
    setPositionBtn.onClick = function() { handleExpressionOperation("Position", expressionInput.text, false); };
    setRotationBtn.onClick = function() { handleExpressionOperation("Rotation", expressionInput.text, false); };
    setScaleBtn.onClick = function() { handleExpressionOperation("Scale", expressionInput.text, false); };
    setOpacityBtn.onClick = function() { handleExpressionOperation("Opacity", expressionInput.text, false); };
    setSelectedPropertyBtn.onClick = function() { handleExpressionOperation("Selected Prop", expressionInput.text, false); };

    clearAnchorPointBtn.onClick = function() { handleExpressionOperation("Anchor", "", true); };
    clearPositionBtn.onClick = function() { handleExpressionOperation("Position", "", true); };
    clearRotationBtn.onClick = function() { handleExpressionOperation("Rotation", "", true); };
    clearScaleBtn.onClick = function() { handleExpressionOperation("Scale", "", true); };
    clearOpacityBtn.onClick = function() { handleExpressionOperation("Opacity", "", true); };
    clearSelectedPropertyBtn.onClick = function() { handleExpressionOperation("Selected Prop", "", true); };

    // === Window display logic ===
    if (isDockablePanel) {
        mainWindow.layout.layout(true);
    } else {
        mainWindow.center();
        mainWindow.show();
    }

})(this);