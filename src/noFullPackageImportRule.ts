import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
    static FAILURE_STRING = (packageName) => `importing the full package ${packageName} is not allowed`;

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walk(sourceFile, this.getOptions()));
    }
}

class Walk extends Lint.RuleWalker {
    visitImportDeclaration(node: ts.ImportDeclaration) {
        const isNotAllowedPackage = this.getOptions().some(packageName => {
            const text = node.moduleSpecifier.getText().replace(/'/g, '');
            return text.indexOf(packageName) === 0 && text === packageName;
        });

        if (isNotAllowedPackage) {
            this.addFailureAtNode(node, Rule.FAILURE_STRING(node.moduleSpecifier.getText()));
        }
    }
}
