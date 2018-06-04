import {helper} from './lintRunner';

const rule = 'no-untyped-public-signature';

describe('noUntypedPublicSignatureRule', () => {
    it('should not allow untyped public signature', () => {
        const src = `
            class A {
                public b(c):void {
                
                }
            }
        `;
        const result = helper({src, rule});
        expect(result.errorCount).toBe(1);
        expect(result.failures[0].getFailure()).toBe('All arguments of public method must have types.')
    });

    it('should not allow :any in public signature', () => {
        const src = `
            class A {
                public b(c:any):void {
                
                }
            }
        `;
        const result = helper({src, rule});
        expect(result.errorCount).toBe(1);
        expect(result.failures[0].getFailure()).toBe('All arguments of public method must have types.')
    });

    it('should not allow untyped return value', () => {
        const src = `
            class A {
                public b() {
                
                }
            }
        `;
        const result = helper({src, rule});
        expect(result.errorCount).toBe(1);
        expect(result.failures[0].getFailure()).toBe('Public methods must have return type.')
    });

    it('should not allow :any return value', () => {
        const src = `
            class A {
                public b(): any {
                
                }
            }
        `;
        const result = helper({src, rule});
        expect(result.errorCount).toBe(1);
        expect(result.failures[0].getFailure()).toBe('Public methods must have return type.')
    });

    it('should allow typed public signature', () => {
        const src = `
            class A {
                public b(c: string):void {
                
                }
            }
        `;
        const result = helper({src, rule});
        expect(result.errorCount).toBe(0);
    });

    it('should allow untyped argument when using spread operator', () => {
        const src = `
            class A {
                public b(...c):void {
                
                }
            }
        `;
        const result = helper({src, rule});
        expect(result.errorCount).toBe(0);
    });
});