"Tired of expensive books collecting dust on your shelf? Knowledge Store is a book rental platform offering a wide selection of genres at affordable prices. Rent books for the time you need them, without the commitment of buying. We also take care of storage, so you can focus on the joy of reading!

This project utilizes industry-standard technologies like ExpressJS for the server, MongoDB Atlas for the database, and user authentication features like jsonwebtoken and bcrypt."

This repositary contains the backend server code of the knowledge store which is a Book Rental Platform.

Here are the list of the genres of which we would be offering books on our platform:
1. Finance
2. Business
3. Skill Based
4. Self-Help
5. Ficitional

Note: Platform would be live by the end of 2024.

#ProjectStructure

Knowledge Store/
├── app.js
├── .gitignore
├── package.json
├── package-lock.json
├── config
│   └── mongoose.js
├── controllers
│   ├── adminController.js
│   ├── authController.js
│   ├── formController.js
│   ├── userController.js
│   └── indexController.js
├── models
│   ├── cart.js
│   ├── user.js
│   ├── admin.js
│   ├── wishlist.js
│   ├── order.js
│   ├── bookInfo.js
│   ├── contact.js
│   ├── feedback.js
│   ├── suggestion.js
│   └── review.js
├── routes
│   ├── adminRoute.js
│   ├── user.js
│   ├── index.js
│   ├── formRoutes.js
│   └── authRoutes.js
├── utils
│   ├── encryptPassword.js
│   ├── fetchUserId.js
│   ├── generateToken.js
│   ├── joiValidator.js
│   └── databaseOperation
│       └── verifyLoginDetails.js
│       └── verifySignupDetails.js


Here are the problems which our platform would be solving for the readers along with their solutions:
1. They don't need to buy every book they want to read. Instead they can rent out books from our platform for numbers of days they want at affordable prices.
2. They don't need to think about the storage problem. They would return the book after reading it, so that they don't think to where should I keep this book.


Technologies used are as follows:
1. ExpressJS (For Server Code)
2. MongoDB Atlas (For Database)
3. jsonwebtoken (For User Authentication)
4. bcrypt (For Encryption of the password)
5. Cloudinary (For Storing Books Images)
6. Resend (For Mail Service) (It would be integrated once MVP is completed)

The codebase has been written while using the industry standards for writing the server code which includes creating controllers, config, models, routes, utilis folder to make code more clean and readable.

We have divided the routes in 5 major categories which are as follows:
1. AdminRoutes (For Managing Book Details Information in the Database. It includes Inserting a Book Details, Deleting a Book Details, and Update Book Details from the database)
2. AuthRoutes (For Signup, Login and Logout on the website)
3. FormRoutes (To handle the form submission data. We have following forms on our website: Suggestion, Contact, Feedback)
4. IndexRoute (To fetch all books details from the database and specific book details from the database)
5. UserRoute (To handle operations related to the user. It includes adding a book either to cart or wishlist, fetching cart or wishlist data, deleting a book either from cart or wishlist and fetching profile details of the user)


Future Plans:
1. I would dockerize the application using Docker
2. I would be adding a section where summary of the books would be available which would help user to decide which book he should rent.


If you have any suggestion, contact me at lakshay12290@gmail.com