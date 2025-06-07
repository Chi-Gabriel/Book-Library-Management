
## Prerequisites

*   [Node.js](https://nodejs.org/) (version 14.x or higher recommended)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js)
*   [MongoDB](https://www.mongodb.com/try/download/community) (running locally or a cloud instance like MongoDB Atlas)

## Setup and Installation

1.  **Clone the repository (if applicable):**
    ```bash
    git clone <your-repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root of the project:
    
    Open the `.env` file and configure the variables:
    *   `PORT`: The port number the server will run on (e.g., `5000`).
    *   `MONGO_URI`: Your MongoDB connection string.
        *   For a local MongoDB instance: `mongodb://localhost:27017/bookwise_db` (replace `bookwise_db` with your desired database name).
        *   For MongoDB Atlas: Use the connection string provided by Atlas.

    Example `.env` content:
    ```
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/bookwise_db
    ```

## Running the Application

1.  **Start the server:**
    ```bash
    npm start
    ```
    This command typically runs `node server.js` (as defined in `package.json`'s `scripts` section).

2.  The server should now be running on the port specified in your `.env` file (e.g., `http://localhost:5000`).
    You will see a console message indicating that the server is running and connected to MongoDB.

## API Endpoints

The API is prefixed with `/api`.

### Books (`/api/books`)

*   `GET /`: Get all books (supports pagination, search, filtering, sorting via query parameters).
    *   Query Params: `page`, `limit`, `search`, `authorId`, `genreId`, `availability`, `sortBy`, `sortOrder`.
*   `POST /`: Create a new book.
*   `GET /:id`: Get a single book by its ID.
*   `PUT /:id`: Update a book by its ID.
*   `DELETE /:id`: Delete a book by its ID.
*   `PATCH /:id`: Update a book's availability (legacy, `PUT /:id` can also update availability).

### Authors (`/api/authors`)

*   `GET /`: Get all authors (includes book count for each author).
*   `POST /`: Create a new author.
*   `GET /:id`: Get a single author by ID (includes book count).
*   `PUT /:id`: Update an author by ID.
*   `DELETE /:id`: Delete an author by ID (prevented if author has books).

### Genres (`/api/genres`)

*   `GET /`: Get all genres (includes book count for each genre).
*   `POST /`: Create a new genre.
*   `GET /:id`: Get a single genre by ID (includes book count).
*   `PUT /:id`: Update a genre by ID.
*   `DELETE /:id`: Delete a genre by ID (prevented if genre has books).

### Statistics (`/api/stats`)

*   `GET /`: Get application statistics (total books, available books, total authors, total genres).

*(Refer to the source code in the `Routes/` and `Controllers/` directories for more detailed information on request bodies and response structures.)*

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate (if tests were part of the project).

## License

[MIT](https://choosealicense.com/licenses/mit/) *(Or your preferred license)*