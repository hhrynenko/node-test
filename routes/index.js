const express = require('express');
const needle = require('needle');
const url = require('url');
const router = express.Router();
const constants = require('../utils/constants')

function createData(tempRes, popuRes) {
    return {
        cityName: popuRes.body[0].name,
        temperature: tempRes.body.main.temp,
        population: popuRes.body[0].population,
    };
}

router.get('/getInfo', async (req, res) => {
    try {
        const {q} = url.parse(req.url, true).query
        const temperatureRes = await needle('get', `${constants.WEATHER_BASE_URL}?q=${q}&appid=${constants.WEATHER_API_KEY}&lang=ua&units=metric`);
        const populationRes = await needle('get', `${constants.CITY_API_REF}?name=${q}`, { headers: { 'X-Api-Key': constants.CITY_API_KEY } });
        res.status(200).json(createData(temperatureRes,populationRes));
        return res;
        }
    catch (err) {
        res.status(500).json(err);
        return res;
    }
});

router.post('/getInfoPost', async (req, res) => {
    try {
        const body = req.body;
        const temperatureRes = await needle('get', `${constants.WEATHER_BASE_URL}?q=${body.q}&appid=${constants.WEATHER_API_KEY}&lang=ua&units=metric`);
        const populationRes = await needle('get', `${constants.CITY_API_REF}?name=${body.q}`, { headers: { 'X-Api-Key': constants.CITY_API_KEY } });
        res.status(200).json(createData(temperatureRes,populationRes));
        return res;
    }
    catch (err) {
        res.status(500).json(err);
        return res;
    }
});

router.delete('/getInfoDelete/:q', async (req,res) => {
    try {
        const q = req.params.q;
        const temperatureRes = await needle('get', `${constants.WEATHER_BASE_URL}?q=${q}&appid=${constants.WEATHER_API_KEY}&lang=ua&units=metric`);
        const populationRes = await needle('get', `${constants.CITY_API_REF}?name=${q}`, { headers: { 'X-Api-Key': constants.CITY_API_KEY } });
        res.status(200).json(createData(temperatureRes,populationRes));
        return res;
    }
    catch (err) {
        res.status(500).json(err);
        return res;
    }
});

router.put('/getInfoPut/:q', async (req,res) => {
    try {
        const q = req.params.q;
        const temperatureRes = await needle('get', `${constants.WEATHER_BASE_URL}?q=${q}&appid=${constants.WEATHER_API_KEY}&lang=ua&units=metric`);
        const populationRes = await needle('get', `${constants.CITY_API_REF}?name=${q}`, { headers: { 'X-Api-Key': constants.CITY_API_KEY } });
        res.status(200).json(createData(temperatureRes,populationRes));
        return res;
    }
    catch (err) {
        res.status(500).json(err);
        return res;
    }
});

module.exports = router;
