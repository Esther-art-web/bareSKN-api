const express = require("express");
const {User, Collection, Category, SubCategory, Product} = require("./models");

const app = express();

app.use(express.json())


const shuffle =(array)=> {
    length = array.length;
    for(item of array) {
        random = Math.floor(Math.random() * length);
        array[random] = item;
    }
    return array;
}
app.get('/api/v1.0/', (req, res) => {
    res.send('Welcome to BareSKN');
})

app.post('/api/v1.0/users', async(req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.send(user)
    }catch (err) {
        res.status(400).send(err)
    }
})

app.get('/api/v1.0/users', async (req, res) => {
    const users = await User.find({});

    try{
        res.send(users);
    }catch(err){
        res.status(404).send(err)
    }
})

// Get all the collections 
app.get('/api/v1.0/collections', async(req, res) => {
    const collections = await Collection.find({});
    try{
        res.send(collections);
    }catch(err){
        res.status(404).send(err);
    }
})

// Get collection by key
app.get('/api/v1.0/collections/:key', async (req, res) => {
    const { key } = req.params;
    const collection = await Collection.find({key})
    try{
        res.send(collection);
    }catch(err){
        res.status(404).send(err);
    }
})

// Create new collection
app.post('/api/v1.0/collections', async(req, res) => {
    const collection = new Collection(req.body)
    try{
        await collection.save();
        res.send(collection)
    } catch(err) {
        res.status(500).send(err);
    }
})

// Get all categories
app.get('/api/v1.0/categories', async(req, res) => {
    const categories = await Category.find({});
    try{
        res.send(categories)
    }catch(err){
        res.status(404).send(err);
    }
})

// Get category by key
app.get('/api/v1.0/categories/:key', async (req, res) => {
    return;

})


// Create new category
app.post('/api/v1.0/categories', async(req, res) => {
    const category = new Category(req.body)
    try{
        await category.save();
        res.send(category)
    } catch(err) {
        res.status(500).send(err);
    }
})

// Get all the subcategories
app.get('/api/v1.0/subcategories', async(req, res) => {
    const subCategories = await SubCategory.find({});
    try{
        res.send(subCategories)
    }catch(err){
        res.status(404).send(err);
    }
})

// Get all subcategories by category key
app.get('/api/v1.0/subcategories/:category_key', async(req, res) => {
    const { category_key } = req.params;
    const category = await Category.find({key: category_key});
    const subCategories = await SubCategory.find({category_key});
    try {
        res.send({
            category : category[0].name,
            subCategories
        });
    }catch(err) {
        res.status(404).send(err);
    }
})

// Create new subcategory
app.post('/api/v1.0/subcategories', async(req, res) => {
    const subCategory = new SubCategory(req.body)
    try{
        await subCategory.save();
        res.send(subCategory)
    } catch(err) {
        res.status(500).send(err);
    }
})

// Create new product
app.post('/api/v1.0/products', async (req, res) => {
    const product = new Product(req.body);
    try{
        await product.save();
        res.send(product);
    }catch(err) {
        res.status(500).send(err);
    }
})

// Get all products or
// Get first five products with the highest rating
// Paginate result
app.get('/api/v1.0/products', async(req, res) => {
    var {limit, page, rating} = req.query;
    if(limit && page){
        var products = await Product.find({}).sort({name: 1});
        var totalLength = products.length;
        limit = parseInt(limit);
        page = parseInt(page);
        startPage = (page - 1) * limit;
        endPage = startPage + limit;
        // products = shuffle(products);
        products = products.slice(startPage, endPage);
        try{
            res.send({products, totalLength, limit});
        }catch (err) {
            res.status(404).send(err);
        }
    }else if(rating){
        try{
            var products = await Product.find({}).sort({rating: -1});
            products = products.slice(0,5)
            res.send({products})
        }
       catch(err){
        res.status(500).send(err);
       }
    }
    
})

// Get products by collection
app.get('/api/v1.0/collections/:coll_key/products', async(req, res) => {
    const { coll_key } = req.params;
    const collection = await Collection.find({key: coll_key});
    const products = await Product.find({coll_keys: coll_key});
    try{
        res.send({
            collection: collection[0].name,
            products
        })
    }catch(err){
        res.status(404).send(err);
    }
})

// Get products by subcategory
app.get('/api/v1.0/subcategories/:subcat_key/products', async(req, res) => {
    const { subcat_key } = req.params;
    const subCategory = await SubCategory.find({key: subcat_key});
    const products = await Product.find({subcat_keys: subcat_key});
    try {
        res.send({
            subCategory : subCategory[0].name,
            products,
            totalProducts: products.length
        });
    }catch(err) {
        res.status(404).send(err);
    }
})

// Update product details
app.patch('/api/v1.0/products/:id', async(req, res) => {
    const _id = req.params.id;
    const product_details = {...req.body}
    try{
        const product = await Product.find({_id});
        const updated_product = await Product.updateOne({_id}, {
            $set: product_details
        })
        res.send({success: "Product successfully updated!"});
    }catch(err) {
        res.status(404).send(err);
    }
    
})

// Delete a product
app.delete('/api/v1.0/products/:id', async(req, res) => {
    const _id = req.params.id;
    try{
        const product = await Product.findOneAndDelete({_id});
        res.send({success: "Product successfully deleted!"})
    }catch(err) {
        res.status(404).send(err);
    }
})


module.exports = app;