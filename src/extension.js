const vscode = require('vscode');
const path = require('path');

const severityNames = {
    0: 'Error',
    1: 'Warning',
    2: 'Information',
    3: 'Hint'
};

function activate(context) {

    let copyOpenTabsPathAndContentCmd = vscode.commands.registerCommand('code-context-copy.copyOpenTabsPathAndContent', async () => {
        const openTabUris = [];
        // Iterate through all tab groups
        for (const tabGroup of vscode.window.tabGroups.all) {
            console.log('Processing Tab Group:', tabGroup.viewColumn);
            for (const tab of tabGroup.tabs) {
                console.log('Tab:', tab);
                console.log('Tab Input:', tab.input);
                console.log('Tab Input Type:', typeof tab.input);
                if (tab.input && tab.input.uri instanceof vscode.Uri) {
                    console.log('Found Tab URI:', tab.input.uri);
                    openTabUris.push(tab.input.uri);
                }
            }
        }
        console.log('Open Tab URIs from all groups:', openTabUris);
        await copyFilePathAndContent(openTabUris);
    });
    context.subscriptions.push(copyOpenTabsPathAndContentCmd);

    // Copy all open tabs paths from all editor groups
    let copyAllTabsPathsCmd = vscode.commands.registerCommand('code-context-copy.copyAllTabsPaths', async () => {
        const paths = [];
        for (const tabGroup of vscode.window.tabGroups.all) {
            for (const tab of tabGroup.tabs) {
                if (tab.input && tab.input.uri instanceof vscode.Uri) {
                    paths.push(tab.input.uri);
                }
            }
        }
        await copyFilePaths(paths);
    });
    context.subscriptions.push(copyAllTabsPathsCmd);

    // Copy open tabs paths from first editor group
    let copyFirstGroupTabsPathsCmd = vscode.commands.registerCommand('code-context-copy.copyFirstGroupTabsPaths', async () => {
        const tabGroups = vscode.window.tabGroups.all;
        if (tabGroups.length < 1) {
            vscode.window.showInformationMessage('No editor groups found.');
            return;
        }
        const paths = [];
        for (const tab of tabGroups[0].tabs) {
            if (tab.input && tab.input.uri instanceof vscode.Uri) {
                paths.push(tab.input.uri);
            }
        }
        await copyFilePaths(paths);
    });
    context.subscriptions.push(copyFirstGroupTabsPathsCmd);

    // Copy open tabs paths from second editor group
    let copySecondGroupTabsPathsCmd = vscode.commands.registerCommand('code-context-copy.copySecondGroupTabsPaths', async () => {
        const tabGroups = vscode.window.tabGroups.all;
        if (tabGroups.length < 2) {
            vscode.window.showInformationMessage('Second editor group not found.');
            return;
        }
        const paths = [];
        for (const tab of tabGroups[1].tabs) {
            if (tab.input && tab.input.uri instanceof vscode.Uri) {
                paths.push(tab.input.uri);
            }
        }
        await copyFilePaths(paths);
    });
    context.subscriptions.push(copySecondGroupTabsPathsCmd);

    // Copy open tabs paths from third editor group
    let copyThirdGroupTabsPathsCmd = vscode.commands.registerCommand('code-context-copy.copyThirdGroupTabsPaths', async () => {
        const tabGroups = vscode.window.tabGroups.all;
        if (tabGroups.length < 3) {
            vscode.window.showInformationMessage('Third editor group not found.');
            return;
        }
        const paths = [];
        for (const tab of tabGroups[2].tabs) {
            if (tab.input && tab.input.uri instanceof vscode.Uri) {
                paths.push(tab.input.uri);
            }
        }
        await copyFilePaths(paths);
    });
    context.subscriptions.push(copyThirdGroupTabsPathsCmd);


    let copyCurrentFileCmd = vscode.commands.registerTextEditorCommand('code-context-copy.copyCurrentFilePathAndContent', async (editor) => {
        await copyFilePathAndContent([editor.document.uri]);
    });
    context.subscriptions.push(copyCurrentFileCmd);

    let copyCurrentFilePathCmd = vscode.commands.registerTextEditorCommand('code-context-copy.copyCurrentFilePath', async (editor) => {
        await copyFilePaths([editor.document.uri]);
    });
    context.subscriptions.push(copyCurrentFilePathCmd);

    // Copy active tab path from first editor group only
    let copyFirstGroupActiveTabPathCmd = vscode.commands.registerCommand('code-context-copy.copyFirstGroupActiveTabPath', async () => {
        const tabGroups = vscode.window.tabGroups.all;
        if (tabGroups.length < 1) {
            vscode.window.showInformationMessage('No editor groups found.');
            return;
        }
        
        // Get the first tab group (index 0)
        const firstGroup = tabGroups[0];
        
        // Find the active (visible) tab in the first group
        let activeTab = null;
        for (const tab of firstGroup.tabs) {
            if (tab.isActive) {
                activeTab = tab;
                break;
            }
        }
        
        if (!activeTab || !activeTab.input || !activeTab.input.uri) {
            vscode.window.showInformationMessage('No active tab found in the first editor group.');
            return;
        }
        
        await copyFilePaths([activeTab.input.uri]);
    });
    context.subscriptions.push(copyFirstGroupActiveTabPathCmd);

    // Add problems copying commands
    let copyAllProblemsCmd = vscode.commands.registerCommand('code-context-copy.copyAllProblems', async () => {
        await copyAllProblems();
    });
    context.subscriptions.push(copyAllProblemsCmd);

    let copyCurrentFileProblemsCmd = vscode.commands.registerCommand('code-context-copy.copyCurrentFileProblems', async () => {
        await copyCurrentFileProblems();
    });
    context.subscriptions.push(copyCurrentFileProblemsCmd);
}

