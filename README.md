# AE 表达式控制器
## 一个功能强大的 After Effects 表达式管理脚本，支持智能环境检测，彻底解决双窗口和空白面板问题，提供友好的中文界面。<br>
<img width="333" height="473" alt="Screenshot 2025-12-09 235133" src="https://github.com/user-attachments/assets/19cacdeb-32f9-479a-bfae-dada95b877b6" /><br><br>
# 功能特性
## 🎯 便捷表达式管理：
支持快速设置和清除图层属性表达式<br>
## 🔧 多属性支持：
覆盖锚点、位置、缩放、旋转、不透明度等常用属性<br>
## ✨ 选中属性操作：
可直接对 AE 中选中的任意属性应用或清除表达式<br>
## 📝 实时状态反馈：
操作结果实时显示，便于查看成功 / 失败情况<br>
## 🌐 友好中文界面：
全中文 UI 和提示，适合中文用户使用<br><br>
# 安装方法
下载脚本文件 ExpressionController.jsx<br>
将脚本复制到 AE 的 Scripts 文件夹：<br>
Windows: ..\Adobe After Effects [版本]\Support Files\Scripts\<br>
macOS: /Applications/Adobe After Effects [版本]/Scripts/<br>
重启 AE 后，可从 窗口 > Expression Controller 打开脚本（可停靠）<br><br>

# 使用教程
打开脚本：通过上述方法打开脚本面板<br>
选择目标：在 AE 中选择需要操作的图层或具体属性<br>
输入表达式：在脚本的输入框中输入 AE 表达式（如 wiggle(2, 50)）<br>
执行操作：<br>
点击「设置表达式」区域的按钮，将表达式应用到对应属性<br>
点击「清除表达式」区域的按钮，清除对应属性的表达式<br>
查看结果：脚本底部状态栏会显示操作结果<br><br>

# 开源协议
本项目为开源项目，遵循 MIT 协议，禁止转售。<br>
作者信息<br>
作者：舟午 YueMoon<br>
博客：yuemoon.vip<br>
GitHub：YueMoon99<br><br>

# AE Expression Controller
## A powerful After Effects expression management script with intelligent environment detection, solving the double window and blank panel issues, 和 providing a user-friendly Chinese interface.
<img width="332" height="473" alt="Screenshot 2025-12-09 235141" src="https://github.com/user-attachments/assets/69f106af-ccb4-4954-939c-990233d6da05" />

Features
🧠 Intelligent Environment Detection: Automatically identifies running mode (dockable panel/independent window), completely solving double window and blank panel issues
🎯 Convenient Expression Management: Quickly set and clear expressions for layer properties
🔧 Multi-property Support: Covers anchor point, position, scale, rotation, opacity and other common properties
✨ Selected Property Operation: Directly apply or clear expressions to any selected property in AE
📝 Real-time Status Feedback: Operation results displayed in real-time for easy success/failure checking
🌐 User-friendly Chinese Interface: Full Chinese UI and prompts, suitable for Chinese users
📌 Dockable Panel Support: Can be opened from Window menu and docked to AE interface
Installation
Method 1: Run Directly (Temporary Use)
Download the script file ExpressionController.jsx
In AE, select File > Scripts > Run Script File...
Select the downloaded script file to open
Method 2: Install to AE (Permanent Use)
Download the script file ExpressionController.jsx
Copy the script to AE's Scripts folder:
Windows: C:\Program Files\Adobe\Adobe After Effects [version]\Support Files\Scripts\
macOS: /Applications/Adobe After Effects [version]/Scripts/
After restarting AE, open the script from Window > Expression Controller (dockable)
Usage Guide
Open the Script: Open the script panel using the methods above
Select Target: Select the layer or specific property in AE
Enter Expression: Input AE expression in the script's input box (e.g., wiggle(2, 50))
Execute Operation:
Click buttons in the "Set Expressions" area to apply expressions to corresponding properties
Click buttons in the "Clear Expressions" area to clear expressions from corresponding properties
View Results: The operation results will be displayed in the status bar at the bottom of the script
Version History
v2.4 (2025-12-09)
Fixed single window display issue
Added "Selected Property" feature, supporting applying/clearing expressions to any selected property
Optimized Chinese interface display
Enhanced error handling and status feedback
Open Source License
This project is open source under the MIT License, resale is prohibited.
Author Information
Author: YueMoon
Blog: yuemoon.vip
GitHub: your-github-username
