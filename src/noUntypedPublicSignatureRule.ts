import * as Lint from 'tslint';
import * as ts from 'typescript';

const FAILURE_STRING_RETURN = 'Public methods must have return type.';
const FAILURE_STRING_PARAMS = 'All arguments of public method must have types.';

export class Rule extends Lint.Rules.AbstractRule {
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
                this.addFailureAtNode(node, FAILURE_STRING_PARAMS);
            }

            if (!Walk.isTyped(node)) {
                this.addFailureAtNode(node, FAILURE_STRING_RETURN);
            }
        }

        super.visitMethodDeclaration(node);
    }

}
