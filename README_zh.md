# ROS2 Quick Runner

一款用于快速运行 ROS2 launch 文件、Python 节点和 C++ 节点的 VS Code 扩展。

> **注意**：本文档亦有 [英文版](./README.md)，如需查看请移步 [README.md](./README.md)

## 功能特性

### 1. 启动 ROS2 Launch 文件
右键点击任意 `.launch.py` 文件，选择 **"ros2 launch"** 即可：
- 自动查找 ROS2 工作空间
- 自动 source 工作空间的 `install/setup.bash`
- 执行 `ros2 launch <包名> <launch文件>`

### 2. 运行 ROS2 节点
右键点击任意 `.py` 或 `.cpp` 文件，选择 **"ros2 run"** 即可：
- 自动查找 ROS2 工作空间和包名
- 自动 source 工作空间的 `install/setup.bash`
- 执行 `ros2 run <包名> <节点名>`

### 3. 获取工作空间名称
右键点击任意文件，选择 **"ros2 source"** 即可：
- 显示工作空间名称
- 在新终端中 source 该工作空间

### 4. 编译 ROS2 工作空间
在工作空间中的任意文件夹上右键，选择 **"colcon build"** 即可：
- 自动查找 ROS2 工作空间根目录
- 在工作空间根目录打开终端
- 执行 `colcon build`

**智能路径识别**：
- 右键 `xxx_ws/` → 在 `xxx_ws/` 中 build
- 右键 `xxx_ws/src/` → 在 `xxx_ws/` 中 build
- 右键任意子目录（如 `xxx_ws/src/pkg_a`）→ 在 `xxx_ws/` 中 build

## 工作原理

扩展会自动完成以下操作：

1. **查找 ROS2 工作空间** - 通过查找 `src/` 子目录下包含 `package.xml` 的目录来确定
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

因此，该扩展需要你首先进行 `colcon build` 操作，然后才能正常使用。如果你使用的是源代码包，而没有进行编译，扩展将无法找到正确的包名。

## 使用方法

1. 在 VS Code 扩展中搜索 `ros2-quick-runner` 并进行安装
2. 在 VS Code 中打开 ROS2 项目
3. 在文件资源管理器中右键点击：
   - `.launch.py` 文件 → "ros2 launch"
   - `.py` 或 `.cpp` 文件 → "ros2 run"
   - 任意文件 → "ros2 source"
   - 任意文件夹 → "colcon build"

## 命令列表

| 命令 | 描述 |
|------|------|
| `ros2-quick-runner.ros2launch` | 启动 `.launch.py` 文件 |
| `ros2-quick-runner.ros2run` | 运行 Python 或 C++ 节点 |
| `ros2-quick-runner.getWorkspaceName` | 获取并 source 工作空间 |
| `ros2-quick-runner.colconBuild` | 编译 ROS2 工作空间 |

## 系统要求

- VS Code 1.80.0 或更高版本
- 已安装 ROS2 环境（例如 ROS 2 Humble）
- 已编译的 ROS2 工作空间（包含 `install/` 目录）

## 更新日志

详细内容请查看：[CHANGELOG.md](./CHANGELOG.md)

### 0.0.3

- 初始版本发布
- 支持 ROS2 launch 文件、Python 节点和 C++ 节点
- 自动检测工作空间
- 自动提取包名

---

英文文档请查看：[README.md](./README.md)
