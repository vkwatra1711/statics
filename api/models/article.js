const mongoose = require('mongoose');
module.exports = mongoose.model('article', new mongoose.Schema({
 id:String,
 storeId:String,
 ArticleId: String,
 ArticlePrice: String,
 Articlelocation: String
}));