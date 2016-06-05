'use strict'

let express = require('express')
let app = express()
let port = 8080

app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
  res.redirect('/templates/new-index.html');
})

app.listen(port)
console.log(`App is running at port: ${port}`)