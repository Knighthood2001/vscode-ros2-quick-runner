# ROS2 Quick Runner

一款用于快速运行 ROS2 launch 文件、Python 节点和 C++ 节点的 VS Code 扩展。

## 功能特性

### 1. 启动 ROS2 Launch 文件
右键点击任意 `.launch.py` 文件，选择 **"ROS2: Launch"** 即可：
- 自动查找 ROS2 工作空间
- 自动 source 工作空间的 `install/setup.bash`
- 执行 `ros2 launch <包名> <launch文件>`

### 2. 运行 ROS2 节点
右键点击任意 `.py` 或 `.cpp` 文件，选择 **"ROS2: Run"** 即可：
- 自动查找 ROS2 工作空间和包名
- 自动 source 工作空间的 `install/setup.bash`
- 执行 `ros2 run <包名> <节点名>`

### 3. 获取工作空间名称
右键点击任意文件，选择 **"Get ROS2 Workspace Name"** 即可：
- 显示工作空间名称
- 在新终端中 source 该工作空间

## 工作原理

扩展会自动完成以下操作：

1. **查找 ROS2 工作空间** - 通过搜索同时包含 `src/` 和 `install/` 目录的目录来确定
2. **提取包名** - 通过解析包目录下的 `package.xml` 文件获取
3. **执行命令** - 在新的 VS Code 终端中执行命令

## 目录结构

扩展要求标准 ROS2 工作空间结构：

```
~/ros2_ws/
├── src/           # 源代码包
├── install/       # 编译后的包（colcon build 后生成）
├── build/         # 构建文件
└── log/           # 日志文件
```

## 使用方法

1. 按 `F5` 以调试模式构建并运行扩展
2. 在 VS Code 中打开 ROS2 工作空间
3. 在文件资源管理器中右键点击文件：
   - `.launch.py` 文件 → "ROS2: Launch"
   - `.py` 或 `.cpp` 文件 → "ROS2: Run"
   - 任意文件 → "Get ROS2 Workspace Name"

## 命令列表

| 命令 | 描述 |
|------|------|
| `ros2-quick-runner.ros2launch` | 启动 `.launch.py` 文件 |
| `ros2-quick-runner.ros2run` | 运行 Python 或 C++ 节点 |
| `ros2-quick-runner.getWorkspaceName` | 获取并 source 工作空间 |

## 系统要求

- VS Code 1.80.0 或更高版本
- 已安装并 source 过 ROS2
- 已编译的 ROS2 工作空间（包含 `install/` 目录）

## 更新日志

### 0.0.1

- 初始版本发布
- 支持 ROS2 launch 文件、Python 节点和 C++ 节点
- 自动检测工作空间
- 自动提取包名
