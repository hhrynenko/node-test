const { sequelize } = require('./db/models');
const app = require('./app');

const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        await sequelize.sync();
        await sequelize.authenticate();
        app.listen(PORT, () => console.log(`Server running on ${PORT}`));
    } catch (err) {
        console.log(err);
    }
};

start();
