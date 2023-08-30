const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware
app.use(cors())
app.use(express.json())

//code 
app.get('/', (req, res) => {
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
      // console.log(user);
      const consisting = await usersCollection.findOne(query);
      if (consisting) {
        return res.send(consisting)
      }
      const result = await usersCollection.insertOne(user)
      res.send(result)
    })

    //get user info
    app.get('/users/:uid', async (req, res) => {
      const uid = req.params.uid;
      const query = { uid: uid };
      const result = await usersCollection.findOne(query);
      res.send(result)
    })

    


    // task management
    app.post('/tasks', async (req, res) => {
      const task = req.body;
      // console.log(task);
      const result = await taskCollection.insertOne(task)
      res.send(result)
    })

    // load all task
    app.get('/tasks', async (req, res) =>{
      const tasks = await taskCollection.find().toArray();
      // console.log(tasks);
      res.send(tasks)
    })

    //load task by email
    app.get('/tasks/:uid', async(req, res) =>{
      const query = {creatorId: req.params.uid};
      const result = await taskCollection.find(query).toArray();
      res.send(result)
    })

    //update user
    app.put('/user/:id', async(req, res) => {
      const query = {_id: new ObjectId(req.params.id)};
      const newUser = {
        $set: {
          doing: req.body.doing,
          done: req.body.done
        }
      }
      const result = await usersCollection.updateOne(query, newUser);
      // console.log(result);
      res.send(result)
    })

    //edit task
    app.put('/task/:id', async(req, res) => {
      const filter = {_id: new ObjectId(req.params.id)};
      const newTask = req.body;
      // console.log(newTask);
      const result = await taskCollection.replaceOne(filter, newTask)
      res.send(result)
    })

    //delete task
    app.delete('/task/:id', async(req, res) =>{
      const query = {_id: new ObjectId(req.params.id)}
      const result = await taskCollection.deleteOne(query);
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