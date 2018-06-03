import {Configuration, Linter, Replacement} from 'tslint';

const rule = 'no-wallaby-file-only';

const helper = ({src, rule}) => {
    const linter = new Linter({fix: false});
    linter.lint('', src, Configuration.parseConfigFile({
        "rules": {
            [rule]: true
        },
        "rulesDirectory": "src"
    }));
    return linter.getResult();
};

const getFixedResult = ({src, rule}) => {
    const result = helper({src, rule});
    return Replacement.applyFixes(src, [result.failures[0].getFix()]);
};

describe('no-wallaby-file-only rule', () => {
    it('Should not allow the //file.only comment', () => {
        const src = `
            //file.only
            var x = 1;
        `;
        const result = helper({src, rule: 'no-wallaby-file-only'});
        expect(result.errorCount).toBe(1);
        expect(result.failures[0].getFailure()).toBe('file.only comments are not allowed');
    });

    it('Should not consider spaces', () => {
        const src = `
            // file.only
            var x = 1;
        `;
        const result = helper({src, rule: 'no-wallaby-file-only'});
        expect(result.errorCount).toBe(1);
        expect(result.failures[0].getFailure()).toBe('file.only comments are not allowed');
    });

    it('Should consider asterisks as well', () => {
        const src = `
            /*file.only*/
            var x = 1;
        `;
        const result = helper({src, rule: 'no-wallaby-file-only'});
        expect(result.errorCount).toBe(1);
        expect(result.failures[0].getFailure()).toBe('file.only comments are not allowed');
    });

    it('Should consider asterisks as well', () => {
        const src = `
            var x = function() {
                /*file.only*/            
            };
        `;
        const result = helper({src, rule: 'no-wallaby-file-only'});
        expect(result.errorCount).toBe(1);
        expect(result.failures[0].getFailure()).toBe('file.only comments are not allowed');
    });

    it('Should not raise any issues', () => {
        const src = `
            var x = '// file.only';
        `;
        const result = helper({src, rule: 'no-wallaby-file-only'});
        expect(result.errorCount).toBe(0);
    });
});

describe('Fixer', () => {
    describe('with comment that conatins only "file.only', () => {
        it('Should remove when using /**/', () => {
            const src = `
            let a = 1;
            /*file.only*/            
            `;
            const output = `
            let a = 1;
            `;

            expect(getFixedResult({src, rule})).toEqual(output);
        });

        it('Should remove when using //', () => {
            const src = `
            let a = 1;
            //file.only
            `;
            const output = `
            let a = 1;
            `;

            expect(getFixedResult({src, rule})).toEqual(output);
        });

        it('Should tri spaces from comment', () => {
            const src = `
            let a = 1;
            /* file.only */            
            `;

            const output = `
            let a = 1;
            `;

            expect(getFixedResult({src, rule})).toEqual(output);
        });
    });

    it('Should remove only "file.only" from comment that contains other chars', () => {
        const src = `
        let a = 1;
        /*eran says file.only*/
        `;

        const output = `
        let a = 1;
        /*eran says */
        `;

        expect(getFixedResult({src, rule})).toEqual(output);
    });

    it('Should remove duplicated "file.only"', () => {
        const src = `
        let a = 1;
        // file.only file.only
        `;

        const output = `
        let a = 1;
        `;

        expect(getFixedResult({src, rule})).toEqual(output);
    });
});
