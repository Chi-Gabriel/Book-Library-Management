import Author from "../Models/author.model.js"

export const getAllAuthors = async(req, res) => {
    try {
        const authors = await Author.find()
        res.status(200).json(authors)
    } catch (error) {
        res.status(500).json({ error: "Internal server errors"})
        console.log(`Error occur in the author controller: ${error.message}`)
    }
}

export const createAuthor = async (req, res) => {
    try {
        const { name, bio } = req.body

        if(!name || !bio) return res.status(400).json( {error: "All field most be required"})

        const author = new Author({
            name,
            bio
        })

        await author.save()
        res.status(200).json(author)

    } catch (error) {
        res.status(500).json({ error: "Internal server errors"})
        console.log(`Error occur in the author controller: ${error.message}`)
    }
}


export const getAuthorById = async (req ,res) => {
    try {
        const author = await Author.findById(req.params.id)
        if(!author) return res.status(404).json({ error: "Author not found" })
        res.status(200).json(author)
        
    } catch (error) {
        res.status(500).json({ error: "Internal server errors"})
        console.log(`Error occur in the author controller: ${error.message}`)
    }
}

export const updateAuthor = async (req ,res) => {
    try {
        const author = await Author.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if(!author) return res.status(404).json({ error: "Author not found" })
        res.status(200).json(author)
        
    } catch (error) {
        res.status(500).json({ error: "Internal server errors"})
        console.log(`Error occur in the author controller: ${error.message}`)
    }
}

export const deleteAuthor = async (req ,res) => {
    try {
        const author = await Author.findByIdAndDelete(req.params.id)
        if(!author) return res.status(404).json({ error: "Author not found" })
        res.status(200).json({ message: "Author deleted" })
        
    } catch (error) {
        res.status(500).json({ error: "Internal server errors"})
        console.log(`Error occur in the author controller: ${error.message}`)
    }
}
