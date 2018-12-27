import * as Lint from 'tslint';
import * as ts from 'typescript';
import { IOptions } from 'tslint/lib/language/rule/rule';

const FAILURE_STRING_RETURN = 'Public methods must have return type.';
const FAILURE_STRING_PARAMS = 'All arguments of public method must have types.';
const ALLOW_ANY_OPTIONS = 'allow-any';
const ALLOWED_METHODS_OPTION = 'allowedMethods';

export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new Walk(sourceFile, this.getOptions()));
  }
}

class Walk extends Lint.RuleWalker {
  allowAny: boolean;
  allowedMethods: string[];

  static isPublicMethod(node: ts.MethodDeclaration) {
    if (!node.modifiers) {
      return true;
    }

    return Walk.hasNonPublicModifiers(node.modifiers);
  }

  static hasNonPublicModifiers(modifiers: ts.ModifiersArray) {
    const kinds = modifiers.map(modifier => modifier.kind);
    const nonPublicModifiers: ts.SyntaxKind[] = [
      ts.SyntaxKind.PrivateKeyword,
      ts.SyntaxKind.ProtectedKeyword,
    ];
    return kinds.filter(kind => nonPublicModifiers.includes(kind)).length === 0;
  }

  isTyped(node: ts.MethodDeclaration | ts.ParameterDeclaration) {
    return Boolean(
      node.type &&
        (this.allowAny || node.type.kind !== ts.SyntaxKind.AnyKeyword),
    );
  }

  static isAllowedMethodsOption(option: any): boolean {
    return (
      typeof option === 'object' &&
      option.hasOwnProperty(ALLOWED_METHODS_OPTION)
    );
  }

  isAllowedMethod(node: ts.MethodDeclaration): boolean {
    return this.allowedMethods.includes(node.name.getText());
  }

  constructor(sourceFile: ts.SourceFile, options: IOptions) {
    super(sourceFile, options);
    this.allowAny = this.getOptions().includes(ALLOW_ANY_OPTIONS);
    this.allowedMethods = this.getOptions()
      .filter(Walk.isAllowedMethodsOption)
      .reduce((acc, option) => acc.concat(option[ALLOWED_METHODS_OPTION]), []);
  }

  visitMethodDeclaration(node: ts.MethodDeclaration) {
    if (Walk.isPublicMethod(node) && !this.isAllowedMethod(node)) {
      if (
        !node.parameters.every(
          parameter =>
            this.isTyped(parameter) || Boolean(parameter.dotDotDotToken),
        )
      ) {
        this.addFailureAtNode(node, FAILURE_STRING_PARAMS);
      }

      if (!this.isTyped(node)) {
        this.addFailureAtNode(node, FAILURE_STRING_RETURN);
      }
    }

    super.visitMethodDeclaration(node);
  }
}
