# 更新日志

所有 "ros2-quick-runner" 扩展的重要更新都将记录在此文件中。
## [0.0.2] - 2026-06-02
- 优化了icon图标
- 将里面的调试代码删除


## [0.0.1] - 2026-05-31

### 新增

- 初始版本发布
- 支持 `.launch.py` 文件，右键菜单 "ROS2: Launch"
- 支持 `.py` 和 `.cpp` 文件，右键菜单 "ROS2: Run"
- 支持获取工作空间名称，右键菜单 "Get ROS2 Workspace Name"
- 自动检测 ROS2 工作空间（通过 `src/` 和 `install/` 目录）
- 自动从 `package.xml` 提取包名
- 在新终端中自动执行 `source install/setup.bash`