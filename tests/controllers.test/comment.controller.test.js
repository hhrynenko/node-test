const request = require('supertest');
const {
 addSomeCitiesToDb, clearCitiesFromDb, addComments, addTestUser, deleteUserAndRoles,
} = require('../utils/dbController');
const app = require('../../app');

let idsOfTempCities;
let queryDataOfComments;
const citiesToAdd = [
    { cityName: 'Arciz', averageGrade: 7 },
    { cityName: 'Izyum', averageGrade: 5 },
    { cityName: 'Oleshki', averageGrade: 4 },
    { cityName: 'Kharkiv', averageGrade: 6 },
    { cityName: 'Tokio', averageGrade: 1 },
    { cityName: 'Seoul', averageGrade: 3 },
    { cityName: 'Kowloon', averageGrade: 0 },
];
const gradesOfComments = [3, 6, 8, 10, 2];
const userData = {
    email: 'email_comm@ukr.com',
    username: 'user_comm',
    password: 'password',
    role: 'ADMIN',
};
let itemsToDel;
let token;

beforeEach(async () => {
    itemsToDel = await addTestUser(userData);
    token = await request(app)
        .post('/api/login')
        .send({
            email: userData.email,
            password: userData.password,
        });
    token = `Bearer ${token.body.token}`;
    idsOfTempCities = await addSomeCitiesToDb(citiesToAdd);
    queryDataOfComments = await addComments(idsOfTempCities, gradesOfComments);
});
afterEach(async () => {
    await clearCitiesFromDb(idsOfTempCities);
    await deleteUserAndRoles(itemsToDel);
});

describe('getByCity', () => {
    test('Must return the list of cities and one of added earlier must be there', async () => {
        const limit = 3;
        const page = 1;
        const arrayIndexOfCity = 0;
        const { cityName } = citiesToAdd[arrayIndexOfCity];
        const lastPage = await request(app)
            .get(`/api/comments/city?limit=${limit}&page=${page}&cityName=${cityName}`)
            .set('authorization', token);
        const response = await request(app)
            .get(`/api/comments/city?limit=${limit}&page=${lastPage.body.main.totalPages}&cityName=${cityName}`)
            .set('authorization', token);
        const bodyMain = response.body.main;
        const queryCommsId = queryDataOfComments
            .map((data) => data.dataValues.cityId
                === idsOfTempCities[arrayIndexOfCity] && data.dataValues.id)
                .reduce((max, id) => (id > max ? id : max), 0);
        expect(bodyMain.comments.rows[bodyMain.comments.rows.length - 1].id).toBe(queryCommsId);
        expect(response.statusCode).toBe(203);
    });

    test('Must return error about query cityName emptiness', async () => {
        const limit = 3;
        const page = 1;
        const response = await request(app)
            .get(`/api/comments/city?limit=${limit}&page=${page}`)
            .set('authorization', token);
        expect(response.body).toMatchObject({
            error: 'No city name.',
        });
        expect(response.statusCode).not.toBe(200);
    });

    test('Must return error about incorrect query values', async () => {
        const limit = 3;
        const { cityName } = citiesToAdd[0];
        const response = await request(app)
            .get(`/api/comments/city?limit=${limit}&cityName=${cityName}`)
            .set('authorization', token);
        expect(response.body).toMatchObject({
            error: 'Page or limit variables is incorrect. Example: ?page=1&limit=4',
        });
        expect(response.statusCode).not.toBe(200);
    });

    test('Must return error about unavailable city', async () => {
        const limit = 3;
        const page = 1;
        const cityName = 'que?';
        const response = await request(app)
            .get(`/api/comments/city?limit=${limit}&page=${page}&cityName=${cityName}`)
            .set('authorization', token);
        expect(response.body).toMatchObject({
            error: 'Wrong city name.',
        });
        expect(response.statusCode).not.toBe(200);
    });

    test('Must return error about wrong page', async () => {
        const limit = 3;
        const page = 11212312312;
        const { cityName } = citiesToAdd[0];
        const response = await request(app)
            .get(`/api/comments/city?limit=${limit}&page=${page}&cityName=${cityName}`)
            .set('authorization', token);
        expect(response.body).toMatchObject({
            error: 'No page.',
        });
        expect(response.statusCode).not.toBe(200);
    });
});

describe('addComment', () => {
    test('Must recalculate averageGrade and return it in body with success message.', async () => {
        const query = {
            cityName: citiesToAdd[0].cityName,
            commentText: 'Golubi i Khreshyatik',
            commentGrade: 5,
        };
        const response = await request(app)
            .post('/api/comment')
            .send(query)
            .set('authorization', token);
        expect(response.body).toMatchObject({
            message: 'Successfully added new comment.',
        });
        const arrayForAverageCalc = [...gradesOfComments, query.commentGrade];
        const newAverage = arrayForAverageCalc
            .reduce((partialSum, grade) => partialSum + grade, 0);
        const resultGrade = parseFloat((newAverage / arrayForAverageCalc.length).toFixed(2));
        const numberAverageGrade = parseFloat(response.body.newAverageGrade);
        expect(numberAverageGrade).toBeCloseTo(resultGrade);
        expect(response.statusCode).toBe(200);
    });

    test('Must return error about grade value', async () => {
        const query = {
            cityName: citiesToAdd[0].cityName,
            commentText: 'Golubi i Khreshyatik',
            commentGrade: 20,
        };
        const response = await request(app)
            .post('/api/comment')
            .send(query)
            .set('authorization', token);
        expect(response.body).toMatchObject({
            error: `Entered grade is ${query.commentGrade}, but allowed is [1-10] or grade is not number.`,
        });
        expect(response.statusCode).not.toBe(200);
    });

    test('must return error about unavailable city', async () => {
        const query = {
            cityName: 'doflgnsd',
            commentText: 'Golubi i Khreshyatik',
            commentGrade: 7,
        };
        const response = await request(app)
            .post('/api/comment')
            .send(query)
            .set('authorization', token);
        expect(response.body).toMatchObject({
            error: `There are no ${query.cityName} in list. For full list see: /api/cities/`,
        });
        expect(response.statusCode).not.toBe(200);
    });

    test('must return body fullness error', async () => {
        const query = {
            commentText: 'Golubi i Khreshyatik',
            commentGrade: 7,
        };
        const response = await request(app)
            .post('/api/comment')
            .send(query)
            .set('authorization', token);
        expect(response.body).toMatchObject({
            error: 'Request body is not full.',
        });
        expect(response.statusCode).not.toBe(200);
    });

    test('Must return error about token', async () => {
        const query = {
            cityName: citiesToAdd[0].cityName,
            commentText: 'Golubi i Khreshyatik',
            commentGrade: 7,
        };
        const response = await request(app)
            .post('/api/comment')
            .send(query);
        expect(response.body).toMatchObject({
            message: 'Log in please.',
        });
        expect(response.statusCode).not.toBe(200);
    });
});

