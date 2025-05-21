const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let books = [
    { id: 1, title: "The Hobbit", author: "J.R.R. Tolkien", year: 1937 },
    { id: 2, title: "1984", author: "George Orwell" }
];

app.get('/', (req, res) => {
    res.send('Book API is running wild wadau!');
});

// list all books
app.get('/books', (req, res) => {
    res.json(books);
});

// get a single book by ID
app.get('/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if(!book) return res.status(404).send('Book not found');
    res.json(book);
});

// create a book
app.post('/books', (req, res) => {
    const book = {
        id: books.length + 1,
        title: req.body.title,
        author: req.body.author
    };
    books.push(book);
    res.status(201).json(book);
});

// update a book
app.put('/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).send('Book not found .');
    
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    res.json(book);
});

// delete a book
app.delete('/books/:id', (req, res)=> {
  books = books.filter(b => b.id !== parseInt(req.params.id));
  res.sendStatus(204); // No content  
});

// Handle undefined routes
app.use((req, res) => {
    res.status(404).send('Route not found');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});