var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true})

const commentSchema = new mongoose.Schema({
    text: String,
    author: String
})

module.exports = mongoose.model("Comment", commentSchema)