import { inputToArray, defaultHashLength } from './hash-fn.js';
/**
 * Base implementation of hashing.
 */
export class BaseHash {
    constructor(implementation, alloc, getReader) {
        this.alloc = alloc;
        this.getReader = getReader;
        this.hash = implementation;
    }
    /**
     * @inheritdoc
     */
    update(data) {
        if (!this.hash) {
            throw new Error('Cannot continue updating hashing after dispose() has been called');
        }
        this.hash.update(inputToArray(data));
        return this;
    }
    /**
     * @inheritdoc
     */
    digest({ length = defaultHashLength, dispose = true } = {}) {
        if (!this.hash) {
            throw new Error('Cannot call digest() after dipose() has been called');
        }
        const digested = this.alloc(length);
        this.hash.digest(digested);
        if (dispose) {
            this.dispose();
        }
        return digested;
    }
    /**
     * @inheritdoc
     */
    reader({ dispose = true } = {}) {
        if (!this.hash) {
            throw new Error('Cannot call reader() after dipose() has been called');
        }
        const reader = this.getReader(this.hash.reader());
        if (dispose) {
            this.dispose();
        }
        return reader;
    }
    /**
     * @inheritdoc
     */
    dispose() {
        var _a;
        (_a = this.hash) === null || _a === void 0 ? void 0 : _a.free();
        this.hash = undefined;
    }
}
//# sourceMappingURL=hash-instance.js.map