const axios = require('axios');
const randomInt = require('random-int');
setInterval(makePostRequest, 4000);

async function makePostRequest() {
  const FridgeId = "2";
  const time = Date.now();
  const temperature = randomInt(0,5);
  console.log(temperature);
  console.log(time);
  const body = {
    FridgeId,
    time,
    temperature
  };

    let res = await axios.post('http://localhost:5000/api/fridges/temperatureData', body);    

}

async function makePostRequest2() {
  const FridgeId = "3";
  const time = Date.now();
  const temperature = randomInt(2,5);
  console.log(temperature);
  console.log(time);
  const body = {
    FridgeId,
    time,
    temperature
  };

    let res = await axios.post('http://localhost:5000/api/fridges/temperatureData', body);    

}

makePostRequest();
makePostRequest2();