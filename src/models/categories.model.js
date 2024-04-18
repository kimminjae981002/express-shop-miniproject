const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
    }
})

const category = mongoose.model("Category",categorySchema) 

module.exports = category;