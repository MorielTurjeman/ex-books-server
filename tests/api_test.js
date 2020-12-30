const axios=require("axios");

axios.get('https://openlibrary.org/books/OL7353617M.json')
  .then(response => {
    console.log(response);
   
  })
  .catch(error => {
    console.log(error);
  });