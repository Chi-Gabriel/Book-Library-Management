import Genre from "../Models/genre.model.js"

export const getAllGenres = async(req, res) => {
    try {
        const genres = await Genre.find()
        res.status(200).json(genres)
    } catch (error) {
        res.status(500).json({ error: "Internal server errors"})
        console.log(`Error occur in the Genre controller: ${error.message}`)
    }
}

export const createGenre = async (req, res) => {
    try {
        const { name, description } = req.body

        if(!name || !description) return res.status(400).json( {error: "All field most be required"})

        const genre = new Genre({
            name,
            description
        })

        await genre.save()
        res.status(200).json(genre)

    } catch (error) {
        res.status(500).json({ error: "Internal server errors"})
        console.log(`Error occur in the genre controller: ${error.message}`)
    }
}


export const getGenreById = async (req ,res) => {
    try {
        const genre = await Genre.findById(req.params.id)
        if(!author) return res.status(404).json({ error: "Genre not found" })
        res.status(200).json(genre)
        
    } catch (error) {
        res.status(500).json({ error: "Internal server errors"})
        console.log(`Error occur in the Genre controller: ${error.message}`)
    }
}

export const updateGenre = async (req ,res) => {
    try {
        const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if(!author) return res.status(404).json({ error: "Genre not found" })
        res.status(200).json(genre)
        
    } catch (error) {
        res.status(500).json({ error: "Internal server errors"})
        console.log(`Error occur in the Genre controller: ${error.message}`)
    }
}

export const deleteGenre = async (req ,res) => {
    try {
        const { id } = req.params
        const genre = await Genre.findById(id)
        if(!genre) return res.status(404).json({ error: "Genre not found" })

        await Genre.findByIdAndDelete(id)
        res.status(200).json({ message: "Genre deleted" })
        
    } catch (error) {
        res.status(500).json({ error: "Internal server errors"})
        console.log(`Error occur in the Genre controller: ${error.message}`)
    }
}