const express = require('express')
const { getAllVillains, getVillainBySlug, addNewVillain } = require('./controllers/villains')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())


app.get('/villains', getAllVillains)

app.get('/villains/:slug', getVillainBySlug)

app.post('/villains', bodyParser.json(), addNewVillain)


app.all('*', (request, response) => {
  return response.sendStatus(404)
})

app.listen(4004)

