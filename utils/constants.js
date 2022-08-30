module.exports = {
    port: process.env.PORT,
    tokenSecretWord: process.env.SECRET_WORD,
    regEmail: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/g,
    regPassword: /^([.!]?\w*)*\w*([.!]?\w)+$/g,
    regUsername: /^([^_!]?[a-zA-Z0-9])+(_?[a-zA-Z0-9])+$/g,
    regUidV4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/gi,
};
