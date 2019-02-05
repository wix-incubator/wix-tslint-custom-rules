import * as Lint from 'tslint';
import * as ts from 'typescript';
import * as path from 'path';
import { isUpperCase } from 'tslint/lib/utils';

const failureStrings = {
  reactComp: 'react components file names should be PascalCase',
  filesRelatedToReactComp:
    'non component files inside the component folder should be either camelCase or PascalCase',
  testkit: 'testkits file names should end with ".testKit"',
  camelCase: 'file names should be camelCase',
  classFiles: 'class files should be PascalCase',
};

function isPascalCased(name: string): boolean {
  return isUpperCase(name[0]) && !name.includes('_') && !name.includes('-');
}

function isLowerCase(str: string): boolean {
  return str === str.toLowerCase();
}

function isCamelCased(name: string): boolean {
  return isLowerCase(name[0]) && !name.includes('_') && !name.includes('-');
}

export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    const extname = path.extname(sourceFile.fileName);
    const dirname = path.dirname(sourceFile.fileName);
    const fileName = path.basename(sourceFile.fileName);

    if (extname === '.tsx' && dirname.includes('/components')) {
      if (!isPascalCased(fileName)) {
        return [
          new Lint.RuleFailure(
            sourceFile,
            0,
            0,
            failureStrings.reactComp,
            this.ruleName,
          ),
        ];
      }
      return;
    }

    if (extname === '.ts' && dirname.includes('/components')) {
      if (!isPascalCased(fileName) && !isCamelCased(fileName)) {
        return [
          new Lint.RuleFailure(
            sourceFile,
            0,
            0,
            failureStrings.filesRelatedToReactComp,
            this.ruleName,
          ),
        ];
      }
      return;
    }

    if (
      /testkit\./i.exec(fileName) !== null &&
      !fileName.includes('.testKit.')
    ) {
      return [
        new Lint.RuleFailure(
          sourceFile,
          0,
          0,
          failureStrings.testkit,
          this.ruleName,
        ),
      ];
    }

    const fileNameWithoutExt = fileName.replace(extname, '');
    if (
      sourceFile.text
        .toLowerCase()
        .includes(`class ${fileNameWithoutExt.toLowerCase().replace('.', '')}`)
    ) {
      if (!isPascalCased(fileName)) {
        return [
          new Lint.RuleFailure(
            sourceFile,
            0,
            0,
            failureStrings.classFiles,
            this.ruleName,
          ),
        ];
      } else {
        return;
      }
    }

    if (
      fileName.includes('.spec') &&
      (isPascalCased(fileName) || isCamelCased(fileName))
    ) {
      return;
    }

    if (!isCamelCased(fileName)) {
      return [
        new Lint.RuleFailure(
          sourceFile,
          0,
          0,
          failureStrings.camelCase,
          this.ruleName,
        ),
      ];
    }
  }
}
