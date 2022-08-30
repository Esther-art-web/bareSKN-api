const request = require('supertest');
const app = require('../app');

describe("Products Test", () => {
    it("GET/products", async() => {
        const response = await request(app)
        .get('/api/v1.0/products?limit=10&page=1')
        expect(response.statusCode).toEqual(200)
        expect(response.body.products.length).toBeGreaterThan(0);
    })
    // it("POST/products", async() => {
    //     const response = await request(app)
    //     .post('/api/v1.0/products')
    //     .send({
    //         name: "Test",
    //         description: "This is a test",
    //         price: 0,
    //         image_link: "nil"
    //     })
    //     expect(response.statusCode).toEqual(201)
    //     expect(response.body.name).toBe("Test")
    //     console.log(response.body)
    // })
    it("PATCH/products", async() => {
        const response = await request(app)
        .patch('/api/v1.0/products/630d0383cea239a2359a6bb5')
        .send({
            description: "This is a test, and I just updated it again!"
        })
        expect(response.statusCode).toEqual(404)
        // expect(response.body.success)
    })
    it("DELETE/products", async() => {
        const response = await request(app)
        .delete('/api/v1.0/products/630d0383cea239a2359a6bb5')
        expect(response.statusCode).toEqual(404)
    })
})


describe("Collections Test", () => {
    it('POST/collections', async() => {
        const response = await request(app)
        .post('/api/v1.0/collections')
        .send({
            name: "Collections Test 2", 
            key: "test_002",
            image_link: "nil"
        })
        expect(response.statusCode).toBe(201);
    })
    it('GET/collections', async() => {
        const response = await request(app)
        .get('/api/v1.0/collections')
        expect(response.statusCode).toBe(200);
        console.log(response.body)
    })
    it('PATCH/collections', async() => {
        const response = await request(app)
        .patch('/api/v1.0/collections/630d1e72245c1a9cd056c057')
        .send({
            name: "Updated Test",
        })
        expect(response.statusCode).toBe(200);
    })
    it('DELETE/collections', async() => {
        const response = await request(app)
        .delete('/api/v1.0/collections/630d19275ee2ed7cc979c286')
        expect(response.statusCode).toBe(404);
    })
    
})

describe('Categories Test', () => {
    it('POST/categories', async() => {
        const response = await request(app)
        .post('/api/v1.0/categories')
        .send({
            name: "Hyperpigmentation",
            key: "cat_002"
        })
        expect(response.statusCode).toBe(201);
        expect(response.body.key).toBe('cat_002');
    });
    it('GET/categories', async() => {
        const response = await request(app)
        .get('/api/v1.0/categories')
        expect(response.statusCode).toBe(200);
        console.log(response.body); 
    });
    it('PATCH/categories', async() => {
        const response = await request(app)
        .patch('/api/v1.0/categories/630d3ef91a01d1804d7e7497')
        .send({
            name: "Skin Type Edited"
        })
        expect(response.statusCode).toBe(200)
    });
    it('DELETE/categories', async() => {
        const response = await request(app)
        .delete('/api/v1.0/categories/630d3ef91a01d1804d7e7497')
        expect(response.statusCode).toBe(200)
    });
})