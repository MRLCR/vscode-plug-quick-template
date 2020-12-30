import * as vscode from 'vscode';

import { initDisposable } from './commands/init';
import { createDisposable } from './commands/create';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "quick-template" is now active!');

  context.subscriptions.push(initDisposable);
  context.subscriptions.push(createDisposable);
}

export function deactivate() {}
