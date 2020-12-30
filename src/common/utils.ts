import * as vscode from 'vscode';
import * as fs from 'fs';
import { basename } from 'path';

// 根目录
let root = '';
const channel = vscode.window.createOutputChannel('quick-template');

// 显示错误
export const alterError = vscode.window.showErrorMessage;

// 显示警告
export const alterWarn = vscode.window.showWarningMessage;

// 显示提示
export const alterInfo = vscode.window.showInformationMessage;

// 初始化根目录
export const getRoot = () => {
  if (root) {
    return root;
  }

  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (!workspaceFolders) {
    vscode.window.showWarningMessage('未找到项目根目录');
    throw Error('找到项目根目录');
  }

  return workspaceFolders[0].uri.path;
};

/**
 * 输出控制台
 * @param msg 消息内容
 */
export const consoleLog = (msg: any) => channel.appendLine(msg);

/**
 * 判断文件是否存在
 * @param path 文件路径
 */
export const isExist = (path: string): Promise<boolean> => new Promise((resolve) => {
  fs.access(path, fs.constants.F_OK, (err) => resolve( err ? false : true));
});

/**
 * 是否为文件夹
 * @param path 文件路径 
 */
export const isDir = (path: string): Promise<boolean> => new Promise((resolve) => {
  isExist(path)
    .then(is => {
      if (!is) {
        resolve(false);
        return;
      }

      const stats = fs.lstatSync(path);

      resolve(stats.isDirectory());
    });
});

/**
 * 读取文件夹内容
 * @param dirPath 文件夹路径
 */
export const readdir = (dirPath: string): Promise<string[]> => new Promise((resolve, reject) => {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      reject(err);
      return;
    }

    resolve(files);
  });
});

/**
 * 拷贝文件
 * @param path 原路径
 * @param target 目标路径
 */
export const copyFile = (path: string, target: string): Promise<Boolean> => new Promise((resolve, reject) => {
  isExist(target)
    .then(is => {
      if (is) {
        const fileName = basename(path);
        alterWarn(`${fileName} 已存在， 已跳过拷贝该文件`);
        resolve(false);
        return;
      }

      fs.copyFile(path, target, fs.constants.COPYFILE_EXCL, (err) => {
        if (err) {
          resolve(false);
          alterError(err.message);
          return;
        }
    
        resolve(true);
      });
    })
    .catch(reject);
});

