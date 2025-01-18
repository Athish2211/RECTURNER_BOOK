const mongoose = require('mongoose');
const Book = require('../models/Book'); // Adjust the path as necessary

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/recturner_book')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const books = [
    {
        bookId: '1',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        genre: 'Fiction',
        description: 'A novel about the serious issues of rape and racial inequality.',
        thumbnail: '../images/book1.jpg',
        recommendations: []
    },
    {
        bookId: '2',
        title: '1984',
        author: 'George Orwell',
        genre: 'Dystopian',
        description: 'A novel that presents a terrifying vision of a totalitarian future.',
        thumbnail: '../images/book2.jpg',
        recommendations: []
    },
    {
        bookId: '3',
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        genre: 'Romance',
        description: 'A romantic novel that charts the emotional development of the protagonist Elizabeth Bennet.',
        thumbnail: '../images/book3.jpg',
        recommendations: []
    },
    {
        bookId: '4',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        genre: 'Fiction',
        description: 'A novel about the American dream and the roaring twenties.',
        thumbnail: '../images/book4.jpg',
        recommendations: []
    },
    {
        bookId: '5',
        title: 'Moby Dick',
        author: 'Herman Melville',
        genre: 'Action',
        description: 'A novel about the voyage of the whaling ship Pequod.',
        thumbnail: '../images/book5.jpg',
        recommendations: []
    },
    {
        bookId: '6',
        title: 'War and Peace',
        author: 'Leo Tolstoy',
        genre: 'Fiction',
        description: 'A novel that chronicles the French invasion of Russia.',
        thumbnail: '../images/book6.jpg',
        recommendations: []
    },
    {
        bookId: '7',
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        genre: 'Fiction',
        description: 'A novel about the journey of a young Andalusian shepherd in his quest to find treasure.',
        thumbnail: '../images/book7.jpg',
        recommendations: []
    },
    {
        bookId: '8',
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        genre: 'Action',
        description: 'A fantasy novel about the journey of Bilbo Baggins.',
        thumbnail: '../images/book8.jpg',
        recommendations: []
    },
    {
        bookId: '9',
        title: 'Fahrenheit 451',
        author: 'Ray Bradbury',
        genre: 'Thriller',
        description: 'A novel about a future society where books are banned and burned.',
        thumbnail: '../images/book9.jpg',
        recommendations: []
    },
    {
        bookId: '10',
        title: 'Jane Eyre',
        author: 'Charlotte Brontë',
        genre: 'Romance',
        description: 'A novel about the experiences of the orphaned Jane Eyre.',
        thumbnail: '../images/book10.jpg',
        recommendations: []
    },
    {
        bookId: '11',
        title: 'Brave New World',
        author: 'Aldous Huxley',
        genre: 'Thriller',
        description: 'A novel about a futuristic society controlled by technology and conditioning.',
        thumbnail: '../images/book11.jpg',
        recommendations: []
    },
    {
        bookId: '12',
        title: 'Wuthering Heights',
        author: 'Emily Brontë',
        genre: 'Romance',
        description: 'A novel about the intense and almost demonic love between Catherine Earnshaw and Heathcliff.',
        thumbnail: '../images/book12.jpg',
        recommendations: []
    },
    {
        bookId: '13',
        title: 'The Odyssey',
        author: 'Homer',
        genre: 'Action',
        description: 'An epic poem about the journey of Odysseus.',
        thumbnail: '../images/book13.jpg',
        recommendations: []
    },
    {
        bookId: '14',
        title: 'Crime and Punishment',
        author: 'Fyodor Dostoevsky',
        genre: 'Thriller',
        description: 'A novel about the mental anguish and moral dilemmas of an impoverished ex-student.',
        thumbnail: '../images/book14.jpg',
        recommendations: []
    },
    {
        bookId: '15',
        title: 'The Brothers Karamazov',
        author: 'Fyodor Dostoevsky',
        genre: 'Fiction',
        description: 'A novel about the spiritual drama of moral struggles concerning faith, doubt, and reason.',
        thumbnail: '../images/book15.jpg',
        recommendations: []
    },
    {
        bookId: '16',
        title: 'Anna Karenina',
        author: 'Leo Tolstoy',
        genre: 'Romance',
        description: 'A novel about the tragic love affair between Anna Karenina and Count Vronsky.',
        thumbnail: '../images/book16.jpg',
        recommendations: []
    },
    {
        bookId: '17',
        title: 'The Divine Comedy',
        author: 'Dante Alighieri',
        genre: 'Fiction',
        description: 'An epic poem about the journey through Hell, Purgatory, and Paradise.',
        thumbnail: '../images/book17.jpg',
        recommendations: []
    },
    {
        bookId: '18',
        title: 'The Iliad',
        author: 'Homer',
        genre: 'Action',
        description: 'An epic poem about the Trojan War.',
        thumbnail: '../images/book18.jpg',
        recommendations: []
    },
    {
        bookId: '19',
        title: 'Les Misérables',
        author: 'Victor Hugo',
        genre: 'Fiction',
        description: 'A novel about the struggles of ex-convict Jean Valjean.',
        thumbnail: '../images/book19.jpg',
        recommendations: []
    },
    {
        bookId: '20',
        title: 'The Count of Monte Cristo',
        author: 'Alexandre Dumas',
        genre: 'Action',
        description: 'A novel about the story of Edmond Dantès, who is wrongfully imprisoned.',
        thumbnail: '../images/book20.jpg',
        recommendations: []
    },
    {
        bookId: '21',
        title: 'Don Quixote',
        author: 'Miguel de Cervantes',
        genre: 'Action',
        description: 'A novel about the adventures of a nobleman who reads so many chivalric romances that he loses his sanity.',
        thumbnail: '../images/book21.jpg',
        recommendations: []
    },
    {
        bookId: '22',
        title: 'The Picture of Dorian Gray',
        author: 'Oscar Wilde',
        genre: 'Thriller',
        description: 'A novel about a young man whose portrait ages while he remains young and beautiful.',
        thumbnail: '../images/book22.jpg',
        recommendations: []
    },
    {
        bookId: '23',
        title: 'Frankenstein',
        author: 'Mary Shelley',
        genre: 'Thriller',
        description: 'A novel about a scientist who creates a grotesque creature in an unorthodox scientific experiment.',
        thumbnail: '../images/book23.jpg',
        recommendations: []
    },
    {
        bookId: '24',
        title: 'Dracula',
        author: 'Bram Stoker',
        genre: 'Thriller',
        description: 'A novel about the vampire Count Dracula\'s attempt to move from Transylvania to England.',
        thumbnail: '../images/book24.jpg',
        recommendations: []
    },
    {
        bookId: '25',
        title: 'The Metamorphosis',
        author: 'Franz Kafka',
        genre: 'Fiction',
        description: 'A novella about a man who wakes up one morning to find himself transformed into a giant insect.',
        thumbnail: '../images/book25.jpg',
        recommendations: []
    },
    {
        bookId: '26',
        title: 'The Trial',
        author: 'Franz Kafka',
        genre: 'Thriller',
        description: 'A novel about a man who is arrested and prosecuted by a remote, inaccessible authority.',
        thumbnail: '../images/book26.jpg',
        recommendations: []
    },
    {
        bookId: '27',
        title: 'The Stranger',
        author: 'Albert Camus',
        genre: 'Fiction',
        description: 'A novel about an indifferent French Algerian who kills an Arab man.',
        thumbnail: '../images/book27.jpg',
        recommendations: []
    },
    {
        bookId: '28',
        title: 'One Hundred Years of Solitude',
        author: 'Gabriel Garcia Marquez',
        genre: 'Fiction',
        description: 'A novel that tells the multi-generational story of the Buendía family.',
        thumbnail: '../images/book28.jpg',
        recommendations: []
    },
    {
        bookId: '29',
        title: 'Love in the Time of Cholera',
        author: 'Gabriel Garcia Marquez',
        genre: 'Romance',
        description: 'A novel about the enduring love between Fermina Daza and Florentino Ariza.',
        thumbnail: '../images/book29.jpg',
        recommendations: []
    },
    {
        bookId: '30',
        title: 'The Old Man and the Sea',
        author: 'Ernest Hemingway',
        genre: 'Fiction',
        description: 'A novel about an aging fisherman who struggles with a giant marlin far out in the Gulf Stream.',
        thumbnail: '../images/book30.jpg',
        recommendations: []
    },
    {
        bookId: '31',
        title: 'A Farewell to Arms',
        author: 'Ernest Hemingway',
        genre: 'Romance',
        description: 'A novel about a love affair between an American ambulance driver in the Italian army and a British nurse.',
        thumbnail: '../images/book31.jpg',
        recommendations: []
    },
    {
        bookId: '32',
        title: 'For Whom the Bell Tolls',
        author: 'Ernest Hemingway',
        genre: 'Action',
        description: 'A novel about an American dynamiter in the Spanish Civil War.',
        thumbnail: '../images/book32.jpg',
        recommendations: []
    },
    {
        bookId: '33',
        title: 'The Sun Also Rises',
        author: 'Ernest Hemingway',
        genre: 'Fiction',
        description: 'A novel about a group of expatriates in Europe after World War I.',
        thumbnail: '../images/book33.jpg',
        recommendations: []
    },
    {
        bookId: '34',
        title: 'The Grapes of Wrath',
        author: 'John Steinbeck',
        genre: 'Fiction',
        description: 'A novel about the Joad family\'s journey from the Dust Bowl to California.',
        thumbnail: '../images/book34.jpg',
        recommendations: []
    },
    {
        bookId: '35',
        title: 'Of Mice and Men',
        author: 'John Steinbeck',
        genre: 'Fiction',
        description: 'A novel about the friendship between two displaced migrant ranch workers.',
        thumbnail: '../images/book35.jpg',
        recommendations: []
    },
    {
        bookId: '36',
        title: 'East of Eden',
        author: 'John Steinbeck',
        genre: 'Fiction',
        description: 'A novel that retells the story of Cain and Abel in the Salinas Valley.',
        thumbnail: '../images/book36.jpg',
        recommendations: []
    },
    {
        bookId: '37',
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        genre: 'Fiction',
        description: 'A novel about the experiences of a young boy named Holden Caulfield.',
        thumbnail: '../images/book37.jpg',
        recommendations: []
    },
    {
        bookId: '38',
        title: 'The Lord of the Rings',
        author: 'J.R.R. Tolkien',
        genre: 'Action',
        description: 'An epic fantasy novel about the quest to destroy the One Ring.',
        thumbnail: '../images/book38.jpg',
        recommendations: []
    },
    {
        bookId: '39',
        title: 'The Silmarillion',
        author: 'J.R.R. Tolkien',
        genre: 'Action',
        description: 'A collection of mythopoeic stories about the creation of the world and the early ages of Middle-earth.',
        thumbnail: '../images/book39.jpg',
        recommendations: []
    },
    {
        bookId: '40',
        title: 'The Chronicles of Narnia',
        author: 'C.S. Lewis',
        genre: 'Action',
        description: 'A series of seven fantasy novels about the adventures of children in the world of Narnia.',
        thumbnail: '../images/book40.jpg',
        recommendations: []
    },
    {
        bookId: '41',
        title: 'The Lion, the Witch and the Wardrobe',
        author: 'C.S. Lewis',
        genre: 'Action',
        description: 'A novel about four children who discover a magical world inside a wardrobe.',
        thumbnail: '../images/book41.jpg',
        recommendations: []
    },
    {
        bookId: '42',
        title: 'The Hitchhiker\'s Guide to the Galaxy',
        author: 'Douglas Adams',
        genre: 'Fiction',
        description: 'A comic science fiction series about the adventures of Arthur Dent.',
        thumbnail: '../images/book42.jpg',
        recommendations: []
    },
    {
        bookId: '43',
        title: 'Dune',
        author: 'Frank Herbert',
        genre: 'Action',
        description: 'A science fiction novel about the struggle for control of the desert planet Arrakis.',
        thumbnail: '../images/book43.jpg',
        recommendations: []
    },
    {
        bookId: '44',
        title: 'Foundation',
        author: 'Isaac Asimov',
        genre: 'Fiction',
        description: 'A science fiction series about the fall and rise of a galactic empire.',
        thumbnail: '../images/book44.jpg',
        recommendations: []
    },
    {
        bookId: '45',
        title: 'Neuromancer',
        author: 'William Gibson',
        genre: 'Thriller',
        description: 'A science fiction novel about a washed-up computer hacker hired for one last job.',
        thumbnail: '../images/book45.jpg',
        recommendations: []
    },
    {
        bookId: '46',
        title: 'Snow Crash',
        author: 'Neal Stephenson',
        genre: 'Thriller',
        description: 'A science fiction novel about a computer virus that infects humans.',
        thumbnail: '../images/book46.jpg',
        recommendations: []
    },
    {
        bookId: '47',
        title: 'The Left Hand of Darkness',
        author: 'Ursula K. Le Guin',
        genre: 'Fiction',
        description: 'A science fiction novel about a planet where the inhabitants can change their gender.',
        thumbnail: '../images/book47.jpg',
        recommendations: []
    },
    {
        bookId: '48',
        title: 'The Dispossessed',
        author: 'Ursula K. Le Guin',
        genre: 'Fiction',
        description: 'A science fiction novel about a physicist who seeks to bridge the gap between two worlds.',
        thumbnail: '../images/book48.jpg',
        recommendations: []
    },
    {
        bookId: '49',
        title: 'The Handmaid\'s Tale',
        author: 'Margaret Atwood',
        genre: 'Thriller',
        description: 'A dystopian novel about a totalitarian society where women are treated as property.',
        thumbnail: '../images/book49.jpg',
        recommendations: []
    },
    {
        bookId: '50',
        title: 'The Road',
        author: 'Cormac McCarthy',
        genre: 'Thriller',
        description: 'A novel about a father and son\'s journey through a post-apocalyptic world.',
        thumbnail: '../images/book50.jpg',
        recommendations: []
    },
    {
        bookId: '51',
        title: 'Blood Meridian',
        author: 'Cormac McCarthy',
        genre: 'Action',
        description: 'A novel about the violent journey of a teenager across the American West.',
        thumbnail: '../images/book51.jpg',
        recommendations: []
    },
    {
        bookId: '52',
        title: 'No Country for Old Men',
        author: 'Cormac McCarthy',
        genre: 'Thriller',
        description: 'A novel about a man who stumbles upon a drug deal gone wrong and the ensuing violence.',
        thumbnail: '../images/book52.jpg',
        recommendations: []
    }
];
// Insert books into the database
Book.insertMany(books)
.then((insertedBooks) => {
    console.log('Books inserted successfully');
    insertedBooks.forEach(book => {
        console.log(`Inserted book with custom ID: ${book.bookId} and MongoDB ID: ${book._id}`);
    });
    mongoose.connection.close();
})
.catch(err => {
    console.error('Error inserting books:', err);
    mongoose.connection.close();
});