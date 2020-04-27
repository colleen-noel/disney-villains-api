const models = require('../models')

const getAllVillains = async (request, response) => {
  const dbVillains = await models.Villains.findAll()

  return response.send(dbVillains.map(dbVillainToGetModel))
}

const getVillainBySlug = async (request, response) => {
  const { slug } = request.params

  const dbVillainSlug = await models.Villains.findOne({ where: { slug } })

  if (dbVillainSlug) {
    return response.send(dbVillainToGetModel(dbVillainSlug))
  }

  return response.sendStatus(404)
}

const addNewVillain = async (request, response) => {
  const { name, movie, slug } = request.body

  if (!name || !movie || !slug) {
    return response.sendStatus(404)
  }
  const newVillain = await models.Villains.create({ name, movie, slug })

  return response.status(201).send(newVillain)
}

const dbVillainToGetModel = (dbVillain) => ({
  name: dbVillain.name,
  movie: dbVillain.movie,
  slug: dbVillain.slug
})


module.exports = { getAllVillains, getVillainBySlug, addNewVillain }
