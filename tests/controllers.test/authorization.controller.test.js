const request = require('supertest');
const app = require('../../app');
const db = require('../../db/models');
const { addTestUser, deleteUserAndRoles } = require('../utils/dbController');

const User = db.user;
const Role = db.role;

const userData = {
    email: 'email@ukr.com',
    username: 'user_name',
    password: 'password',
    role: 'USER',
};
const userDataToReg = {
    email: 'emailreg@ukr.com',
    username: 'user_name_reg',
    password: 'password',
};

let itemsToDel;

beforeAll(async () => {
    itemsToDel = await addTestUser(userData);
});
afterAll(async () => deleteUserAndRoles(itemsToDel));

describe('Login', () => {
    test('Must login', async () => {
        const loginAttempt = await request(app)
            .post('/api/login').send({
                email: userData.email,
                password: userData.password,
            });
        const tokenToCheck = JSON
            .parse(Buffer.from(loginAttempt.body.token.split('.')[1], 'base64')
                .toString());
        expect(tokenToCheck.id).toBe(itemsToDel[0]);
        expect(loginAttempt.statusCode).toBe(200);
    });
    test('Must send message about wrong password', async () => {
        const loginAttempt = await request(app).post('/api/login').send({
            email: userData.email,
            password: 'pas1313sword123',
        });
        expect(loginAttempt.body).toMatchObject({
            error: 'Password is incorrect.',
        });
        expect(loginAttempt.statusCode).not.toBe(200);
    });
    test('Must send error about wrong email', async () => {
        const loginAttempt = await request(app).post('/api/login').send({
            email: 'email2000@ukr.net',
            password: userData.password,
        });
        expect(loginAttempt.body).toMatchObject({
            error: 'User with this email doesn\'t exist',
        });
        expect(loginAttempt.statusCode).not.toBe(200);
    });
    test('Must send error about not full body', async () => {
        const loginAttempt = await request(app).post('/api/login').send({
            email: userData.email,
        });
        expect(loginAttempt.body).toMatchObject({
            error: 'Body is not full.',
        });
        expect(loginAttempt.statusCode).not.toBe(200);
    });
});

describe('Registration', () => {
    test('Must register user', async () => {
        const registerAttempt = await request(app)
            .post('/api/registration')
            .send({
                email: userDataToReg.email,
                password: userDataToReg.password,
                username: userDataToReg.username,
            });
        const checkInTableUser = await User.findOne({
            where: {
                username: userDataToReg.username,
            },
            include: Role,
        });
        itemsToDel.push(checkInTableUser.dataValues.id);
        expect(registerAttempt.body).toMatchObject({
            message: 'Successfully registered',
            email: userDataToReg.email,
            username: userDataToReg.username,
        });
        expect(registerAttempt.statusCode).toBe(200);
    });

    test('Must throw ane error about wrong email.', async () => {
        const registerAttempt = await request(app)
            .post('/api/registration')
            .send({
                email: 'email.email',
                password: userDataToReg.password,
                username: userDataToReg.username,
            });
        expect(registerAttempt.body).toMatchObject({
            error: 'Email is not valid.',
        });
        expect(registerAttempt.statusCode).not.toBe(200);
    });

    test('Must throw ane error about wrong username.', async () => {
        const registerAttempt = await request(app)
            .post('/api/registration')
            .send({
                email: userDataToReg.email,
                password: 'pass.word_!@f',
                username: userDataToReg.username,
            });
        expect(registerAttempt.body).toMatchObject({
            error: 'Password is not valid.',
        });
        expect(registerAttempt.statusCode).not.toBe(200);
    });

    test('Must throw ane error about wrong password.', async () => {
        const registerAttempt = await request(app)
            .post('/api/registration')
            .send({
                email: userDataToReg.email,
                password: userDataToReg.password,
                username: 'user___name!_344',
            });
        expect(registerAttempt.body).toMatchObject({
            error: 'Username is not valid.',
        });
        expect(registerAttempt.statusCode).not.toBe(200);
    });

    test('Throw an error about not full body.', async () => {
        const registerAttempt = await request(app)
            .post('/api/registration')
            .send({
                password: userDataToReg.password,
                username: userDataToReg.username,
            });
        expect(registerAttempt.body).toMatchObject({
            error: 'Body is not full.',
        });
        expect(registerAttempt.statusCode).not.toBe(200);
    });
    test('Throw an error about not full body.', async () => {
        const registerAttempt = await request(app)
            .post('/api/registration')
            .send({
                email: userDataToReg.email,
                username: userDataToReg.username,
            });
        expect(registerAttempt.body).toMatchObject({
            error: 'Body is not full.',
        });
        expect(registerAttempt.statusCode).not.toBe(200);
    });

    test('Throw an error about not full body.', async () => {
        const registerAttempt = await request(app)
            .post('/api/registration')
            .send({
                email: userDataToReg.email,
                password: userDataToReg.password,
            });
        expect(registerAttempt.body).toMatchObject({
            error: 'Body is not full.',
        });
        expect(registerAttempt.statusCode).not.toBe(200);
    });
});
