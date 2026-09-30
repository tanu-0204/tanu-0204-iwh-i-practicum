const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

const app = express();

dotenv.config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

console.log("Service Key loaded:", PRIVATE_APP_ACCESS ? "YES" : "NO");
console.log("Service Key length:", PRIVATE_APP_ACCESS ? PRIVATE_APP_ACCESS.length : 0);

const CUSTOM_OBJECT_ID = '2-269231623';


// ROUTE 1 - Homepage
app.get('/', async (req, res) => {

    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}?properties=name,species,watering_frequency`;

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {

        const response = await axios.get(url, { headers });

        const data = response.data.results;

        res.render('homepage', {
            title: 'Plants | HubSpot APIs',
            data: data
        });

    } catch (error) {

        console.error(error.response ? error.response.data : error.message);

        res.send('Error getting Plant records from HubSpot.');

    }

});


// ROUTE 2 - Form
app.get('/update-cobj', (req, res) => {

    res.render('updates', {
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    });

});


// ROUTE 3 - Create Plant
app.post('/update-cobj', async (req, res) => {

    const newPlant = {
        properties: {
            name: req.body.name,
            species: req.body.species,
            watering_frequency: req.body.watering_frequency
        }
    };

    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}`;

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {

        await axios.post(url, newPlant, { headers });

        res.redirect('/');

    } catch (error) {

        console.error(error.response ? error.response.data : error.message);

        res.send('Error creating Plant record in HubSpot.');

    }

});


// Start server
app.listen(3000, () => {
    console.log('Listening on http://localhost:3000');
});