const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())

//code 
app.get('/', (req, res) =>{
    res.send('Task management server running')
})


app.listen(port, () => console.log(port))