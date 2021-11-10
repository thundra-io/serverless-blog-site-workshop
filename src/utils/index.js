const { v4: uuidv4 } = require('uuid');

const util = require('util');
const exec = util.promisify(require('child_process').exec);

const generateUuid = () => {
    return uuidv4();
}

const generateShortUuid = () => {
    return generateUuid().substring(0, 8);
}

const delay = ms => new Promise(res => setTimeout(res, ms));

const executeCommand = async (cmdStr, options = {}) => {
    return (await exec(cmdStr, options));
}

module.exports = {
    generateUuid,
    generateShortUuid,
    delay,
    executeCommand,
}
