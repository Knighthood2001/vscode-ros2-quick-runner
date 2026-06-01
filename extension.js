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

		if (fs.existsSync(installPath) && fs.existsSync(srcPath)) {
			return currentDir;
		}

		currentDir = path.dirname(currentDir);
	}

	const rootInstall = path.join(root, 'install');
	const rootSrc = path.join(root, 'src');
	if (fs.existsSync(rootInstall) && fs.existsSync(rootSrc)) {
		return root;
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

function activate(context) {
	console.log('Congratulations, your extension "ros2-quick-runner" is now active!');

	const helloWorldDisposable = vscode.commands.registerCommand('ros2-quick-runner.helloWorld', function () {
		vscode.window.showInformationMessage('Hello World from ros2-quick-runner!');
	});

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

	context.subscriptions.push(
		helloWorldDisposable,
		getWorkspaceNameDisposable,
		ros2launchDisposable,
		ros2runDisposable
	);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
};
