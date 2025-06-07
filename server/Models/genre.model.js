import mongoose from "mongoose"

const GenreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String
},  {timestamps: true})

const Genre = mongoose.model("Genre", GenreSchema)
export default Genre