const sequelize = require('./utils/dbConfig');
const app = require('./app');

const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server running on ${PORT}`));
    } catch (err) {
        console.log(err);
    }
};

start();
