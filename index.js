const express = require('express');
const app = express();
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;


// Use Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wq4ks.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


// Connect MongoDB
async function run() {

    try {
        await client.connect();
        const database = client.db('EllaMartShop');
        const productCollection = database.collection('allProduct');
        const userOrderCollection = database.collection('UserOrder')
        console.log('Database Connected SuccessFully');
        const userCollection = database.collection('userStore');
        const userReviewCollection = database.collection('userReviews');



        // ALL GET API************

        // Add Product GET API
        app.get('/addProduct', async (req, res) => {
            const cursor = productCollection.find({});
            const allProduct = await cursor.toArray();
            res.send(allProduct);
        });

        // Only One Product Details
        app.get('/addProduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product)
        })

        // GET All User Product
        app.get('/orders', async (req, res) => {
            const orders = await userOrderCollection.find({}).toArray();
            res.send(orders);
        })

        // One User Order API Get
        app.get('/userOrder/:email', async (req, res) => {
            const email = req.params.email;
            const cursor = userOrderCollection.find({ email });
            const myOrder = await cursor.toArray();
            res.send(myOrder);

        });

        app.get('/allServices', async (req, res) => {
            const result = await productCollection.find({}).toArray();
            res.send(result)
        })

        // Get Admin Email ID
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        });

        // Get ALLUser Reviews API
        app.get('/userReview', async (req, res) => {
            const result = await userReviewCollection.find({}).toArray();
            res.send(result);
        })


        // ALL POST API************


        // Add ALL Product API
        app.post('/addProduct', async (req, res) => {
            const addProduct = req.body;
            const result = await productCollection.insertOne(addProduct);
            res.json(result);

        })

        // Add Order Api
        app.post('/userBuy', async (req, res) => {
            const productOrder = req.body;
            const result = await userOrderCollection.insertOne(productOrder);
            res.json(result);

        })

        //  Post User API
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.json(result)

        });

        // POST User Review API
        app.post('/userReview', async (req, res) => {
            const review = req.body;
            const result = await userReviewCollection.insertOne(review);
            res.json(result)
        })


        // ALL DELETE API *************

        // Delete Single User Order
        app.delete('/userOrder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userOrderCollection.deleteOne(query);
            res.json(result);
            // console.log(result)
        });


        // Delete All Services
        app.delete('/allServices/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.json(result);
        });

        // DELETE All Manage Products
        app.delete('/allProduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = userOrderCollection.deleteOne(query);
            res.json(result);
            console.log(result)
        })



        // ALL PUT API***********

        // 
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user._id };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.json(result);

        })

        // 
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            // console.log('PUT', user);
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.json(result)
        });

        // Update Status Orders
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: "Shipped",
                },
            };
            const result = await userOrderCollection.updateOne(query, updateDoc);
            res.send(result);
            console.log(result);
        })


    }
    finally {
        // await client.close();
    }

}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(` listening ${port}`);
});