import  express from 'express';
let router = express.Router();
import {fetchBooks,  fetchBook, fetchRecommendedBooks} from "../controllers/indexController.js"; 

router.get('/books', fetchBooks);
router.get("/search/:bookName", fetchBook);
router.get("/recommendedBooks", fetchRecommendedBooks);


export default router;
