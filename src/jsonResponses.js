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

// provides a full list of all of the books in our database
const getBooks = (request, response) => {
    const responseJSON = {
        books,
    };

    respondJSON(request, response, 200, responseJSON);
};

//provides a list of all books with a title, entered by the user
const getBook = (request, response, parsedUrl) => {

    let responseJSON = {
        message: 'title is required.',
    };

    const title = parsedUrl.searchParams.get('title');

    if (!title) {
        responseJSON.id = 'missingParams';
        return respondJSON(request, response, 400, responseJSON);
    }

    

    const filteredBooks = books.filter(book => book.title === title);
    

    if (filteredBooks.length < 1) {
        responseJSON = {
            message: 'Book Not Found',
        };
        return respondJSON(request, response, 404, responseJSON);
    }
    responseJSON = {
        filteredBooks,
    };

    respondJSON(request, response, 200, responseJSON);
};

//provides a list of all books with a genre, entered by the user
const getGenre = (request, response, parsedUrl) => {
    let responseJSON = {
        message: 'Genre Not Found',
    };

    const genre = parsedUrl.searchParams.get('genre');

    if (!genre) {
        responseJSON.id = 'missingParams';
        return respondJSON(request, response, 400, responseJSON);
    }

    
    
    //checks first for books that have genres(some don't) then it checks for the genre that the user entered
    const filteredBooks = books.filter(book => book.genres && book.genres.includes(genre));
    

    if (filteredBooks.length < 1) {
        responseJSON = {
            message: 'Genre Not Found',
        };
        return respondJSON(request, response, 404, responseJSON);
    }
    responseJSON = {
        filteredBooks,
    };

    respondJSON(request, response, 200, responseJSON);
};

//provides a list of all books with a language, entered by the user
const getLanguage = (request, response, parsedUrl) => {
    let responseJSON = {
        message: 'language not found',
    };

    const language = parsedUrl.searchParams.get('language');

    if (!language) {
        responseJSON.id = 'missingParams';
        responseJSON = {
            message: 'language is required',
        };
        return respondJSON(request, response, 400, responseJSON);
    }



    const filteredBooks = books.filter(book => book.language === language);
   

    if (filteredBooks.length < 1) {
        responseJSON = {
            message: 'Language Not Found',
        };
        return respondJSON(request, response, 404, responseJSON);
    }

    responseJSON = {
        filteredBooks,
    };

    respondJSON(request, response, 200, responseJSON);
};


//Post Body
//Adds a Book using a Title and an Author(entered by the user)
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

        };
    }

    // previous attempts at preventing duplicates
    
    /*const filteredBooks = books.filter(book => book.title === title);
    if (filteredBooks.length > 1) {
        responseJSON = {
            message: 'book already exists',
        };
        return respondJSON(request, response, 400, responseJSON);
    }
        */
    /*if(books[title]) {
        responseJSON = {
        message: 'book already exists',
    };
    return respondJSON(request, response, 400, responseJSON);
    }
    */

    books[title].author = author;
    books[title].title = title;

    const newBook = {
        author: books[title].author,
        title: books[title].title,
        language: "English",

    }

    books.push(newBook);

    if (responseCode === 201) {
        responseJSON.message = 'Created Successfully';
        return respondJSON(request, response, responseCode, responseJSON);
    }

    return respondJSON(request, response, responseCode, {});
};



module.exports = {
    getBooks,
    getBook,
    getGenre,
    getLanguage,
    addBook,
};