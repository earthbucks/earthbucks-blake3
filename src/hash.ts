import { hash, create_keyed } from "./blake3-wasm-nodejs/blake3_js.js";
import { SysBuf, FixedBuf } from "./buf.js";

type HashFunction = (input: SysBuf) => FixedBuf<32>;
type MacFunction = (key: FixedBuf<32>, data: SysBuf) => FixedBuf<32>;

const blake3Hash: HashFunction = function blake3Hash(
  data: SysBuf,
): FixedBuf<32> {
  const res = SysBuf.alloc(32);
  hash(data, res);
  return FixedBuf.fromBuf(32, res);
};

const doubleBlake3Hash: HashFunction = function doubleBlake3Hash(
  data: SysBuf,
): FixedBuf<32> {
  return FixedBuf.fromBuf(32, blake3Hash(blake3Hash(data).buf).buf);
};

const blake3Mac: MacFunction = function blake3Mac(
  key: FixedBuf<32>,
  data: SysBuf,
): FixedBuf<32> {
  const res = SysBuf.alloc(32);
  const keyed = create_keyed(key.buf);
  keyed.update(data);
  keyed.digest(res);
  return FixedBuf.fromBuf(32, res);
};

export const Hash = { blake3Hash, doubleBlake3Hash, blake3Mac };
