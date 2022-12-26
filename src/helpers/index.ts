import { createHmac } from 'node:crypto';

const hash = (str: string): string | boolean => {
  if (typeof str === 'string' && str.length > 0) {
    const hash = createHmac('sha256', '0af8c5b760970bdc5aca7bbcb899b32d118a274fb3930e7340d8d40fd85a17eee44b3f9f1f5664f40ae243c121c292be576517dbaea54e9901d103028359ce5d')
      .update(str)
      .digest('hex')
    return hash
  } else {
    return false
  }
};
export { hash };