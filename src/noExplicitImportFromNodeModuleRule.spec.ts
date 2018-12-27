import { helper } from './lintRunner';
const getRule = (options: string[] = ['a-package']) => ({
  name: 'no-explicit-import-from-node-module',
  options,
});

describe('noExplicitImportFromNodeModule Rule', () => {
  it(`should fail when node_module in import path`, () => {
    const src = `
            import * as _ from '../node_modules/a-package';
        `;
    const result = helper({ src, rule: getRule() });
    expect(result.errorCount).toBe(1);
    expect(result.failures[0].getFailure()).toBe(
      `'node_modules' shouldn't be in import path`,
    );
  });

  it('should not fail on other imports', () => {
    const src = `
            import * from 'a-package';
        `;
    const result = helper({ src, rule: getRule() });
    expect(result.errorCount).toBe(0);
  });

  it('should fail when node_module is last path', () => {
    const src = `
            import * from './node_modules';
        `;
    const result = helper({ src, rule: getRule() });
    expect(result.errorCount).toBe(1);
    expect(result.failures[0].getFailure()).toBe(
      `'node_modules' shouldn't be in import path`,
    );
  });
});
