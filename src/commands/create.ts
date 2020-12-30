import * as vscode from 'vscode';
import { TEMPLATE_DIR_NAME } from '../common/constant';
import {
  getRoot,
  isDir,
  isExist,
  readdir,
  copyFile,
  alterError,
  alterInfo,
  consoleLog,
} from '../common/utils';

// 命令名称
const COMMAND_NAME = 'quick-template.create';

export const createDisposable = vscode.commands.registerCommand(COMMAND_NAME, async (uri: vscode.Uri) => {
  try {
    const root = getRoot();
    const dir = `${root}/${TEMPLATE_DIR_NAME}`;

    // 判断是否已经初始化创建了模板文件
    if (!(await isDir(dir))) {
      alterError('请先执行初始化命令 init-quick-templates, 然后添加需要的模板到文件下');
      return;
    }

    if (!uri) {
      alterError('未找到需要创建模板的父级目录');
      return;
    }

    const files = await readdir(dir);

    if (files.length <= 0) {
      alterInfo(`请先添加模板到 ${TEMPLATE_DIR_NAME}`);
      return;
    }

    vscode.window.showQuickPick(files)
      .then(async (templateName) => {
        const tplPath = `${root}/${TEMPLATE_DIR_NAME}/${templateName}`;

        if (await isDir(tplPath)) {
          const tplFiles = await readdir(tplPath);

          if (tplFiles.length <= 0) {
            alterInfo(`模板内容为空，请在${TEMPLATE_DIR_NAME}/${templateName}下，添加文件`);
            return;
          }

          tplFiles.forEach((file) => {
            try {
              copyFile(`${tplPath}/${file}`, `${uri.path}/${file}`);
            } catch (err) {
              alterError(err.message);
              consoleLog(err);
            }
          });
        } else {
          const targetPath = `${uri.path}/${templateName}`;
          copyFile(tplPath, targetPath);
        }

      });
  } catch (err) {
    alterError(err.message);
    consoleLog(err);
  }
});
