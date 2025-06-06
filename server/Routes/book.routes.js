import express from "express"
import { getAllBooks, createBook, getBookById, updateBook, deleteBook, updateAvailableBook } from "../Controllers/book.controller.js"

const router = express.Router()

router.get("/", getAllBooks)
router.post("/", createBook)
router.get("/:id", getBookById)
router.put("/:id", updateBook)
router.delete("/:id", deleteBook)
router.patch("/:id", updateAvailableBook)

export default router