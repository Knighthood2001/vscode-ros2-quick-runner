// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
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

function activate(context) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ros2-quick-runner" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const helloWorldDisposable = vscode.commands.registerCommand('ros2-quick-runner.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from ros2-quick-runner!');
	});

	const getWorkspaceNameDisposable = vscode.commands.registerCommand('ros2-quick-runner.getWorkspaceName', async function (uri) {
		const filePath = uri.fsPath;
		const workspacePath = findRos2Workspace(filePath);

		if (workspacePath) {
			const workspaceName = path.basename(workspacePath);
			const installPath = path.join(workspacePath, 'install', 'setup.bash');

			await vscode.env.clipboard.writeText(`source ${installPath}`);

			vscode.window.showInformationMessage(`Workspace "${workspaceName}" found! Command copied to clipboard.`);
		} else {
			vscode.window.showWarningMessage('No ROS2 workspace found for this file.');
		}
	});

	context.subscriptions.push(helloWorldDisposable, getWorkspaceNameDisposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
