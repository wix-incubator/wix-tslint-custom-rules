import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new Walk(sourceFile, this.getOptions()));
  }
}

class Walk extends Lint.RuleWalker {
  visitImportDeclaration(node: ts.ImportDeclaration) {
    const cleanPath = node.moduleSpecifier.getText().slice(1, -1);
    const importTextParts = cleanPath.split('/');

    if (importTextParts.includes('node_modules')) {
      this.addFailureAtNode(node, `'node_modules' shouldn't be in import path`);
    }
  }
}
