import * as Lint from 'tslint';
import * as ts from 'typescript';
import { forEachComment } from 'tsutils';

export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, walk);
  }
}

const FILE_ONLY = 'file.only';

const walk = (ctx: Lint.WalkContext<any>): void => {
  const { sourceFile } = ctx;
  forEachComment(ctx.sourceFile, (fullText, comment) => {
    const commentText = fullText.slice(comment.pos, comment.end);
    if (commentText.includes(FILE_ONLY)) {
      ctx.addFailureAt(
        comment.pos,
        comment.end,
        'file.only comments are not allowed',
      );
    }
  });
};
