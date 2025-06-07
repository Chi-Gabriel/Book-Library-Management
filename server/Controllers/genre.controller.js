import Genre from "../Models/genre.model.js"
import Book from "../Models/book.model.js"

export const getAllGenres = async (req, res) => {
    try {
        const genresWithBookCount = await Genre.aggregate([
            {
                $lookup: {
                    from: Book.collection.name,
                    localField: "_id",
                    foreignField: "genre",
                    as: "books"
                }
            },
            {
                $addFields: {
                    bookCount: { $size: "$books" }
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
        ]);

        res.status(200).json(genresWithBookCount);
    } catch (error) {
        res.status(500).json({ error: "Internal server error fetching genres" });
        console.log(`Error in getAllGenres controller: ${error.message}`);
    }
};

export const createGenre = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Genre name is required" });
        }

        const genre = new Genre({
            name,
            description
        });

        await genre.save();
        res.status(201).json(genre);

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ error: `Genre with name '${req.body.name}' already exists.` });
        }
        res.status(500).json({ error: "Internal server error creating genre" });
        console.log(`Error in createGenre controller: ${error.message}`);
    }
};

export const getGenreById = async (req, res) => {
    try {
        const genreId = req.params.id;
        const genre = await Genre.findById(genreId);

        if (!genre) {
            return res.status(404).json({ error: "Genre not found" });
        }

        const bookCount = await Book.countDocuments({ genre: genreId });

        res.status(200).json({ ...genre.toObject(), bookCount: bookCount });

    } catch (error) {
        res.status(500).json({ error: "Internal server error fetching genre by ID" });
        console.log(`Error in getGenreById controller: ${error.message}`);
    }
};

export const updateGenre = async (req, res) => {
    try {
        const { name, description } = req.body;
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;

        const genre = await Genre.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!genre) {
            return res.status(404).json({ error: "Genre not found" });
        }
        res.status(200).json(genre);

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ error: `Genre with name '${req.body.name}' already exists.` });
        }
        res.status(500).json({ error: "Internal server error updating genre" });
        console.log(`Error in updateGenre controller: ${error.message}`);
    }
};

export const deleteGenre = async (req, res) => {
    try {
        const genreId = req.params.id;

        const booksInGenre = await Book.countDocuments({ genre: genreId });
        if (booksInGenre > 0) {
            return res.status(400).json({ error: `Cannot delete genre. Genre has ${booksInGenre} associated book(s). Please reassign or delete them first.` });
        }

        const genre = await Genre.findByIdAndDelete(genreId);
        if (!genre) {
            return res.status(404).json({ error: "Genre not found" });
        }
        res.status(200).json({ message: "Genre deleted successfully" });

    } catch (error) {
        res.status(500).json({ error: "Internal server error deleting genre" });
        console.log(`Error in deleteGenre controller: ${error.message}`);
    }
};