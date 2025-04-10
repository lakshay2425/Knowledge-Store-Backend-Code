const wishlist = require("../models/wishlist");
const cart = require("../models/cart");

async function handleResponse(result, from, to, res,bookName, email){
    if (result.success){
        return res.status(201).json({
          message: `Moved book from  ${from} to ${to} successfully`,
          success: true,
          exist: false,
        })
      } else {
        if(result.exist){
          return res.status(409).json({
            message: `Book already exist in ${from}`,
            success: false,
            exist: true,
          })  
        }else{
            if (from === "cart") {
                await cart.create({
                    bookName,
                    email
                  })
              }
            else if (from === "wishlist") {
                await wishlist.create({
                  bookName,
                  email
                });
            }
          return res.status(404).json({
            message: `Failed to move the book from ${from} to ${to} Try again later`,
            success: false,
            exist: false,
          }) 
        }
      }
}

async function handleMoveBookResponse(existingBook, to, bookName, email){
    if (existingBook) {
        console.log("Already exist");
        return {
          message: `Book already exists in the ${to}`,
          success: false,
          exist: true
        }; // Book already exists in the cart
      }else{
        if(to === "cart"){
            await cart.create({ bookName, email });
        }else if (to === "wishlist"){
            await wishlist.create({ bookName, email });
        }
        return {
          message: `Book added to ${to}`,
          success: true,
          exist: false
        }; 
      }
}

async function addBook(bookName, email, to) {
  try {
    const value = validateInput(bookName, email);
    if(value){
        console.log("Values are validated");
       if(to === "cart"){
           const existingBook = await cart.findOne({ bookName, email });
           const result = await handleMoveBookResponse(existingBook, to, bookName, email);
           return result;
       }
       else if(to === 'wishlist'){
        const existingBook = await wishlist.findOne({ bookName, email });
        const result = await handleMoveBookResponse(existingBook, to, bookName, email);
        return result;
    } 

    }
  } catch (error) {
    return false;
  }
}

module.exports.moveBook = async function moveBook(bookName, email, res, from, to) {
    try{
        if(from === "wishlist"){
            await wishlist.findOneAndDelete({
                  $and: [
                    { bookName },
                    { email }
                  ]
                });
                const result = await addBook(bookName, email, 'cart');
                handleResponse(result, from, to, res, bookName, email);
        }else if(from === 'cart'){
            await cart.findOneAndDelete({
                $and: [
                  { bookName },
                  { email }
                ]
              });
              const result = await addBook(bookName, email, 'wishlist');
              handleResponse(result, from, to, res, bookName, email);
        }

    }catch(err){
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: err.message,
            error: "Server error"
        });
    }
}