describe('updateComment.', () => {
    test('Must return error about token', async () => {
        const commentId = parseInt(queryDataOfComments[0].dataValues.id, 10);
        const query = {
            commentText: 'Golubi i Khreshyatik',
            newGrade: 6,
        };
        const response = await request(app)
            .put(`/api/comment/${commentId}`)
            .send(query);
        expect(response.body).toMatchObject({
            message: 'Log in please.',
        });
        expect(response.statusCode).not.toBe(200);
    });
    describe('without new Grade', () => {
        test('must return newComment text and change it', async () => {
            const commentId = queryDataOfComments[0].dataValues.id;
            const query = {
                commentText: 'Golubi i Khreshyatik1',
            };
            const response = await request(app)
                .put(`/api/comment/${commentId}`)
                .set('authorization', token)
                .send(query);
            expect(response.body).toMatchObject({
                message: `Successfully updated comment #${commentId}`,
                newCommentText: query.commentText,
            });
            expect(response.statusCode).toBe(200);
        });

        test('must return an ID error', async () => {
            const query = {
                commentText: 'Golubi i Khreshyatik',
            };
            const response = await request(app)
                .put('/api/comment/124233453')
                .set('authorization', token)
                .send(query);
            expect(response.body).toMatchObject({
                error: 'Id is not found in DB',
            });
            expect(response.statusCode).not.toBe(200);
        });

        test('must return empty body error', async () => {
            const commentId = queryDataOfComments[0].dataValues.id;
            const query = {
                cr: '123',
            };
            const response = await request(app)
                .put(`/api/comment/${commentId}`)
                .set('authorization', token)
                .send(query);
            expect(response.body).toMatchObject({
                error: 'Request body is empty.',
            });
            expect(response.statusCode).not.toBe(200);
        });
    });

    describe('With new Grade', () => {
        test('must change average grade and return new value', async () => {
            const commentId = parseInt(queryDataOfComments[0].dataValues.id, 10);
            const query = {
                commentText: 'Golubi i Khreshyatik',
                newGrade: 5,
            };
            const response = await request(app)
                .put(`/api/comment/${commentId}`)
                .set('authorization', token)
                .send(query);
            const arrayForAverageCalc = gradesOfComments.slice();
            arrayForAverageCalc[0] = parseInt(query.newGrade, 10);
            const newAverage = arrayForAverageCalc
                .reduce((partialSum, grade) => partialSum + grade, 0);
            const resultGrade = parseFloat((newAverage / arrayForAverageCalc.length).toFixed(2));
            const numberAverageGrade = parseFloat(response.body.newAverageGrade);
            expect(numberAverageGrade).toBeCloseTo(resultGrade);
            expect(response.body).toMatchObject({
                message: `Successfully updated comment and grade #${commentId}`,
                newAverageGrade: numberAverageGrade.toFixed(2),
            });
            expect(response.statusCode).toBe(200);
        });

        test('must return an error about value', async () => {
            const commentId = parseInt(queryDataOfComments[0].dataValues.id, 10);
            const query = {
                commentText: 'Golubi i Khreshyatik',
                newGrade: 145,
            };
            const response = await request(app)
                .put(`/api/comment/${commentId}`)
                .set('authorization', token)
                .send(query);
            expect(response.body).toMatchObject({
                error: 'newGrade have problems. Number from 1 to 10 is allowed.',
            });
            expect(response.statusCode).not.toBe(200);
        });

        test('must return an error about value', async () => {
            const commentId = parseInt(queryDataOfComments[0].dataValues.id, 10);
            const query = {
                commentText: 'Golubi i Khreshyatik',
                newGrade: -12,
            };
            const response = await request(app)
                .put(`/api/comment/${commentId}`)
                .set('authorization', token)
                .send(query);
            expect(response.body).toMatchObject({
                error: 'newGrade have problems. Number from 1 to 10 is allowed.',
            });
            expect(response.statusCode).not.toBe(200);
        });

        test('newGrade is string', async () => {
            const commentId = parseInt(queryDataOfComments[0].dataValues.id, 10);
            const query = {
                commentText: 'Golubi i Khreshyatik',
                newGrade: 'sdfsf',
            };
            const response = await request(app)
                .put(`/api/comment/${commentId}`)
                .set('authorization', token)
                .send(query);
            expect(response.body).toMatchObject({
                error: 'newGrade have problems. Number from 1 to 10 is allowed.',
            });
            expect(response.statusCode).not.toBe(200);
        });
    });
});
