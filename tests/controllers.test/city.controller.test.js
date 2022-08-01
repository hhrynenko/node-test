const request = require('supertest');
const app = require('../../app');
const { addSomeCitiesToDb, clearCitiesFromDb } = require('../utils/dbController');

let idsOfTempCities;
const citiesToAdd = [
    { cityName: 'New-York', averageGrade: 7 },
    { cityName: 'Chicago', averageGrade: 5 },
    { cityName: 'Milwaukee', averageGrade: 4 },
    { cityName: 'London', averageGrade: 6 },
    { cityName: 'Manchester', averageGrade: 1 },
    { cityName: 'Dublin', averageGrade: 3 },
    { cityName: 'Liverpool', averageGrade: 0 },
];

beforeEach(async () => {
    idsOfTempCities = await addSomeCitiesToDb(citiesToAdd);
});
afterEach(async () => clearCitiesFromDb(idsOfTempCities));

describe('getCitiesList tests.', () => {
    test('Must return cities list and check added earlier cities is in.', async () => {
        const lim = 3;
        const page = 1;
        const forTotalPages = await request(app).get(`/api/cities?page=${page}&limit=${lim}`);
        const citiesCount = forTotalPages.body.cities.count;
        const responseRes = await request(app).get(`/api/cities?page=${page}&limit=${citiesCount}`);
        const cityInResponse = responseRes.body.cities.rows
            .filter((city) => city.id === idsOfTempCities[0] && city);
        expect(cityInResponse).not.toBeUndefined();
        expect({
            cityName: cityInResponse[0].cityName,
            averageGrade: cityInResponse[0].averageGrade,
        }).toMatchObject(citiesToAdd[0]);
        expect(responseRes.statusCode).toBe(200);
    });

    test('Must return page error', async () => {
        const lim = 4;
        const page = 60600;
        const response = await request(app).get(`/api/cities?page=${page}&limit=${lim}`);
        expect(response.body).toMatchObject({
            error: 'No page.',
        });
        expect(response.statusCode).not.toBe(200);
    });

    test('Must return page value error', async () => {
        const lim = 4;
        const page = -1;
        const response = await request(app).get(`/api/cities?page=${page}&limit=${lim}`);
        expect(response.body).toMatchObject({
            error: 'Page or limit variables is incorrect. Example: ?page=1&limit=4',
        });
        expect(response.statusCode).not.toBe(200);
    });

    test('Must return page value error', async () => {
        const lim = -1;
        const page = 3;
        const response = await request(app).get(`/api/cities?page=${page}&limit=${lim}`);
        expect(response.body).toMatchObject({
            error: 'Page or limit variables is incorrect. Example: ?page=1&limit=4',
        });
        expect(response.statusCode).not.toBe(200);
    });

    test('Must return error about incorrect page or limit', async () => {
        const page = 3;
        const response = await request(app).get(`/api/cities?page=${page}`);
        expect(response.body).toMatchObject({
            error: 'Page or limit variables is incorrect. Example: ?page=1&limit=4',
        });
        expect(response.statusCode).not.toBe(200);
    });

    test('Must return error about incorrect page or limit', async () => {
        const lim = 3;
        const response = await request(app).get(`/api/cities?limit=${lim}`);
        expect(response.body).toMatchObject({
            error: 'Page or limit variables is incorrect. Example: ?page=1&limit=4',
        });
        expect(response.statusCode).not.toBe(200);
    });
});

describe('getCommentsByCities tests.', () => {
    test('Must return all comments by cities', async () => {
        const response = await request(app).get(`/api/cities/${idsOfTempCities}/comments`);
        const idsFromResponse = response.body.map((city) => city.city.id);
        idsOfTempCities.map((id) => expect(idsFromResponse).toContain(id));
        expect(response.statusCode).toBe(200);
    });

    test('Must return error about wrong id input', async () => {
        const ids = '1,3;6';
        const response = await request(app).get(`/api/cities/${ids}/comments`);
        expect(response.body).toMatchObject({
            error: 'Wrong ids input.',
        });
        expect(response.statusCode).not.toBe(200);
    });

    test('Must return error about unavailable city', async () => {
        const ids = '35435345';
        const response = await request(app).get(`/api/cities/${ids}/comments`);
        expect(response.body).toMatchObject({
            error: 'Unable to find cities from DB or id is not find.',
        });
        expect(response.statusCode).not.toBe(200);
    });
});