// Yumma CSS Helper v0.0.1

const vscode = require("vscode");
const path = require("path");
const generateSnippets = require("./generateSnippets");

function activate(context) {
    const generateSnippetsCommand = vscode.commands.registerCommand("extension.generateSnippets", () => {
        const snippetsDirectory = path.join(__dirname, "snippets");
        const snippetsFilePath = path.join(snippetsDirectory, "snippets.json");

        vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: "Importing Yumma CSS classes. Can take a bit of time.",
                cancellable: false,
            },
            () => {
                return generateSnippets(snippetsFilePath).then((result) => {
                    vscode.window.showInformationMessage(result);
                });
            }
        );
    });

    context.subscriptions.push(generateSnippetsCommand);
}

module.exports = {
    activate,
};
