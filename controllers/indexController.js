const { fetchBooks,  fetchData} = require('../utilis/databaseOperations/fetchData');


module.exports.fetchBooks = async function(req,res){
    try {
      const books = await fetchData(); // Function to fetch data from the database
      res.json(books);
    } catch (error) {
      res.status(500).send(`Server Error, ${error}`);
    }
  };


module.exports.fetchData = async function(req,res){
    try {
      const {genre} = req.params;
      const books = await fetchBooks(genre); //Functio to fetch books data category wise from the database
      res.json(books);
    } catch (error) {
      res.status(500).send('Server Error');
    }
  }