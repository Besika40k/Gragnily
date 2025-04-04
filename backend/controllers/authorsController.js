const asyncHandler = require('express-async-handler');
const author = require("../models/author");



const getAuthors = asyncHandler(async (req,res) => {
    const authors = await author.find();
    res.json({authors});
})

const createAuthor = asyncHandler(async (req, res) => {
    const {name, birth_year, nationality} = req.body;
    if(!name) {
        res.status(400).json({comment: "name can't be empty"}); 
        
    }
    else{
        try {
            await author.create({name, birth_year, nationality})
            res.status(200).json({comment : "successful"})
        } catch (error) {
            console.log(error)
        }
    }
})

const getAuthor = asyncHandler(async (req,res) => {
    const authors = await author.find({name: req.params.id});
    if(!authors){
        res.status(404).json({comment: " Author Not Found"})
    }
    else {
        res.status(200).json({authors})
    }
})


module.exports = {
    getAuthors,
    createAuthor,
    getAuthor
}
