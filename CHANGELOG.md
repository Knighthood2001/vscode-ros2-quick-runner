# 更新日志

所有 "ros2-quick-runner" 扩展的重要更新都将记录在此文件中。

## [0.0.5] - 2026-06-20

### 新增

- `colcon build` 智能识别编译目标
  - 右键工作空间根目录 `xxx_ws/` → 全量编译 `colcon build`
  - 右键 `xxx_ws/src/` → 全量编译 `colcon build`
  - 右键任意包目录或包内子目录（如 `xxx_ws/src/pkg_a/`、`xxx_ws/src/pkg_a/scripts/`）→ **单包编译** `colcon build --packages-select pkg_a`
- 终端名差异化
  - 全量编译：`colcon build`
  - 单包编译：`colcon build: pkg_a`

### 优化

- 重构编译相关代码
  - 提取 `isRos2Package`、`findNearestPackage`、`isWorkspaceRoot`、`getBuildTarget` 等独立函数
  - 编译逻辑更清晰、更易扩展

## [0.0.4] - 2026-06-10

### 新增

- 新增 `colcon build` 右键菜单命令
  - 在任意 ROS2 文件夹上右键，可一键执行 `colcon build`
  - 自动判断工作空间根目录（基于 `src/` 下是否包含 `package.xml`）
  - 支持在 `xxx_ws`、`xxx_ws/src` 以及子包目录(比如`xxx_ws/src/xxx_pkg`)上右键
  - 终端自动切换到工作空间根目录后执行 build

### 修复

- 修复了右键 `src/yumi_demo` 等包目录时被误判为工作空间根目录的问题
  - 之前只判断是否存在 `src/` 目录，会被包内子模块的 `src/` 误判
  - 现在通过检查 `src/` 下的子目录是否包含 `package.xml` 来准确识别

### 优化

- 优化了 `findRos2Workspace` 函数
  - 之前必须同时存在 `src/` 和 `install/` 目录
  - 现在未编译的工作空间也能正确识别（只通过 `src/` 下有 `package.xml` 判断）

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