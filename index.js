const { Router } = require('express')
const express = require('express')
const app = express();
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')

dotenv.config()

mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true,
      useUnifiedTopology: true } ,
    (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log('connected to db')
        }
    })
//bodyParser was added back to Express in release 4.16.0, because people wanted it bundled with Express like before. That means you don't have to use bodyParser.json() anymore if you are on the latest release. You can use express.json() instead.
app.use(express.json())

app.use('/api/user', authRoute)

app.use('/api/posts', postRoute)


app.listen(3000, () => console.log('server up'))