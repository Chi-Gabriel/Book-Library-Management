import Book from '../Models/book.model.js';
import Author from '../Models/author.model.js'; // Needed for author name search if we go that deep

export const getAllBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { search, authorId, genreId, availability, sortBy, sortOrder } = req.query;

        let query = {};

        if (search) {
            const searchRegex = new RegExp(search, 'i'); 
            query.$or = [
                { title: searchRegex },
                { ISBN: searchRegex },
                { 'author.name': searchRegex },
                { 'genre.name': searchRegex }
            ];
        }

        if (authorId) {
            query.author = authorId;
        }

        if (genreId) {
            query.genre = genreId;
        }

        if (availability !== undefined) {
            query.availability = availability === 'true'; 
        }

        let sortOptions = {};
        if (sortBy) {
            sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
        } else {
            sortOptions.createdAt = -1; // Default sort by newest
        }

        const books = await Book.find(query)
            .populate("author", "name") 
            .populate("genre", "name")  
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        const totalBooks = await Book.countDocuments(query);
        const totalPages = Math.ceil(totalBooks / limit);

        res.status(200).json({
            books,
            currentPage: page,
            totalPages,
            totalBooks,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        });

    } catch (error) {
        res.status(500).json({ error: "Internal server error fetching books" });
        console.log(`Error in getAllBooks controller: ${error.message}`);
    }
};

export const createBook = async (req ,res) => {
    try {
        const {title, author, ISBN, genre, publicationYear, description, availability } = req.body;

        if (!title || !author || !ISBN || !genre || !publicationYear) {
            return res.status(400).json({error: "Title, author, ISBN, genre, and publicationYear are required"});
        }

        const book = new Book({
            title,
            author,
            ISBN,
            genre,
            publicationYear,
            description, 
            availability: availability !== undefined ? availability : true 
        });
        await book.save();
        const populatedBook = await Book.findById(book._id).populate("author", "name").populate("genre", "name");
        res.status(201).json(populatedBook); 

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ error: `Book with ISBN '${req.body.ISBN}' already exists.` });
        }
        res.status(500).json({ error: "Internal server error creating book" });
        console.log(`Error in createBook controller: ${error.message}`);
    }
};

export const getBookById = async (req ,res) => {
    try {
        const book = await Book.findById(req.params.id)
            .populate("author", "name bio") 
            .populate("genre", "name description"); 

        if(!book) return res.status(404).json({ error: "Book not found" });
        res.status(200).json(book);

    } catch (error) {
        res.status(500).json({ error: "Internal server error fetching book by ID" });
        console.log(`Error in getBookById controller: ${error.message}`);
    }
};


export const updateBook = async (req ,res) => {
    try {
        const { title, author, ISBN, genre, publicationYear, description, availability } = req.body;
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (author !== undefined) updateData.author = author;
        if (ISBN !== undefined) updateData.ISBN = ISBN; 
        if (genre !== undefined) updateData.genre = genre;
        if (publicationYear !== undefined) updateData.publicationYear = publicationYear;
        if (description !== undefined) updateData.description = description;
        if (availability !== undefined) updateData.availability = availability;


        const book = await Book.findByIdAndUpdate(req.params.id, updateData, {new: true, runValidators: true})
            .populate("author", "name")
            .populate("genre", "name");

        if(!book) return res.status(404).json({ error: "Book not found" });
        res.status(200).json(book);

    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(409).json({ error: `Book with this ${field} '${error.keyValue[field]}' already exists.` });
        }
        res.status(500).json({ error: "Internal server error updating book" });
        console.log(`Error in updateBook controller: ${error.message}`);
    }
};

export const deleteBook = async (req ,res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if(!book) return res.status(404).json({ error: "Book not found" });
        res.status(200).json({ message: "Book deleted" });

    } catch (error) {
        res.status(500).json({ error: "Internal server error deleting book" });
        console.log(`Error in deleteBook controller: ${error.message}`);
    }
};

export const updateAvailableBook = async (req ,res) => {
    try {
        const { availability } = req.body;
        if (availability === undefined) {
            return res.status(400).json({ error: "Availability field is required" });
        }

        const book = await Book.findByIdAndUpdate(req.params.id, { availability }, {new: true, runValidators: true})
            .populate("author", "name")
            .populate("genre", "name");

        if(!book) return res.status(404).json({ error: "Book not found" });
        res.status(200).json(book);

    } catch (error) {
        res.status(500).json({ error: "Internal server error updating book availability" });
        console.log(`Error in updateAvailableBook controller: ${error.message}`);
    }
};