async function copyFilePathAndContent(files) {
    if (!files || files.length === 0) {
        vscode.window.showInformationMessage('No file(s) selected.');
        return;
    }

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showInformationMessage('No workspace is opened.');
        return;
    }

    const workspaceRoot = workspaceFolders[0].uri.fsPath;

    const copyStrings = [];

    for (const [index, fileUri] of files.entries()) {
        const normalizedPath = path.relative(workspaceRoot, fileUri.fsPath).split(path.sep).join('/');
        const fileContent = (await vscode.workspace.fs.readFile(fileUri)).toString();

        const copyString = `// File ${index + 1}: /${normalizedPath}\r\n\r\n${fileContent}`;

        copyStrings.push(copyString);

        if (index < files.length - 1) {
            copyStrings.push('\n\n');
        }
    }

    await vscode.env.clipboard.writeText(copyStrings.join(''));
}

async function copyFilePaths(files) {
    if (!files || files.length === 0) {
        vscode.window.showInformationMessage('No file(s) selected.');
        return;
    }

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showInformationMessage('No workspace is opened.');
        return;
    }

    const workspaceRoot = workspaceFolders[0].uri.fsPath;
    const paths = [];

    for (const fileUri of files) {
        const normalizedPath = '/' + path.relative(workspaceRoot, fileUri.fsPath).split(path.sep).join('/');
        paths.push(normalizedPath);
    }

    await vscode.env.clipboard.writeText(paths.join('\n'));
    vscode.window.showInformationMessage(`Copied ${paths.length} file path(s) to clipboard.`);
}


function formatDiagnostic(uri, diagnostic) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    let filePath = uri.fsPath;
    
    if (workspaceFolders && workspaceFolders.length > 0) {
        const workspaceRoot = workspaceFolders[0].uri.fsPath;
        filePath = path.relative(workspaceRoot, uri.fsPath).split(path.sep).join('/');
    }

    const severity = severityNames[diagnostic.severity] || 'Unknown';
    const startLine = diagnostic.range.start.line + 1;
    const startCol = diagnostic.range.start.character + 1;
    const source = diagnostic.source || '';
    const code = diagnostic.code ? (typeof diagnostic.code === 'object' ? diagnostic.code.value : diagnostic.code) : '';

    return `${severity}, ${filePath}, "${diagnostic.message}", ${source}(${code}), [${startLine}:${startCol}]`;
}

async function copyAllProblems() {
    const diagnostics = vscode.languages.getDiagnostics();
    const allProblems = [];

    for (const [uri, fileDiagnostics] of diagnostics) {
        for (const diagnostic of fileDiagnostics) {
            allProblems.push(formatDiagnostic(uri, diagnostic));
        }
    }

    if (allProblems.length === 0) {
        vscode.window.showInformationMessage('No problems found in the workspace.');
        return;
    }

    const output = allProblems.join('\n');
    await vscode.env.clipboard.writeText(output);
    vscode.window.showInformationMessage(`Copied ${allProblems.length} problem(s) from VS Code Problems panel to clipboard.`);
}

async function copyCurrentFileProblems() {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showInformationMessage('No active file open.');
        return;
    }

    const uri = activeEditor.document.uri;
    const diagnostics = vscode.languages.getDiagnostics(uri);
    const problems = [];

    for (const diagnostic of diagnostics) {
        problems.push(formatDiagnostic(uri, diagnostic));
    }

    if (problems.length === 0) {
        vscode.window.showInformationMessage('No problems found in the current file.');
        return;
    }

    const output = problems.join('\n');
    await vscode.env.clipboard.writeText(output);
    vscode.window.showInformationMessage(`Copied ${problems.length} problem(s) from current file to clipboard.`);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate,
};
