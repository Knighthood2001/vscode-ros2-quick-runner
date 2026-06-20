const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

function findRos2Workspace(filePath) {
	const dir = path.dirname(filePath);
	let currentDir = dir;
	const homeDir = process.env.HOME || process.env.USERPROFILE || '';
	const root = path.parse(currentDir).root;

	while (currentDir !== root && currentDir !== homeDir) {
		const installPath = path.join(currentDir, 'install');
		const srcPath = path.join(currentDir, 'src');

		// 优先判断：同时有 src/ 和 install/（已 build 的工作空间，最准确）
		if (fs.existsSync(srcPath) && fs.existsSync(installPath)) {
			return currentDir;
		}

		// 兜底判断：只有 src/，但 src 目录下有包含 package.xml 的子目录（未 build 的工作空间）
		if (fs.existsSync(srcPath)) {
			try {
				const items = fs.readdirSync(srcPath);
				const hasPackage = items.some(item => {
					const itemPath = path.join(srcPath, item);
					return fs.statSync(itemPath).isDirectory() &&
						fs.existsSync(path.join(itemPath, 'package.xml'));
				});
				if (hasPackage) {
					return currentDir;
				}
			} catch {
				// 忽略错误，继续向上查找
			}
		}

		currentDir = path.dirname(currentDir);
	}

	return null;
}

async function getPackageNameFromPath(filePath) {
	let currentPath = path.dirname(filePath);
	let depth = 0;
	const maxDepth = 10;

	while (currentPath !== path.dirname(currentPath) && depth < maxDepth) {
		const packageXmlPath = path.join(currentPath, 'package.xml');
		if (fs.existsSync(packageXmlPath)) {
			const packageXmlContent = fs.readFileSync(packageXmlPath, 'utf8');
			const match = /<name>([\w-]+)<\/name>/.exec(packageXmlContent);
			if (match && match[1]) {
				return match[1];
			}
		}
		currentPath = path.dirname(currentPath);
		depth++;
	}

	return null;
}

// 判断当前目录是否是一个 ROS2 包（通过是否存在 package.xml）
function isRos2Package(dirPath) {
	return fs.existsSync(path.join(dirPath, 'package.xml'));
}

// 从任意目录向上查找最近的 ROS2 包
function findNearestPackage(dirPath) {
	let currentDir = dirPath;
	const homeDir = process.env.HOME || process.env.USERPROFILE || '';
	const root = path.parse(currentDir).root;

	while (currentDir !== root && currentDir !== homeDir) {
		if (isRos2Package(currentDir)) {
			return currentDir;
		}
		const parent = path.dirname(currentDir);
		// 防止到达根目录后 path.dirname 不变导致死循环
		if (parent === currentDir) {
			break;
		}
		currentDir = parent;
	}
	return null;
}

// 判断是否是工作空间根目录（src/ 下的子目录包含 package.xml）
function isWorkspaceRoot(dirPath) {
	const srcPath = path.join(dirPath, 'src');
	if (!fs.existsSync(srcPath)) {
		return false;
	}
	try {
		const items = fs.readdirSync(srcPath);
		return items.some(item => {
			const itemPath = path.join(srcPath, item);
			return fs.statSync(itemPath).isDirectory() &&
				fs.existsSync(path.join(itemPath, 'package.xml'));
		});
	} catch {
		return false;
	}
}

// 根据右键的目录智能判断编译目标
// 返回 { buildPath, package }：package 为 null 表示全量编译，否则只编译该包
function getBuildTarget(folderPath) {
	const folderName = path.basename(folderPath);

	// 1. 右键的是 src 目录 → 全量编译
	if (folderName === 'src' && isWorkspaceRoot(path.dirname(folderPath))) {
		return { buildPath: path.dirname(folderPath), package: null };
	}

	// 2. 右键的是工作空间根目录 → 全量编译
	if (isWorkspaceRoot(folderPath)) {
		return { buildPath: folderPath, package: null };
	}

	// 3. 向上查找最近的 ROS2 包 → 单包编译
	const packagePath = findNearestPackage(folderPath);
	if (packagePath) {
		const workspacePath = findRos2Workspace(packagePath);
		console.log('[colconBuild] folderPath:', folderPath);
		console.log('[colconBuild] findNearestPackage →', packagePath);
		console.log('[colconBuild] findRos2Workspace →', workspacePath);
		if (workspacePath) {
			return {
				buildPath: workspacePath,
				package: path.basename(packagePath)
			};
		}
	}

	// 4. 找不到任何工作空间
	return { buildPath: null, package: null };
}

