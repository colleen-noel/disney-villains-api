const Sequelize = require('sequelize')
const VillainsModel = require('./villains')

const connection = new Sequelize('disneyVillains', 'badGuys', 'B4dGuY$', {
  host: 'localhost', dialect: 'mysql'
})

const Villains = VillainsModel(connection, Sequelize)

module.exports = { Villains }
