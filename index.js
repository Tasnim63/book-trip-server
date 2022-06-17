const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// Setup MongoDB Database:
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7gqmj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Set Middleware:
app.use(express.json());
app.use(cors());

// Main Function For MongoDB:
async function run() {
        try {
                await client.connect();

                const database = client.db('Asia_Travel_Agency');
                const servicesCollection = database.collection('services');
                // Orders Collection:
                const orderCollection = database.collection('orders');

                // GET All Services API:
                app.get('/services', async (req, res) => {
                        const cursor = servicesCollection.find({});
                        const services = await cursor.toArray();
                        res.send(services);
                })

                // GET Single Services:
                app.get('/services/:id', async (req, res) => {
                        const id = req.params.id;
                        console.log("Getting Specific Service", id)
                        const query = { _id: ObjectId(id) };
                        const service = await servicesCollection.findOne(query);
                        res.json(service);
                })

                // POST API:
                app.post('/services', async (req, res) => {
                        const service = req.body;
                        console.log('Hit The API', service);

                        const result = await servicesCollection.insertOne(service);
                        console.log(result);
                        res.json(result);
                })

                // Orders Collection
                // Add Orders API:
                app.post('/orders', async (req, res) => {
                        const order = req.body;
                        const result = await orderCollection.insertOne(order)
                        res.json(result);
                })

                // GET ALL Orders:
                app.get('/orders', async (req, res) => {
                        const cursor = orderCollection.find({})
                        const orders = await cursor.toArray();
                        res.send(orders)
                })

                // Update Status:
                app.put('/orders/:id', async (req, res) => {
                        const id = req.params.id;
                        const updateStatus = req.body;
                        const filter = { _id: ObjectId(id) }
                        const options = { upsert: true };
                        // create a document that sets the plot of the movie
                        const updateDoc = {
                                $set: {
                                        status: 'Approved'
                                },
                        };
                        const result = await orderCollection.updateOne(filter, updateDoc, options);
                        console.log("Updating User", req)
                        res.json(result)
                })

                // Delete Operation:
                app.get('/orders/:id', async (req, res) => {
                        const id = req.params.id;
                        const query = { _id: ObjectId(id) };
                        const result = await orderCollection.findOne(query)
                        res.json(result);
                })

                app.delete('/orders/:id', async (req, res) => {
                        const id = req.params.id;
                        const query = { _id: ObjectId(id) };
                        const result = await orderCollection.deleteOne(query)
                        res.json(result);
                })
        }
        finally {
                // client.close();
        }
}
run().catch(console.dir);

app.get('/', async (req, res) => {
        res.send('Successfully Active Asia Travel Agency');
})

app.listen(port, () => {
        console.log('Successfully Active Asia Travel Agency on Port', port);
})
// Thank You