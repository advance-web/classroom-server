const { customAlphabet } = require('nanoid');

const uIdGenerator = () => {
  const nanoid = customAlphabet(process.env.NANOID_ALPHABET, 6);
  return nanoid();
};

module.exports = uIdGenerator;
