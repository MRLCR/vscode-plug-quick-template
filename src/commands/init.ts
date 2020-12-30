import * as vscode from 'vscode';
import * as fs     from 'fs';

import { TEMPLATE_DIR_NAME } from '../common/constant';
import { alterError, alterInfo, getRoot } from '../common/utils';

// 命令名称
const COMMAND_NAME = 'quick-template.init';

export const initDisposable = vscode.commands.registerCommand(COMMAND_NAME, () => {
  const root = getRoot();
  const dir = `${root}/${TEMPLATE_DIR_NAME}`;

  fs.access(dir, fs.constants.F_OK, (err) => {
    alterInfo(dir);

    // 不存在
    if (err) {
      fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) {
          alterError(err.message);
          throw err;
        }

        alterInfo(`创建成功，请在${TEMPLATE_DIR_NAME}下添加模板吧`);
      });
    } else {
      alterInfo(`已完成过初始化，请在根目录下查看 ${TEMPLATE_DIR_NAME} 文件夹`);
    }
  });

});