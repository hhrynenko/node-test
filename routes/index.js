const express = require('express')
const router = express.Router()
const needle = require('needle')
const url = require('url')
const {header} = require("needle/lib/auth");

const API_BASE_URL = process.env.API_REF
const API_KEY = process.env.API_KEY
const API_NAME = process.env.API_NAME
const CITY_API_REF = process.env.CITY_API_REF
const CITY_API_KEY = process.env.CITY_API_KEY
const CITY_API_NAME = process.env.CITY_API_NAME

router.get('/', async (req,res) => {
    try {
        const params = new URLSearchParams({
            [API_NAME]: API_KEY,
            ...url.parse(req.url,true).query
        })
        const apiRes = await needle('get', `${API_BASE_URL}?${params}&lang=ua&units=metric`)
        const data = apiRes.body
        res.status(200).json(data)
    }catch (er){
        res.status(500).json(er)
    }
})

router.get('/getInfo', async (req,res) => {
    try {
        const params = new URLSearchParams({
            [API_NAME]: API_KEY,
            ...url.parse(req.url,true).query
        })
        const tempAPI = await needle('get', `${API_BASE_URL}?${params}&lang=ua&units=metric`)
        const populationAPI = await needle('get', `${CITY_API_REF}?name=${params.get('q')}`, {headers: {"X-Api-Key": CITY_API_KEY}})
        const data = [{
            "cityName" : populationAPI.body[0]['name'],
            "temperature" : tempAPI.body["main"]["temp"],
            'population': populationAPI.body[0]["population"]
        }]
        res.status(200).json(data)
    }
    catch (er){
        res.status(500).json(er)
    }
})

module.exports = router