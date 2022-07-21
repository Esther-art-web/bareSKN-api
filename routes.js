const express = require("express");
const {User, Collection, Category, SubCategory, Product} = require("./models");
const app = express();

app.use(express.json())

app.get('/', (req, res) => {
    // console.log(req)
    res.send('Welcome to BareSKN');
})

app.post('/users', async(req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.send(user)
    }catch (err) {
        res.status(400).send(err)
    }
})

app.get('/users', async (req, res) => {
    const users = await User.find({});

    try{
        res.send(users);
    }catch(err){
        res.status(404).send(err)
    }
})

app.get('/collections', async(req, res) => {
    const collections = await Collection.find({});
    try{
        res.send(collections);
    }catch(err){
        res.status(404).send(err);
    }
})

app.post('/collections', async(req, res) => {
    const collection = new Collection(req.body)
    try{
        await collection.save();
        res.send(collection)
    } catch(err) {
        res.status(500).send(err);
    }
})

app.get('/categories', async(req, res) => {
    const categories = await Category.find({});
    try{
        res.send(categories)
    }catch(err){
        res.status(404).send(err);
    }
})

app.post('/categories', async(req, res) => {
    const category = new Category(req.body)
    try{
        await category.save();
        res.send(category)
    } catch(err) {
        res.status(500).send(err);
    }
})

app.get('/subcategories', async(req, res) => {
    const subCategories = await SubCategory.find({});
    try{
        res.send(subCategories)
    }catch(err){
        res.status(404).send(err);
    }
})

app.post('/subcategories', async(req, res) => {
    const subCategory = new SubCategory(req.body)
    try{
        await subCategory.save();
        res.send(subCategory)
    } catch(err) {
        res.status(500).send(err);
    }
})

app.post('/products', async (req, res) => {
    const product = new Product(req.body);

    try{
        await product.save();
        res.send(product);
    }catch(err) {
        res.status(500).send(err);
    }
})

app.get('/products', async(req, res) => {
    const products = await Product.find({});

    try{
        res.send(products);
    }catch (err) {
        res.status(404).send(err);
    }
})

module.exports = app;