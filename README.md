# Code Context Copy

![Code Context Copy logo](images/copy_full.png)

## Description

A VS Code extension that helps you quickly copy code context - including file paths, contents, and workspace problems. Perfect for sharing context with AI coding assistants like Claude Code, GitHub Copilot, or ChatGPT. Just hit a key and paste!

## Features

- **Copy File Path and Content** - Copy file paths and contents to clipboard
- **Copy Open Tabs Path and Content** - Copy all open tabs with their paths and contents
- **Copy All Problems** - Copy all current problems/diagnostics from the VS Code Problems panel
- **Copy Current File Problems** - Copy problems/diagnostics from the current file only

### Keyboard shortcuts:

- `ctrl+alt+c` - Copy current file path and content
- `ctrl+alt+a` - Copy all open tabs path and content
- `ctrl+alt+shift+p` - Copy all current VS Code problems
- `ctrl+alt+p` - Copy current file problems only

## Building and Installing Locally

### Prerequisites

1. **Install VS Code Extension Manager (vsce)**

   ```bash
   npm install -g @vscode/vsce
   ```

2. **Install Dependencies**
   Navigate to the extension directory and install the required dependencies:

   ```bash
   npm install
   ```

3. **Package the Extension**
   Create a .vsix file:
   ```bash
   vsce package
   ```

### Installing the Extension

1. Open VS Code, Cursor, or any VS Code fork
2. Go to the Extensions panel (`Ctrl+Shift+X` or `Cmd+Shift+X`)
3. Click on the three dots (`...`) menu at the top of the Extensions panel
4. Select "Install from VSIX..."
5. Navigate to and select the generated .vsix file
6. The extension will be installed and ready to use

## Usage

### Copy File Path and Content

1. Use `ctrl+alt+c` keyboard shortcut
2. Current file's path and content will be copied to clipboard

### Copy All Open Tabs Path and Content

1. Use `ctrl+alt+a` keyboard shortcut
2. All open tabs will be copied with their paths and contents

### Copy All Current VS Code Problems

1. Use `ctrl+alt+shift+p` keyboard shortcut
2. All current problems (errors, warnings, hints) shown in the VS Code Problems panel will be copied in a simple format:
   ```
   Error, src/file.js, "Syntax error", eslint(semi), [10:5]
   Warning, lib/utils.ts, "Variable never used", typescript(6133), [25:10]
   ```

### Copy Current File Problems

1. Open a file with problems/diagnostics
2. Use `ctrl+alt+p` keyboard shortcut
3. Problems from the current file only will be copied in the same simple format

The problems output format includes:

- Severity (Error, Warning, Information, Hint)
- File path (relative to workspace)
- Error message (in quotes)
- Source and code (e.g., eslint(no-unused-vars))
- Line and column position [line:column]

## Custom Keybindings

Visual Studio Code allows you to set custom keybindings for extension commands directly within the IDE.
To customize the keybindings for "Copy File Path and Content" commands:

1. Open the Keyboard Shortcuts editor in VS Code by going to "File" > "Preferences" > "Keyboard Shortcuts"
2. Search for the desired command using: "extension.copy"
3. Click on the "Keybinding" cell for the command you want to edit the shortcut for.
4. Press the desired key combination for the custom keybinding.
5. If there are any conflicts with existing keybindings, VS Code will prompt to resolve them.
6. The custom keybinding will be added to your keybindings.json file.

Feel free to customize the keybindings to suit your preferences!

---

Happy coding!
