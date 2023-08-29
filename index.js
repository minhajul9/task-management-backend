const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb');

//middleware
app.use(cors())
app.use(express.json())

//code 
app.get('/', (req, res) =>{
    res.send('Task management server running')
})

//mongodb



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.yhec9tq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //create db and collections
    const database = client.db("taskManagement");
    const usersCollection = database.collection("users");
    const taskCollection = database.collection('tasks')

    //create user
    app.post('/users', async (req, res) => {
        const user = req.body;
        const query = { email: user.email }
        console.log(user);
        const consisting = await usersCollection.findOne(query);
        if (consisting) {
          return res.send(consisting)
        }
        const result = await usersCollection.insertOne(user)
        res.send(result)
      })


      // task management
      app.post('/tasks', async(req, res) =>{
        const task = req.body;
        // console.log(task);
        const result = await taskCollection.insertOne(task)
        res.send(result)
      })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => console.log(port))