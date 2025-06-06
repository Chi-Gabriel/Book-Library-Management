import express from "express"
import { getAllGenres, createGenre, getGenreById, updateGenre, deleteGenre } from '../Controllers/genre.controller.js'

const router = express.Router()

router.get("/", getAllGenres)
router.post("/", createGenre)
router.get("/:id", getGenreById)
router.put("/:id", updateGenre)
router.delete("/:id", deleteGenre)

export default router
