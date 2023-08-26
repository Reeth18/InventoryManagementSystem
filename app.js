const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");

const app = express();
app.use(morgan());
app.use(express.json());

//***************************//
// Define Port No
const portNo = 5000;
//*******************//

//********** Database Connection **********//
async function main() {
  await mongoose.connect(
    "mongodb+srv://snehalmishra:123@cluster0.8owrboj.mongodb.net/"
  );

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

main()
  .then(() => console.log(`Database Connected`))
  .catch((err) => console.log(err));

// ******************************* //

// ******** Defining the Schema of MongoDB ********* //
// Product Schema
const { Schema } = mongoose;

const productSchema = new Schema({
  // Validations : {required:true} If not provided will throw an error
  Product_name: { 
    type: String, 
    required: true,
},

  Product_description: { 
    type: String, 
    required: true,
},

  Price: { 
    type: String,
    required: true,
},

    // For category refer to {Category_id} Schema
  Category: { 
    // type: String, 
    // This field will store object id of another schema
    // Difference between this and foreign key is that:- in foreign key tables are joined based on column and that can be any column(SQL concept) but in MongoDb it has to be an "Object_id"
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
},

  Stock_quantity: { 
    type: Number, 
    required: true,
    default: 20,
},
});
// MongoDb have collections, models and documents
// Making Model out of the Product Schema
const ProductModel = mongoose.model('Product', productSchema);

// Category Schema
const categorySchema = new Schema({
    Category_name: {
        type: String,
        required: true,
    },
    Description: {
        type: String,
        required: true,
    },
})

const CategoryModel = mongoose.model('Category', categorySchema);

// Inventory Schema
const inventorySchema = new Schema({
    // (Reference to Product Schema)
    Product : {},
    Quantity : {},
    Date_added : {},
});

// ********************** //

// Product API Endpoints: Products Model
// GET/api/products: Display(Get) All the products
app.get('/api/products', async (req, res) => {
    // Logic which will give us all the products in the Database
    try {
        let productData = await ProductModel.find({});
        if(productData.length < 1){
            return res.status(401).json({
                message: "No data in product model",
            });
        }
        res.status(201).json({
            message: "Data is present in product model",
            productData
        })
    } catch (error){
        console.log("Errors from GET/api/products ", (error));
    }

});

// POST /api/products: Create a product
app.post('/api/products', async (req, res) => {
    // logic is to get the product data from request body coming in the request
    try{
        let {
            productName,
            productDescription,
            price, 
            categoryId,
            stockQuantity
        } = req.body;
    
        const productData = new ProductModel({
            Product_name : productName,
            Product_description: productDescription,
            Price: price,
            Category: categoryId,
            Stock_quantity: stockQuantity
        })

        // it is to save all the data into the database
        let sendData = await productData.save();
        res.status(200).json({
            message: "Data Inserted Successfully",
            sendData
        })
    } catch(error){
        console.log("POST /api/products", error);
    }
});

// Category API Endpoints
// GET /api/categories: Get a list of all categories.


// POST /api/categories: Create a new category.
app.post('/api/categories', async (req, res) => {
    try {
        // Make sure to take out from request body the json keys.
        let {
            categoryName,
            description,
        } = req.body;

        // Make sure to insert the values inside the model in the same way defined in the schema
        const categoryData = new CategoryModel({
            Category_name : categoryName,
            Description: description,
        })
        let sendCategoryData = await categoryData.save();
        res.status(200).json({
            message: "Data inserted successfully",
            sendCategoryData
        })
    } catch(error) {
        console.log(error, 'POST /api/categories');
        res.status(404).json({
            message: "Data Cannot be Inserted"
        })
    }
})

// ********** Running the Server **********//
app.listen(portNo, () => {
  console.log(`Server is running on ${portNo}`);
});
