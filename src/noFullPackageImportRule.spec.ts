import { helper } from './lintRunner';
const getRule = (options: string[] = ['a-package']) => ({
  name: 'no-full-package-import',
  options,
});

describe('noFullPackgeImport Rule', () => {
  it(`should fail when importing a full package that was in the arguments`, () => {
    const src = `
            import * as _ from 'a-package';
        `;
    const result = helper({ src, rule: getRule() });
    expect(result.errorCount).toBe(1);
    expect(result.failures[0].getFailure()).toBe(
      `importing the full package 'a-package' is not allowed`,
    );
  });

  xit(`should fail when importing a full package that was in the arguments`, () => {
    const src = `
            import * as _ from "a-package";
        `;
    const result = helper({ src, rule: getRule() });
    expect(result.errorCount).toBe(1);
    expect(result.failures[0].getFailure()).toBe(
      `importing the full package 'a-package' is not allowed`,
    );
  });

  it(`should not fail when importing a specific file from package`, () => {
    const src = `
            import * as func from 'a-package/func';
        `;
    const result = helper({ src, rule: getRule() });
    expect(result.errorCount).toBe(0);
  });

  it(`should not fail when importing a full package that is not in the options`, () => {
    const src = `
            import * as func from 'b-package';
        `;
    const result = helper({ src, rule: getRule() });
    expect(result.errorCount).toBe(0);
  });

  it(`should not fail when importing a specific file from package`, () => {
    const src = `
            import * as func from '@wix/a-package';
        `;
    const result = helper({ src, rule: getRule(['@wix/a-package']) });
    expect(result.errorCount).toBe(1);
  });
});
