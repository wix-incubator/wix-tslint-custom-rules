import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walk(sourceFile, this.getOptions()));
    }
}

class Walk extends Lint.RuleWalker {
    visitFunctionDeclaration(node: ts.FunctionDeclaration) {
        this.addFailureIfAsyncFunctionHasNoAwait(node);
        super.visitFunctionDeclaration(node);
    }

    visitArrowFunction(node: ts.ArrowFunction) {
        this.addFailureIfAsyncFunctionHasNoAwait(node);
        super.visitArrowFunction(node);
    }

    visitMethodDeclaration(node: ts.MethodDeclaration) {
        this.addFailureIfAsyncFunctionHasNoAwait(node);
        super.visitMethodDeclaration(node);
    }

    static isAsyncFunction(node): boolean {
        return Boolean(node.modifiers && node.modifiers.find(modifier => modifier.kind === ts.SyntaxKind.AsyncKeyword));
    };

    static isAwait(node: ts.Node): boolean {
        return node.kind === ts.SyntaxKind.AwaitKeyword;
    }

    static functionBlockHasAwait(node: ts.Node) {
        if (Walk.isAwait(node)) {
            return true;
        }

        if (node.kind === ts.SyntaxKind.ArrowFunction || node.kind === ts.SyntaxKind.FunctionDeclaration) {
            return false;
        }

        const awaitInChildren = node.getChildren().map(Walk.functionBlockHasAwait);
        return awaitInChildren.some(Boolean);
    }

    addFailureIfAsyncFunctionHasNoAwait(node: ts.ArrowFunction | ts.FunctionDeclaration) {
        if (Walk.isAsyncFunction(node) && !Walk.functionBlockHasAwait(node.getChildren().find(child => child.kind === ts.SyntaxKind.Block))) {
            this.addFailureAt(node.getStart(), node.getWidth(), 'Async function without await is not allowed');
        }

    }
}
