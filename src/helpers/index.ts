import { createHmac } from 'node:crypto';
const secret = process.env.SECRET_HASH;
if(!secret) throw new Error('Secret hash is missing');
function hashing (str: string): string | false { 
  if (typeof str === 'string' && str.length > 0) {
    const hash = createHmac('sha256', secret || '')
      .update(str)
      .digest('hex')
    return hash
  } else {
    return false
  }
};

const compare = (str: string, hash: string): boolean => (hashing(str.toString()) === hash);
export { hashing, compare };