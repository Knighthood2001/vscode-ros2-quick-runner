# 更新日志

所有 "ros2-quick-runner" 扩展的重要更新都将记录在此文件中。

## [0.0.3] - 2026-06-03

### 优化

- 优化菜单名称，使其更简洁、更像终端命令风格
  - "ROS2: Launch" → "ros2 launch"
  - "ROS2: Run" → "ros2 run"
  - "Get ROS2 Workspace Name" → "ros2 source"


## [0.0.2] - 2026-06-02

### 优化

- 优化了 icon 图标
- 删除调试代码

## [0.0.1] - 2026-05-31

### 新增

- 初始版本发布
- 支持 `.launch.py` 文件，右键菜单 "ros2 launch"
- 支持 `.py` 和 `.cpp` 文件，右键菜单 "ros2 run"
- 支持获取工作空间名称，右键菜单 "ros2 source"
- 自动检测 ROS2 工作空间（通过 `src/` 和 `install/` 目录）
- 自动从 `package.xml` 提取包名
- 在新终端中自动执行 `source install/setup.bash`