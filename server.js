const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@practice.hzw3v.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

const app = express()

app.use(bodyParser.json())
app.use(cors())

const port = process.env.PORT || 5000

app.get('/', (req, res) => {
    res.send('Root Directory !')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("ecommerce-with-server").collection("ecommerceBackend");
    const orderCollection = client.db("ecommerce-with-server").collection("orders");
    console.log('database connected')

    // API for different operations

    // Getting all products
    app.get('/products', (req, res) => {
        productCollection.find({})
            .toArray((err, product) => {
                res.send(product)
            })
    })

    // Getting a Single Product by key
    app.get('/product/:key', (req, res) => {
        productCollection.find({ key: req.params.key })
            .toArray((err, product) => {
                res.send(product[0])
            })
    })

    // Getting many products by their key
    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body
        productCollection.find({ key: { $in: productKeys } })
            .toArray((err, products) => {
                res.send(products)
            })
    })

    // Adding a new product
    app.post('/addProduct', (req, res) => {
        const product = req.body
        productCollection.insertOne(product)
            .then(res => res.send(res.insertedCount))
    })

    // Adding order
    app.post('/order', (req, res) => {
        const order = req.body
        orderCollection.insertOne(order)
            .then(res => res.send(res.insertedCount))
    })

});

app.listen(port, () => console.log('Server Connected'))
