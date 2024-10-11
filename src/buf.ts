// Note that this "buffer" package is NOT the same thing as node's standard
// library. It is an API-compatible tool that does in fact "polyfill" or
// "browserify" the correct way. The reason why I'm renaming it here is
// specifically to make sure we always use this version of "Buffer" and never
// the standard node version so that it polyfills in the browser correctly.
import { Buffer as SysBuf } from "buffer";

function isValidHex(hex: string): boolean {
  return /^[0-9a-f]*$/.test(hex) && hex.length % 2 === 0;
}

function encodeHex(buffer: SysBuf): string {
  return buffer.toString("hex");
}

function decodeHex(hex: string): SysBuf {
  if (!isValidHex(hex)) {
    throw new Error("invalid hex");
  }
  const sysBuf = SysBuf.from(hex, "hex");
  return sysBuf;
}

class EbxBuf {
  public _buf: SysBuf;

  constructor(size: number, buf: SysBuf) {
    if (buf.length !== size) {
      throw new Error("invalid size error");
    }
    this._buf = buf;
  }

  get buf(): SysBuf {
    return this._buf;
  }

  static fromBuf<N extends number>(size: N, buf: SysBuf): EbxBuf {
    return new EbxBuf(size, buf);
  }

  static alloc(size: number, fill?: number): EbxBuf {
    return EbxBuf.fromBuf(size, SysBuf.alloc(size, fill));
  }

  static fromHex(size: number, hex: string): EbxBuf {
    const buf = decodeHex(hex);
    return EbxBuf.fromBuf(size, buf);
  }

  toHex(): string {
    return encodeHex(this._buf);
  }

  static fromBase64(size: number, base64: string): EbxBuf {
    try {
      const buf = SysBuf.from(base64, "base64");
      return EbxBuf.fromBuf(size, buf);
    } catch (err) {
      throw new Error("invalid encoding");
    }
  }

  toBase64(): string {
    return this._buf.toString("base64");
  }

  static fromRandom(size: number): EbxBuf {
    const buf = crypto.getRandomValues(SysBuf.alloc(size));
    return EbxBuf.fromBuf(size, buf);
  }
}

const sizeSymbol = Symbol("size");

class FixedBuf<N extends number> extends EbxBuf {
  [sizeSymbol]: N;

  constructor(size: N, buf: SysBuf) {
    super(size, buf);
    this[sizeSymbol] = size;
  }

  static fromBuf<N extends number>(size: N, buf: SysBuf): FixedBuf<N> {
    return new FixedBuf(size, buf);
  }

  static alloc<N extends number>(size: N, fill?: number): FixedBuf<N> {
    return FixedBuf.fromBuf(size, SysBuf.alloc(size, fill));
  }

  static fromHex<N extends number>(size: N, hex: string): FixedBuf<N> {
    const buf = decodeHex(hex);
    return FixedBuf.fromBuf(size, buf);
  }

  static fromRandom<N extends number>(size: N): FixedBuf<N> {
    const buf = crypto.getRandomValues(SysBuf.alloc(size));
    return FixedBuf.fromBuf(size, buf);
  }

  clone(): FixedBuf<N> {
    return FixedBuf.fromBuf(this[sizeSymbol], SysBuf.from(this._buf));
  }
}

export { SysBuf, EbxBuf, FixedBuf };
