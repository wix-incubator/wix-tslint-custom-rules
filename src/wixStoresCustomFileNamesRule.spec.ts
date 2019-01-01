import { helper } from './lintRunner';

const rule = 'wix-stores-custom-file-names';
const src = '';

describe('wixStoresCustomFileNames Rule', () => {
  it('should enforce PascalCase on react components', () => {
    let result = helper({ src, rule, fileName: 'src/components/AA/aaa.tsx' });
    expect(result.failures[0].getFailure()).toEqual(
      'react components file names should be PascalCase',
    );

    result = helper({ src, rule, fileName: 'src/not_components/AA/aaa.tsx' });
    expect(result.failures.length).toEqual(0);

    result = helper({ src, rule, fileName: 'src/components/AA/aaa.ts' });
    expect(result.failures.length).toEqual(0);

    result = helper({
      src,
      rule,
      fileName: 'src/components/ProductItem/ProductItem.tsx',
    });
    expect(result.failures.length).toEqual(0);

    result = helper({
      src,
      rule,
      fileName: '/src/components/RadioOption/RadioOption.spec.ts',
    });
    expect(result.failures.length).toEqual(0);

    result = helper({
      src,
      rule,
      fileName: '/src/components/RadioOption/radio-otion.spec.ts',
    });
    expect(result.failures[0].getFailure()).toEqual(
      'non component files inside the component folder should be either camelCase or PascalCase',
    );
  });

  it('should enforce ".testKit" on testkits', () => {
    let result = helper({ src, rule, fileName: 'src/a.testkit.ts' });
    expect(result.failures[0].getFailure()).toEqual(
      'testkits file names should end with ".testKit"',
    );

    result = helper({ src, rule, fileName: 'src/aTestKit.ts' });
    expect(result.failures[0].getFailure()).toEqual(
      'testkits file names should end with ".testKit"',
    );

    result = helper({ src, rule, fileName: 'src/aTestkit.ts' });
    expect(result.failures[0].getFailure()).toEqual(
      'testkits file names should end with ".testKit"',
    );

    result = helper({ src, rule, fileName: 'src/a.testKit.ts' });
    expect(result.failures.length).toEqual(0);

    result = helper({ src, rule, fileName: 'src/atestKitblabla.ts' });
    expect(result.failures.length).toEqual(0);
  });

  it('everything else should be camelCase', () => {
    let result = helper({ src, rule, fileName: 'src/camelCase.ts' });
    expect(result.failures.length).toEqual(0);

    result = helper({ src, rule, fileName: 'src/PascalCase.ts' });
    expect(result.failures[0].getFailure()).toEqual(
      'file names should be camelCase',
    );

    result = helper({ src, rule, fileName: 'src/really_weird_name.ts' });
    expect(result.failures[0].getFailure()).toEqual(
      'file names should be camelCase',
    );
  });

  it('if file exports a class with the name of the file it should be PascalCase', () => {
    let result = helper({
      src: 'class Test {};',
      rule,
      fileName: 'src/Test.ts',
    });
    expect(result.failures.length).toEqual(0);

    result = helper({
      src: 'class Test {};',
      rule,
      fileName: 'src/test.ts',
    });
    expect(result.failures.length).toEqual(1);

    result = helper({
          src: 'class TestDriver {};',
          rule,
          fileName: 'src/Test.driver.ts',
      });
      expect(result.failures.length).toEqual(0);

      result = helper({
          src: 'describe("lala", () => {})',
          rule,
          fileName: 'src/Test.spec.ts',
      });
      expect(result.failures.length).toEqual(0);

      result = helper({
          src: 'describe("lala", () => {})',
          rule,
          fileName: 'src/test.spec.ts',
      });
      expect(result.failures.length).toEqual(0);

  });
});
