import * as Lint from 'tslint';
import * as ts from 'typescript';
import {isArrowFunction, isFunctionDeclaration} from 'tsutils';

export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

const walk = (ctx: Lint.WalkContext<any>): void => {
    const isAsyncFunction = (node): boolean => {
        return Boolean(node.modifiers && node.modifiers.find(modifier => modifier.kind === ts.SyntaxKind.AsyncKeyword));
    };

    const hasAwait = (node: ts.Node): boolean => {
        return node.kind === ts.SyntaxKind.AwaitKeyword;
    };

    const recursivelyHasAwait = (node: ts.Node) => {
        if (hasAwait(node)) {
            return true;
        }
        const awaitInChildren = node.getChildren().map(recursivelyHasAwait);
        if (node.kind === ts.SyntaxKind.ArrowFunction || node.kind === ts.SyntaxKind.FunctionDeclaration) {
            return false;
        }
        return awaitInChildren.some(Boolean);
    };

    const getAllFunctions = (rootNode: ts.Node) => {
        let funcs = [];
        const isFunction = child => isFunctionDeclaration(child) || isArrowFunction(child);

        const getFunctions = (node) => {
            if (isFunction(node)) {
                funcs.push(node);
            }
            node.getChildren().map(getFunctions);
        };

        getFunctions(rootNode);
        return funcs;
    };

    const {sourceFile} = ctx;
    const checkIfFunctionIsAsyncButHasNoAwait = (node: ts.Node) => {
        if ((isFunctionDeclaration(node) || isArrowFunction(node)) && isAsyncFunction(node)) {
            const block = node.getChildren().find(child => child.kind === ts.SyntaxKind.Block);
            if (!recursivelyHasAwait(block)) {
                ctx.addFailureAtNode(node, 'Async function without await is not allowed');
            }
        }
    };

    getAllFunctions(sourceFile).forEach(checkIfFunctionIsAsyncButHasNoAwait);
};
