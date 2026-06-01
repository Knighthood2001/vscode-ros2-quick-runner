# ROS2 Quick Runner

A VS Code extension for quickly running ROS2 launch files, Python nodes, and C++ nodes.

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

## Usage

1. Press `F5` to build and run the extension in debug mode
2. Open a ROS2 workspace in VS Code
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
- ROS2 installed and sourced
- A compiled ROS2 workspace with `install/` directory

## Release Notes

### 0.0.1

- Initial release
- Support for ROS2 launch files, Python nodes, and C++ nodes
- Automatic workspace detection
- Automatic package name extraction
