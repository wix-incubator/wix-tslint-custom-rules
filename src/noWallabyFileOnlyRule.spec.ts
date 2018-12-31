import { Configuration, Linter, Replacement } from 'tslint';
import { getFixedResult, helper } from './lintRunner';
const rule = 'no-wallaby-file-only';

describe('no-wallaby-file-only rule', () => {
  it('Should not allow the //file.only comment', () => {
    const src = `
            //file.only
            var x = 1;
        `;
    const result = helper({ src, rule });
    expect(result.errorCount).toBe(1);
    expect(result.failures[0].getFailure()).toBe(
      'file.only comments are not allowed',
    );
  });

  it('Should not consider spaces', () => {
    const src = `
            // file.only
            var x = 1;
        `;
    const result = helper({ src, rule });
    expect(result.errorCount).toBe(1);
    expect(result.failures[0].getFailure()).toBe(
      'file.only comments are not allowed',
    );
  });

  it('Should consider asterisks as well', () => {
    const src = `
            /*file.only*/
            var x = 1;
        `;
    const result = helper({ src, rule });
    expect(result.errorCount).toBe(1);
    expect(result.failures[0].getFailure()).toBe(
      'file.only comments are not allowed',
    );
  });

  it('Should consider asterisks as well', () => {
    const src = `
            var x = function() {
                /*file.only*/            
            };
        `;
    const result = helper({ src, rule });
    expect(result.errorCount).toBe(1);
    expect(result.failures[0].getFailure()).toBe(
      'file.only comments are not allowed',
    );
  });

  it('Should not raise any issues', () => {
    const src = `
            var x = '// file.only';
        `;
    const result = helper({ src, rule });
    expect(result.errorCount).toBe(0);
  });
});
