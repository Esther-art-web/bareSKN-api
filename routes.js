const express = require("express");
const {User, Cart, Collection, Category, SubCategory, Product} = require("./models");

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
        res.status(200).send(collections);
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
    console.log(collection);
    try{
        await collection.save();
        res.status(201).send(collection)
    } catch(err) {
        res.status(500).send(err);
    }
})

// Update a collection
app.patch('/api/v1.0/collections/:id', async(req, res) => {
    const _id = req.params.id;
    const {name, key, image_link} = req.body;
    try{
        if(name || key || image_link){
            const collection = await Collection.findByIdAndUpdate({_id}, 
                {$set: req.body})
            if(collection.modifiedCount){
                res.send({success: "Collection deleted successfully!"})
            }
            throw new Error();
        }
        res.status(400).send();
    }catch(err){
        res.status(404).send();
    }
})

// Delete a collection
app.delete('/api/v1.0/collections/:id', async(req, res) => {
    const _id = req.params.id;
    try{
        const collection = await Collection.findByIdAndDelete(_id);
        if(collection){
            res.send({success: "Collection deleted successfully!"})
        }
        throw new Error()
    }catch(err){
        res.status(404).send(err);
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
        res.status(201).send(category);
    } catch(err) {
        res.status(500).send(err);
    }
})

// Update a category
app.patch('/api/v1.0/categories/:id', async(req, res) => {
    const _id = req.params.id;
    const {name, key} = req.body;
    try{
        if(name || key ){
            const category = await Category.findByIdAndUpdate({_id}, 
                {$set: req.body})
            if(category.modifiedCount){
                res.send({success: "Category updated successfully!"})
            }
            throw new Error();
        }
        res.status(400).send();
    }catch(err){
        res.status(404).send();
    }
})

// Delete a category
app.delete('/api/v1.0/categories/:id', async(req, res) => {
    const _id = req.params.id;
    
    try{
        const category = await Category.findByIdAndDelete({_id});
        if(category){
            res.send(category);
        }
        throw new Error();
    }catch(err){
        res.status(404).send(err);
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
        res.status(201).send(product);
    }catch(err) {
        res.status(500).send(err);
    }
})

// Get all products or
// Get first five products with the highest rating or
// Get product(s) by search
// Paginate result
app.get('/api/v1.0/products', async(req, res) => {
    var {limit, page, rating, search_term} = req.query;
    if(limit && page){
        var products = await Product.find({}).sort({name: 1});
        var totalLength = products.length;
        limit = parseInt(limit);
        page = parseInt(page);
        startPage = (page - 1) * limit;
        endPage = startPage + limit;
        products = products.slice(startPage, endPage);
        try{
            res.send({products, totalLength, limit});
        }catch (err) {
            res.status(404).send(err);
        }
    }else if(rating){
        try{
            var products = await Product.find({}).sort({rating: -1});
            products = shuffle(products);
            products = products.slice(0, 5);
            res.send({products});
        }
       catch(err){
        res.status(500).send(err);
       }
    }else if(search_term){
        try{
            var products = await Product.find({name: {$regex: search_term, $options: 'i'}}).sort({name: 1}).exec();
            products = products.slice(0, 5);
            res.send({products});
        }catch(err){
            res.status(404).send(err);
        }
    }
    
})

// Get products by collection
app.get('/api/v1.0/collections/:coll_key/products', async(req, res) => {
    const { coll_key } = req.params;
    const collection = await Collection.find({key: coll_key});
    const products = await Product.find({coll_keys: coll_key}).sort({name: 1});
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
    const products = await Product.find({subcat_keys: subcat_key}).sort({name: 1});
    try {
        res.send({
            subCategory : subCategory[0].name,
            products,
            totalProducts: products.length
        });
    }catch(err) {
        res.status(404).send(err);
    }
});

// Update product details
app.patch('/api/v1.0/products/:id', async(req, res) => {
    const _id = req.params.id;
    const product_details = {...req.body}
    try{
        const updated_product = await Product.updateOne({_id}, {
            $set: product_details
        });
        if(updated_product.modifiedCount){
            res.send({success: "Product successfully updated!"});
        }
        throw new Error();
    }catch(err) {
        res.status(404).send(err);
    }
    
})

// Delete a product
app.delete('/api/v1.0/products/:id', async(req, res) => {
    const _id = req.params.id;
    try{
        const product = await Product.findOneAndDelete({_id});
        if(product){
            res.send({success: "Product successfully deleted!"});
        }
        throw new Error();
    }catch(err) {
        res.status(404).send(err);
    }
})

// Get all cart items of a user
app.get('/api/v1.0/cart/:owner_id', async( req, res) => {
    const {owner_id} = req.params;
    try{
        const cart = await Cart.findOne({owner_id}).sort({_id: -1});
        res.send(cart);
    }catch(err) {
        res.status(404).send(err)
    }
})

// Create a new cart for user
app.post('/api/v1.0/cart/:owner_id', async(req, res) => {
    const {owner_id} = req.params;
    try{
        if(owner_id){
            const cart_details={
                owner_id,
                cartItems: [],
                amount: 0,
                total: 0
            }
            const cart = new Cart(cart_details);
            await cart.save();
            res.status(201).send({success: "Cart Successfully created!"});
        }else{
            res.status(404).send({error: "Cart owner not found"})
        }
    }catch(err){
        res.status(500).send(err);
    }
})

app.patch('/api/v1.0/cart/:owner_id', async(req, res) => {
    const {owner_id} = req.params;
    const { _id, cartItems } = req.body;
    var total = 0;
    var amount = 0;

    try{
        cartItems.map(({quantity, price}) => {
            total += quantity;
            amount += quantity * price;
        })
        const cart = await Cart.updateOne({_id, owner_id}, {
            $set: {cartItems, amount, total}
        });
        res.send(cart)

    }catch(err){
        res.status(400).send(err)
    }
    
})

module.exports = app;