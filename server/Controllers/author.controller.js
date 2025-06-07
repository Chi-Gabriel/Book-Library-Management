import Author from "../Models/author.model.js"
import Book from "../Models/book.model.js"

export const getAllAuthors = async(req, res) => {
    try {
        const authorsWithBookCount = await Author.aggregate([
            {
                $lookup: {
                    from: Book.collection.name,
                    localField: "_id",
                    foreignField: "author",
                    as: "books"
                }
            },
            {
                $addFields: {
                    numberOfBooks: { $size: "$books" }
                }
            },
            {
                $project: {
                    books: 0
                }
            },
            {
                $sort: { name: 1 }
            }
        ])

        res.status(200).json(authorsWithBookCount)
    } catch (error) {
        res.status(500).json({ error: "Internal server error fetching authors" })
        console.log(`Error in getAllAuthors controller: ${error.message}`)
    }
}

export const createAuthor = async (req, res) => {
    try {
        const { name, bio } = req.body

        if (!name) {
            return res.status(400).json({ error: "Author name is required" })
        }

        const author = new Author({
            name,
            bio
        })

        await author.save()
        res.status(201).json(author)

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ error: `Author with name '${req.body.name}' already exists.` })
        }
        res.status(500).json({ error: "Internal server error creating author" })
        console.log(`Error in createAuthor controller: ${error.message}`)
    }
}

export const getAuthorById = async (req, res) => {
    try {
        const authorId = req.params.id
        const author = await Author.findById(authorId)

        if (!author) {
            return res.status(404).json({ error: "Author not found" })
        }

        const bookCount = await Book.countDocuments({ author: authorId })
        res.status(200).json({ ...author.toObject(), numberOfBooks: bookCount })

    } catch (error) {
        res.status(500).json({ error: "Internal server error fetching author by ID" })
        console.log(`Error in getAuthorById controller: ${error.message}`)
    }
}

export const updateAuthor = async (req, res) => {
    try {
        const { name, bio } = req.body
        const updateData = {}
        if (name !== undefined) updateData.name = name
        if (bio !== undefined) updateData.bio = bio

        const author = await Author.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })

        if (!author) {
            return res.status(404).json({ error: "Author not found" })
        }
        res.status(200).json(author)

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ error: `Author with name '${req.body.name}' already exists.` })
        }
        res.status(500).json({ error: "Internal server error updating author" })
        console.log(`Error in updateAuthor controller: ${error.message}`)
    }
}

export const deleteAuthor = async (req, res) => {
    try {
        const authorId = req.params.id
        const booksByAuthor = await Book.countDocuments({ author: authorId })
        
        if (booksByAuthor > 0) {
            return res.status(400).json({ error: `Cannot delete author. Author has ${booksByAuthor} associated book(s). Please reassign or delete them first.` })
        }

        const author = await Author.findByIdAndDelete(authorId)
        if (!author) {
            return res.status(404).json({ error: "Author not found" })
        }
        res.status(200).json({ message: "Author deleted successfully" })

    } catch (error) {
        res.status(500).json({ error: "Internal server error deleting author" })
        console.log(`Error in deleteAuthor controller: ${error.message}`)
    }
}