function activate(context) {
	console.log('extension "ros2-quick-runner" is now active!');

	const getWorkspaceNameDisposable = vscode.commands.registerCommand('ros2-quick-runner.getWorkspaceName', async function (uri) {
		if (!uri) {
			vscode.window.showErrorMessage('Please right-click a file in the explorer');
			return;
		}

		const filePath = uri.fsPath;
		const workspacePath = findRos2Workspace(filePath);

		if (workspacePath) {
			const workspaceName = path.basename(workspacePath);
			const installPath = path.join(workspacePath, 'install', 'setup.bash');

			const terminal = vscode.window.createTerminal(`ROS2: ${workspaceName}`);
			terminal.sendText(`source "${installPath}"`);
			terminal.show();

			vscode.window.showInformationMessage(`Workspace "${workspaceName}" activated in terminal!`);
		} else {
			vscode.window.showWarningMessage('No ROS2 workspace found for this file.');
		}
	});

	const ros2launchDisposable = vscode.commands.registerCommand('ros2-quick-runner.ros2launch', async (uri) => {
		if (!uri) {
			vscode.window.showErrorMessage('Please right-click a launch file in the explorer');
			return;
		}

		const filePath = uri.fsPath;
		const workspacePath = findRos2Workspace(filePath);

		if (!workspacePath) {
			vscode.window.showErrorMessage('No ROS2 workspace found');
			return;
		}

		const packageName = await getPackageNameFromPath(filePath);
		if (!packageName) {
			vscode.window.showErrorMessage('Cannot find ROS package name');
			return;
		}

		const launchFileName = path.basename(filePath);
		const installPath = path.join(workspacePath, 'install', 'setup.bash');

		const terminal = vscode.window.createTerminal(`ROS2 Launch: ${packageName}`);
		terminal.show();
		terminal.sendText(`source "${installPath}"`);
		terminal.sendText(`ros2 launch ${packageName} ${launchFileName}`);
	});

	const ros2runDisposable = vscode.commands.registerCommand('ros2-quick-runner.ros2run', async (uri) => {
		if (!uri) {
			vscode.window.showErrorMessage('Please right-click a node file in the explorer');
			return;
		}

		const filePath = uri.fsPath;
		const fileName = path.basename(filePath);

		if (fileName.endsWith('.launch.py')) {
			vscode.window.showErrorMessage('This is a launch file. Please use "ROS2: Launch" command instead.');
			return;
		}

		const workspacePath = findRos2Workspace(filePath);

		if (!workspacePath) {
			vscode.window.showErrorMessage('No ROS2 workspace found');
			return;
		}

		const packageName = await getPackageNameFromPath(filePath);
		if (!packageName) {
			vscode.window.showErrorMessage('Cannot find ROS package name');
			return;
		}

		const fileExt = path.extname(filePath);
		const installPath = path.join(workspacePath, 'install', 'setup.bash');

		if (fileExt === '.py') {
			const terminal = vscode.window.createTerminal(`ROS2 Run: ${packageName}`);
			terminal.show();
			terminal.sendText(`source "${installPath}"`);
			terminal.sendText(`ros2 run ${packageName} ${fileName}`);
		} else if (fileExt === '.cpp') {
			const executableName = path.basename(filePath, fileExt);
			const terminal = vscode.window.createTerminal(`ROS2 Run: ${packageName}`);
			terminal.show();
			terminal.sendText(`source "${installPath}"`);
			terminal.sendText(`ros2 run ${packageName} ${executableName}`);
		} else {
			vscode.window.showErrorMessage('Unsupported file type');
		}
	});

	const colconBuildDisposable = vscode.commands.registerCommand('ros2-quick-runner.colconBuild', async (uri) => {
		if (!uri) {
			vscode.window.showErrorMessage('Please right-click a folder in the explorer');
			return;
		}

		const folderPath = uri.fsPath;
		const target = getBuildTarget(folderPath);

		if (!target.buildPath) {
			vscode.window.showErrorMessage('No ROS2 workspace found for this folder');
			return;
		}

		// 智能选择编译命令
		const command = target.package
			? `colcon build --packages-select ${target.package}`
			: 'colcon build';

		const terminalName = target.package
			? `colcon build: ${target.package}`
			: `colcon build: ${path.basename(target.buildPath)}`;

		const terminal = vscode.window.createTerminal({
			name: terminalName,
			cwd: target.buildPath
		});
		terminal.show();
		// terminal.sendText(`cd "${target.buildPath}"`);
		terminal.sendText(command);
	});

	context.subscriptions.push(
		getWorkspaceNameDisposable,
		ros2launchDisposable,
		ros2runDisposable,
		colconBuildDisposable
	);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
};
