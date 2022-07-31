const request = require('supertest');
const app = require('../../app');
const { addSomeCitiesToDb, clearCitiesFromDb } = require('../dbFuncs/dbFillsAndCleans');

let idsOfTempCities;
const citiesToAdd = [
    { cityName: 'NewHampshire', averageGrade: 7 },
    { cityName: 'Kiel', averageGrade: 5 },
    { cityName: 'Rava', averageGrade: 4 },
    { cityName: 'Birmingham', averageGrade: 6 },
    { cityName: 'Pryluki', averageGrade: 1 },
    { cityName: 'Piryatyn', averageGrade: 3 },
    { cityName: 'Milan', averageGrade: 0 },
];

beforeEach(async () => {
    idsOfTempCities = await addSomeCitiesToDb(citiesToAdd);
    return idsOfTempCities;
});
afterEach(async () => clearCitiesFromDb(idsOfTempCities));

describe('getTopCities', () => {
    test('Must return top of cities', async () => {
        const limit = 3;
        const response = await request(app).get(`/api/ratings/top?lim=${limit}`);
        response.body.map((city) => expect(city.averageGrade)
            .toBeGreaterThanOrEqual(response.body.indexOf(city) + 1));
        expect(response.statusCode).toBe(200);
    });

    test('Must return error about query emptiness', async () => {
        const limit = '';
        const response = await request(app).get(`/api/ratings/top?lim=${limit}`);
        expect(response.body).toMatchObject({
            error: 'Address query is empty.',
        });
        expect(response.statusCode).not.toBe(200);
    });

    test('Must return error about below zero limit', async () => {
        const limit = -4;
        const response = await request(app).get(`/api/ratings/top?lim=${limit}`);
        expect(response.body).toMatchObject({
            error: 'Limit is not correct ([1-...]])',
        });
        expect(response.statusCode).not.toBe(200);
    });
    test('Must return error about limit type', async () => {
        const limit = 'questions?';
        const response = await request(app).get(`/api/ratings/top?lim=${limit}`);
        expect(response.body).toMatchObject({
            error: 'Limit is not correct ([1-...]])',
        });
        expect(response.statusCode).not.toBe(200);
    });
});
