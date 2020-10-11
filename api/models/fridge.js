const mongoose = require('mongoose');
module.exports = mongoose.model('fridge', new mongoose.Schema({
 id:String,
 storeId:String,
 FridgeId: String,
 Fridgename: String,
 temperatureData: Array
}));