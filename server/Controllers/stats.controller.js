import Book from "../Models/book.model.js";
import Author from "../Models/author.model.js";
import Genre from "../Models/genre.model.js";

export const getAppStatistics = async (req, res) => {
    try {
        const totalBooks = await Book.countDocuments();
        const availableBooks = await Book.countDocuments({ availability: true });
        const totalAuthors = await Author.countDocuments();
        const totalGenres = await Genre.countDocuments();

        res.status(200).json({
            totalBooks,
            availableBooks,
            totalAuthors,
            totalGenres,
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error fetching statistics" });
        console.log(`Error in getAppStatistics controller: ${error.message}`);
    }
};