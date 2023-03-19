const path = require("path");
const { GraphQLError } = require("graphql");
const crypto = require("crypto")
const fsPromises = require("fs/promises");
const {
    fileExists,
    readJsonFile,
    deleteFile,
} = require("../utils/fileHandling");

const { ProductTypesEnum } = require("../enums/enums");
const productDirectory = path.join(__dirname, "../data/products");
const cartDirectory = path.join(__dirname, "../data/shoppingCarts");


exports.resolvers = {
    Query: {
        getProductById: async (_, args) => {
            const productId = args.productId;
            const productFilePath = path.join(productDirectory, `${productId}.json`);
            const productExists = await fileExists(productFilePath);

            if (!productExists) 
                return new GraphQLError(`A product with ID ${productId} does not exist 😢`);

            const productInfo = await readJsonFile(productFilePath);
            return productInfo;
        },
        getCartById: async (_, args) => {
            const cartId = args.cartId;
            const cartFilePath = path.join(cartDirectory, `${cartId}.json`);
            const cartExists = await fileExists(cartFilePath);

            if (!cartExists) 
                return new GraphQLError(`A shopping cart with ID ${cartId} does not exist 😢`);

            const cartInfo = await readJsonFile(cartFilePath);
            return cartInfo;
        }
    },


    Mutation: {
        createShoppingCart: async (_, args) => {
            const createNewCart = {
                cartId: crypto.randomUUID(),
                products: [],
                totalPrice: 0
            };

            let filePath = path.join(cartDirectory, `${createNewCart.cartId}.json`)
            let idExists = true;

            while (idExists) {
                const exists = await fileExists(filePath);
                console.log(exists, createNewCart.cartId);
        

            if (exists) {
                newProduct.id = crypto.randomUUID();
                filePath = path.join(cartDirectory, `${createNewCart.cartId}.json`);
            }
            idExists = exists;
            }
        
            await fsPromises.writeFile(filePath, JSON.stringify(createNewCart));
            return createNewCart;
        },
        deleteShoppingCart: async (_, args) => {
            const cartId = args.cartId;
            const cartFilePath = path.join(cartDirectory, `${cartId}.json`);
            const cartExists = await fileExists(cartFilePath);

            if (!cartExists) {
                return new GraphQLError(`A shopping cart with ID ${cartId} does not exist 😢`)
            }

            try {
                await deleteFile(cartFilePath);
            } catch (error) {
                return {
                    deletedId: cartId,
                    success: false,
                }
            }

            return {
                deletedId: cartId,
                success: true,
            }
        },
        addProduct: async (_, args) => {
            const { cartId, productId } = args.input;
            const productFilePath = path.join(productDirectory, `${productId}.json`);
            const productExists = await fileExists(productFilePath);
            
            if (!productExists) 
                return new GraphQLError("That product does not exist 😢")

                const productInfo = await readJsonFile(productFilePath);

            

                const product = JSON.parse(
                    await fsPromises.readFile(productFilePath, {
                        encoding: "utf-8",
                    })
                );

            const cartFilePath = path.join(cartDirectory, `${cartId}.json`);
            const cartExists = await fileExists(cartFilePath);
            if (!cartExists)
                    return new GraphQLError("That shopping cart does not exist 😢")
            else {
                const cart = JSON.parse(
                    await fsPromises.readFile(cartFilePath, {
                        encoding: "utf-8",
                    })
                );

            cart.products.push(product);

            let sum = 0;
            for (let i= 0; i < cart.products.length; i++) {
                sum += cart.products[i] 
                // något blabla
            }
            cart.totalPrice = sum;

            await fsPromises.writeFile(cartFilePath, JSON.stringify(cart));

            return cart;
            }
        },
        removeProduct: async (_, args) => {

            const { cartId} = args.input;

            const product = await args.Product.findById(productId);

            if (!product) {
                throw new GraphQLError("Product not found")
            }

            await product.remove();

            return {
                message: `Product with ID ${productId} successfully deleted`
            }

    //         const cartFilePath = path.join( cartDirectory, `${cartId}.json`)

    //         const cartExists = await fileExists(cartFilePath);
    //         if (!cartExists) {
    //             return new GraphQLError("That shopping cart does not exist 😢")
    //         }

    //         const cart = await fsPromises.readFile(cartFilePath, {
    //             encoding: "utf-8",
    //         });
    //         const cartData = JSON.parse(cart);
            
    //         let products = cartData.product;

    //         for (let i = 0; i < products[i].Cart) {
    //             if (products === products[i].Cart) {
    //             products.splice(i, 1);
    //             break;
    //         } 
    //         else {
    //             return new GraphQLError("That shopping cart does not exist 😢");
    //         }
    //     }

    //     let price = 0;
    //     for (let i = 0; i < products.length; i++) {
    //         price += products[i].productPrice;
    //     }
            
    //     }
//     }
// }
        }
    }
}
