const models = require('../models')

const getAllVillains = async (request, response) => {
  try {
    const dbVillains = await models.Villains.findAll({ attributes: ['name', 'movie', 'slug'] })

    return response.send(dbVillains)
  } catch (error) {
    return response.status(500).send('Unable to retrieve data, please try again')
  }
}

const getVillainBySlug = async (request, response) => {
  try {
    const { slug } = request.params

    const dbVillainSlug = await models.Villains.findOne({
      attributes: ['name', 'movie', 'slug'],
      where: { slug: slug },
    })

    return dbVillainSlug
      ? response.send(dbVillainSlug)
      : response.sendStatus(404)
  } catch (error) {
    return response.status(500).send('Unable to retreive villain, please try again')
  }
}

const addNewVillain = async (request, response) => {
  try {
    const { name, movie, slug } = request.body

    if (!name || !movie || !slug) {
      return response.sendStatus(404)
    }
    const newVillain = await models.Villains.create({ name, movie, slug })

    return response.status(201).send(newVillain)
  } catch (error) {
    return response.status(500).send('Unable to add villain. Please try again')
  }
}



module.exports = { getAllVillains, getVillainBySlug, addNewVillain }
