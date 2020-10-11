const mqtt = require('mqtt');
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const Device = require('./models/device');
const randomCoordinates = require('random-coordinates');
const rand = require('random-int');
mongoose.connect("mongodb+srv://Vansh:Naman1703@cluster0.zdswl.mongodb.net", { useNewUrlParser: true, useUnifiedTopology: true });


const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5001;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('public'));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith, Content-Type, Accept");
    next();
});
app.use(express.static(`${__dirname}/public/generated-docs`));
app.get('/docs', (req, res) => {
    res.sendFile(`${__dirname}/public/generated-docs/index.html`);
});
/** 
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");
client.on('connect', () => {
    client.subscribe('/sensorData');
    console.log('mqtt connected');
});*/

app.post('/send-command', (req, res) => {
    const { driverId, command } = req.body;
    const topic = `/218586105/command/${driverId}`;
    client.publish(topic, command, () => {
        res.send('published new message');
    });
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});