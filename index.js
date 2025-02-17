const { json } = require('body-parser')
const express = require('express')
const fs = require('fs')
const jsYaml = require('js-yaml')
const {OpenApiValidator} = require('express-openapi-validate')
const app = express()
const port = 3000


const openApiDocument =jsYaml.load(
    fs.readFileSync('./spec/api.spec.yaml','utf-8')
);

const validator = new OpenApiValidator(openApiDocument,
    {
        ajvOptions:{
            allErrors: true,
            removeAdditional: 'all'
        }
    });

app.use(express.json())



app.post('/:dataset/:version/records',validator.validate("post",'/{dataset}/{version}/records'),(req,res,next)=>{
    
    
    const {dataset,version} = req.params
    
    res.send(`Got a post request, dataset ${dataset}, version ${version} body ${JSON.stringify(req.body)}`)
})

app.get('/', (req, res) => {
    res.setHeader('X-Request-Id','hello')
    res.json({version: '1.0.0'})
});

app.use((err,req,res,next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error:{
            name:err.name,
            message: err.message,
            data:err.data
        },

    })

});

app.listen(port,() =>{
    console.log(`Example listening on ${port}`)
})

module.exports = app