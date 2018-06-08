import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
    static FAILURE_STRING = 'Async functions with no await are not allowed.';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walk(sourceFile, this.getOptions()));
    }
}

class Walk extends Lint.RuleWalker {
    protected visitFunctionDeclaration(node: ts.FunctionDeclaration) {
        this.addFailureIfAsyncFunctionHasNoAwait(node);
        super.visitFunctionDeclaration(node);
    }

    protected visitArrowFunction(node: ts.ArrowFunction) {
        this.addFailureIfAsyncFunctionHasNoAwait(node);
        super.visitArrowFunction(node);
    }

    protected visitMethodDeclaration(node: ts.MethodDeclaration) {
        this.addFailureIfAsyncFunctionHasNoAwait(node);
        super.visitMethodDeclaration(node);
    }

    private isAsyncFunction(node: ts.Node): boolean {
        return Boolean(this.getAsyncModifier(node));
    }

    private getAsyncModifier(node: ts.Node) {
        return node.modifiers && node.modifiers.find((modifier) => modifier.kind === ts.SyntaxKind.AsyncKeyword);
    }

    private isAwait(node: ts.Node): boolean {
        return node.kind === ts.SyntaxKind.AwaitKeyword;
    }

    private functionBlockHasAwait(node: ts.Node) {
        if (this.isAwait(node)) {
            return true;
        }

        if (node.kind === ts.SyntaxKind.ArrowFunction || node.kind === ts.SyntaxKind.FunctionDeclaration) {
            return false;
        }

        const awaitInChildren: boolean[] = node.getChildren().map(this.functionBlockHasAwait.bind(this));
        return awaitInChildren.some(Boolean);
    }

    private addFailureIfAsyncFunctionHasNoAwait(node: ts.ArrowFunction | ts.FunctionDeclaration | ts.MethodDeclaration) {
        if (this.isAsyncFunction(node) && !this.functionBlockHasAwait(node.body as ts.Node)) {
            const asyncModifier = this.getAsyncModifier(node);
            if (asyncModifier) {
                this.addFailureAt(asyncModifier.getStart(), asyncModifier.getEnd() - asyncModifier.getStart(), Rule.FAILURE_STRING);
            }
        }
    }
}

