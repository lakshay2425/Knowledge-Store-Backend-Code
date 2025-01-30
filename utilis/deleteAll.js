const wishlist = require("../models/wishlist");
const cart = require("../models/cart");

module.exports.deleteAllProducts = async (email, type)=>{
    try {
        if(type === "wishlist"){
        const deletedProductResponse = await wishlist.deleteMany({email});
        return {success : true, message : "All products deleted from wishlist"};
        }else if(type === "cart"){
            const deletedProductResponse = await cart.deleteMany({email});
            return {success : true, message : "All products deleted from cart"};
        }
    } catch (error) {
        return {success : false, error : error.message}
    }
}