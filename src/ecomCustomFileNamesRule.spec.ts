import {helper} from './lintRunner';

const rule = 'ecom-custom-file-names';
const src = '';

describe('ecomCustomFileNames Rule', () => {
    it('should enforce PascalCase on react components', () => {
        let result = helper({src, rule, fileName: 'src/components/AA/aaa.tsx'});
        expect(result.failures[0].getFailure()).toEqual('react components file names should be PascalCase');

        result = helper({src, rule, fileName: 'src/not_components/AA/aaa.tsx'});
        expect(result.failures.length).toEqual(0);

        result = helper({src, rule, fileName: 'src/components/AA/aaa.ts'});
        expect(result.failures.length).toEqual(0);
    });

    it('should enforce ".testKit" on testkits', () => {
        let result = helper({src, rule, fileName: 'src/a.testkit.ts'});
        expect(result.failures[0].getFailure()).toEqual('testkits file names should end with ".testKit"');

        result = helper({src, rule, fileName: 'src/aTestKit.ts'});
        expect(result.failures[0].getFailure()).toEqual('testkits file names should end with ".testKit"');

        result = helper({src, rule, fileName: 'src/aTestkit.ts'});
        expect(result.failures[0].getFailure()).toEqual('testkits file names should end with ".testKit"');

        result = helper({src, rule, fileName: 'src/a.testKit.ts'});
        expect(result.failures.length).toEqual(0);

        result = helper({src, rule, fileName: 'src/atestKitblabla.ts'});
        expect(result.failures.length).toEqual(0);
    });

    it('everything else should be camelCase', () => {
        let result = helper({src, rule, fileName: 'src/camelCase.ts'});
        expect(result.failures.length).toEqual(0);

        result = helper({src, rule, fileName: 'src/PascalCase.ts'});
        expect(result.failures[0].getFailure()).toEqual('file names should be camelCase');

        result = helper({src, rule, fileName: 'src/really_weird_name.ts'});
        expect(result.failures[0].getFailure()).toEqual('file names should be camelCase');
    });
});
