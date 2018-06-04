import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
    static FAILURE_STRING = '';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walk(sourceFile, this.getOptions()));
    }
}

class Walk extends Lint.RuleWalker {

    static isPublicMethod(node: ts.MethodDeclaration) {
        return Boolean(node.modifiers.find(modifier => modifier.kind === ts.SyntaxKind.PublicKeyword));
    }

    static isTyped(node: ts.MethodDeclaration | ts.ParameterDeclaration) {
        return Boolean(node.type && node.type.kind !== ts.SyntaxKind.AnyKeyword);
    }

    visitMethodDeclaration(node: ts.MethodDeclaration) {
        if (Walk.isPublicMethod(node)) {
            if (!node.parameters.every(parameter => Walk.isTyped(parameter) || Boolean(parameter.dotDotDotToken))) {
                this.addFailureAtNode(node, 'All arguments of public method must have types.');
            }

            if (!Walk.isTyped(node)) {
                this.addFailureAtNode(node, 'Public methods must have return type.');
            }
        }

        super.visitMethodDeclaration(node);
    }

}
