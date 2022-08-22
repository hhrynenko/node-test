module.exports = {
    port: process.env.PORT,
    tokenSecretWord: process.env.SECRET_WORD,
    regEmail: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/g,
    regPassword: /^([.!]?\w*)*\w*([.!]?\w)+$/g,
    regUsername: /^([^_!]?[a-zA-Z0-9])+(_?[a-zA-Z0-9])+$/g,
};
