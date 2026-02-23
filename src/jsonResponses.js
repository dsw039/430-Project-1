// Note this object is purely in memory
// When node shuts down this will be cleared.
// Same when your heroku app shuts down from inactivity
// We will be working with databases in the next few weeks.
//const books = {};
const books = require('../data/books.json');


const respondJSON = (request, response, status, object) => {
    const content = JSON.stringify(object);
    response.writeHead(status, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    });

    if (request.method !== 'HEAD' && status !== 204) {
        response.write(content);
    }

    response.end();
};

const getBooks = (request, response) => {
    const responseJSON = {
        books,
    };
    
    respondJSON(request, response, 200, responseJSON);
};

const getBook = (request, response) => {

    const filteredBooks = books.filter(book => book.title === "Things Fall Apart");

    const responseJSON = {
        filteredBooks,
    };

    respondJSON(request, response, 200, responseJSON);
};


//Post Body
const addBook = (request, response) => {
    // default json message
    const responseJSON = {
        message: 'author and title are both required.',
    };
    const { author, title } = request.body;

    if (!author || !title) {
        responseJSON.id = 'missingParams';
        return respondJSON(request, response, 400, responseJSON);
    }

    let responseCode = 204;

    if (!books[title]) {
        // Set the status code to 201 (created) and create an empty user
        responseCode = 201;
        books[title] = {
            title: title,
        };
    }

    books[title].author = author;

    if (responseCode === 201) {
        responseJSON.message = 'Created Successfully';
        return respondJSON(request, response, responseCode, responseJSON);
    }

    return respondJSON(request, response, responseCode, {});
};

module.exports = {
    getBooks,
    getBook,
    addBook,
};