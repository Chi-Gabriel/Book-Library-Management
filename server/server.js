import express from "express"
import dotenv from "dotenv"
import cors from "cors"

import connectMongoDB from "./db/connectMongoDB.js"

import bookRoutes from "./Routes/book.routes.js"
import authorRoutes from "./Routes/author.routes.js"
import genreRoutes from "./Routes/genre.routes.js"
import statsRoutes from "./Routes/stats.routes.js";

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use("/api/books", bookRoutes)
app.use("/api/authors", authorRoutes)
app.use("/api/genres", genreRoutes)
app.use("/api/stats", statsRoutes)



app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
    connectMongoDB()
})

