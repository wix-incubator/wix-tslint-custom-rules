import * as Lint from 'tslint';
import * as ts from 'typescript';
import * as path from 'path';

const failureStrings = {
    reactComp: 'react components file names should be PascalCase',
    testkit: 'testkits file names should end with ".testKit"',
    camelCase: 'file names should be camelCase',
};

function isLowerCase(str: string): boolean {
    return str === str.toLowerCase();
}

function isCamelCased(name: string): boolean {
    return isLowerCase(name[0]) && !name.includes("_") && !name.includes("-");
}

export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const extname = path.extname(sourceFile.fileName);
        const dirname = path.dirname(sourceFile.fileName);
        const fileName = path.basename(sourceFile.fileName);

        if (extname === '.tsx' && dirname.includes('/components')) {
            return [new Lint.RuleFailure(
                sourceFile,
                0,
                0,
                failureStrings.reactComp,
                this.ruleName,
            )];
        }

        if (/testkit\./i.exec(fileName) !== null) {
            if (!fileName.includes('.testKit.')) {
                return [new Lint.RuleFailure(
                    sourceFile,
                    0,
                    0,
                    failureStrings.testkit,
                    this.ruleName,
                )];
            }
        }

        if (!isCamelCased(fileName)) {
            return [new Lint.RuleFailure(
                sourceFile,
                0,
                0,
                failureStrings.camelCase,
                this.ruleName,
            )];
        }

    }
}
