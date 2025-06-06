import Book from '../Models/book.model.js'

export const getAllBooks = async (req ,res) => {
    try {
        const books = await Book.find().populate("author genre")
        res.status(200).json(books)
        
    } catch (error) {
        res.status(500).json({ error: "Internal server errors"})
        console.log(`Error occur in the book controller: ${error.message}`)
    }
}

export const createBook = async (req ,res) => {
    try {
        const {title, author, ISBN, genre,publicationYear} = req.body 

        if (!title || !author || !ISBN || !genre || !publicationYear) {
            return res.status(400).json({error: "All fields most be required"})
        }

        const book = new Book({
            title,
            author,
            ISBN,
            genre,
            publicationYear
        })
        await book.save()
        res.status(200).json(book)
        
    } catch (error) {
        res.status(500).json({ error: "Internal server errors"})
        console.log(`Error occur in the book controller: ${error.message}`)
    }
}

export const getBookById = async (req ,res) => {
    try {
        const book = await Book.findById(req.params.id).populate("author genre")
        if(!book) return res.status(404).json({ error: "Book not found" })
        res.status(200).json(book)
        
    } catch (error) {
        res.status(500).json({ error: "Internal server errors"})
        console.log(`Error occur in the book controller: ${error.message}`)
    }
}

export const updateBook = async (req ,res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if(!book) return res.status(404).json({ error: "Book not found" })
        res.status(200).json(book)
        
    } catch (error) {
        res.status(500).json({ error: "Internal server errors"})
        console.log(`Error occur in the book controller: ${error.message}`)
    }
}

export const deleteBook = async (req ,res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id)
        if(!book) return res.status(404).json({ error: "Book not found" })
        res.status(200).json({ message: "Book deleted" })
        
    } catch (error) {
        res.status(500).json({ error: "Internal server errors"})
        console.log(`Error occur in the book controller: ${error.message}`)
    }
}

export const updateAvailableBook = async (req ,res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, { availability: req.body.availability }, {new: true})
        if(!book) return res.status(404).json({ error: "Book not found" })
        res.status(200).json(book)
        
    } catch (error) {
        res.status(500).json({ error: "Internal server errors"})
        console.log(`Error occur in the book controller: ${error.message}`)
    }
}