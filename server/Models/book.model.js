import mongoose from "mongoose"

const BookSchema = new mongoose.Schema({
    title: String,
    author: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Author"
    },
    ISBN: String,
    genre: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Genre"
    }, 
    publicationYear: Number,
    availability: {type: Boolean, default: true}
})

const Book = mongoose.model("Book", BookSchema)

export default Book