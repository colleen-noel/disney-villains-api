/* eslint-disable max-len */
const {
  describe, it, before, afterEach, beforeEach
} = require('mocha')
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const models = require('../../models')
const { villainsList, singleVillain, addedVillain, incompleteVillain } = require('../mocks/villains')
const { getAllVillains, getVillainBySlug, addNewVillain } = require('../../controllers/villains')


chai.use(sinonChai)
const { expect } = chai

describe('Controllers - villains', () => {
  let sandbox
  let stubbedFindOne
  let stubbedSend
  let stubbedStatus
  let stubbedSendStatus
  let stubbedStatusSend
  let response
  let stubbedCreate

  before(() => {
    sandbox = sinon.createSandbox()

    stubbedFindOne = sandbox.stub(models.Villains, 'findOne')
    stubbedSend = sandbox.stub()
    stubbedStatus = sandbox.stub()
    stubbedSendStatus = sandbox.stub()
    stubbedStatusSend = sandbox.stub()
    stubbedCreate = sandbox.stub(models.Villains, 'create')


    response = {
      send: stubbedSend,
      sendStatus: stubbedSendStatus,
      status: stubbedStatus
    }
  })

  beforeEach(() => {
    stubbedStatus.returns({ send: stubbedStatusSend })
  })

  afterEach(() => {
    sandbox.reset()
  })

  describe('getAllVillains', () => {
    it('retrieves a list of villains from the database and calls response.send() with the list', async () => {
      const stubbedFindAll = sinon.stub(models.Villains, 'findAll').returns(villainsList)

      await getAllVillains({}, response)

      expect(stubbedFindAll).to.have.callCount(1)
      expect(stubbedSend).to.have.been.calledWith(villainsList)
    })
  })

  describe('getVillainBySlug', () => {
    it('retrieves the villain associated with the provided slug from the database, and calls response.send with it', async () => {
      const request = { params: { slug: 'gaston' } }

      stubbedFindOne.returns(singleVillain)

      await getVillainBySlug(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({
        attributes: ['name', 'movie', 'slug'],
        where: { slug: 'gaston' }
      })
      expect(stubbedSend).to.have.been.calledWith(singleVillain)
    })

    it('returns a 404 when no villain is found', async () => {
      const request = { params: { slug: 'not-found' } }

      stubbedFindOne.returns(null)
      await getVillainBySlug(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({
        attributes: ['name', 'movie', 'slug'],
        where: { slug: 'not-found' }
      })
      expect(stubbedSendStatus).to.have.been.calledWith(404)
    })
  })

  describe('addNewVillain', () => {
    it('accepts new villain details and saves them as a new villain in the database, returning the saved record with a 201 status', async () => {
      const request = { body: addedVillain }

      stubbedCreate.returns(addedVillain)

      await addNewVillain(request, response)

      expect(stubbedCreate).to.have.been.calledWith(singleVillain)
      expect(stubbedStatus).to.have.been.calledWith(201)
      expect(stubbedStatusSend).to.have.been.calledWith(addedVillain)
    })

    it('sends a 404 when the villain is not created', async () => {
      const request = { body: incompleteVillain }

      stubbedCreate.returns(incompleteVillain)

      await addNewVillain(request, response)

      expect(stubbedCreate).to.not.have.been.calledWith(incompleteVillain)
      expect(stubbedSendStatus).to.have.been.calledWith(404)
    })
  })
})


