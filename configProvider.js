const dotenv = require('dotenv');

module.exports.getConfig = () => {
    return dotenv.config();
};

module.exports.getBannedWords = () => {
    const { BANNED_WORDS } = this.getConfig().parsed;
    return new Set(BANNED_WORDS.split(','));
}
