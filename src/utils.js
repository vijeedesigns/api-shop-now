const generateGuid = () => Date.now().toString(36) + Math.random().toString(36).substr(2);
const prePad = (i='', n=2, z='0') => i.toString().padStart(n, z);

module.exports = { generateGuid, prePad };