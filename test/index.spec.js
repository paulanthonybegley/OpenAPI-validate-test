const request = require('supertest')
const { expect } = require('chai')

const jsYaml = require('js-yaml')
const fs = require('fs')
const appRoot = require('app-root-path')
const { OpenApiValidator } = require('express-openapi-validate')

// Load the OpenAPI document
const openApiDocument 
    = jsYaml.load(fs.readFileSync(`./spec/api.yaml`, "utf-8"));

// Create the validator from the spec document
const validator = new OpenApiValidator(openApiDocument, {});

const app = require('../index')

describe('index', function () {
    // Create the response validator for the GET / endpoint
    const validateResponse = validator.validateResponse('get', '/')

    it('should return a valid response', function () {
        return request(app)
            .get('/')
            .expect(200)
            .then((res) => {
                expect(validateResponse(res)).to.be.undefined //validate
            })
            .catch((err) => expect(err).to.be.undefined)
    })
})