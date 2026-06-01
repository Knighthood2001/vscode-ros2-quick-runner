# ROS2 Quick Runner

A VS Code extension for quickly running ROS2 launch files, Python nodes, and C++ nodes.

> **Note**: This document is available in [Chinese](./README_zh.md) (中文版请查阅 [README_zh.md](./README_zh.md))

## Features

### 1. Launch ROS2 Files
Right-click any `.launch.py` file and select **"ROS2: Launch"** to:
- Automatically find the ROS2 workspace
- Source the workspace's `install/setup.bash`
- Execute `ros2 launch <package_name> <launch_file>`

### 2. Run ROS2 Nodes
Right-click any `.py` or `.cpp` file and select **"ROS2: Run"** to:
- Automatically find the ROS2 workspace and package name
- Source the workspace's `install/setup.bash`
- Execute `ros2 run <package_name> <node_name>`

### 3. Get Workspace Name
Right-click any file and select **"Get ROS2 Workspace Name"** to:
- Display the workspace name
- Source the workspace in a new terminal

## How It Works

The extension automatically:

1. **Finds the ROS2 workspace** by searching for directories containing both `src/` and `install/` folders
2. **Extracts the package name** by parsing the `package.xml` file in the package directory
3. **Executes commands** in a new VS Code terminal

## Directory Structure

The extension expects a standard ROS2 workspace structure:

```
~/ros2_ws/
├── src/           # Source packages
├── install/       # Built packages (after colcon build)
├── build/         # Build files
└── log/           # Log files
```

Therefore, you need to run `colcon build` first before using this extension. If you only have source packages without building, the extension will not be able to find the correct package name.

## Usage

1. Search for `ros2-quick-runner` in VS Code extensions and install it
2. Open your ROS2 project in VS Code
3. Right-click on a file in the explorer:
   - `.launch.py` files → "ROS2: Launch"
   - `.py` or `.cpp` files → "ROS2: Run"
   - Any file → "Get ROS2 Workspace Name"

## Commands

| Command | Description |
|---------|-------------|
| `ros2-quick-runner.ros2launch` | Launch a `.launch.py` file |
| `ros2-quick-runner.ros2run` | Run a Python or C++ node |
| `ros2-quick-runner.getWorkspaceName` | Get and source the workspace |

## Requirements

- VS Code 1.80.0 or higher
- ROS2 installed (e.g., ROS 2 Humble)
- A compiled ROS2 workspace with `install/` directory

## Release Notes

### 0.0.1

- Initial release
- Support for ROS2 launch files, Python nodes, and C++ nodes
- Automatic workspace detection
- Automatic package name extraction

---

For Chinese documentation, please see: [README_zh.md](./README_zh.md)
