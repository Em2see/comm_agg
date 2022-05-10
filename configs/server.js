const jsonServer = require('json-server')
const fs = require('fs');
const multipart = require('C:/gitProjects/nodejs12/node_modules/connect-multiparty');
const path = require('path')
const express = require('express')
const server = jsonServer.create()
//const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const rawHtmlData = fs.readFileSync("./configs/notes_data.txt");
const rawJsonData = fs.readFileSync("./configs/notes_json_task.txt");

const getMethods = (obj) => Object.getOwnPropertyNames(obj).filter(item => typeof obj[item] === 'function')

var multipartMiddleware = multipart();
server.use(middlewares)
server.use(multipartMiddleware)
server.get('/scripts/*', express.static(path.join(__dirname, '../public')));

server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
server.use((req, res, next) => {
    if (req.method === 'POST') {
        req.body.createdAt = Date.now()
    }
    // Continue to JSON Server router
    next()
})

//server.get('/Remarks', (req, res) => {
//    if (req.url.match(/\/Remarks$/)) {
//        // res.jsonp(data);
//        res.send(rawHtmlData)
//    }
//})
server.get('/Remarks2', (req, res) => {
    if (req.url.match(/\/Remarks2/)) {
        // res.jsonp(data);
        res.send(rawJsonData)
    }
})

// Use default router
//server.use(router)
server.listen(3000, () => {
    console.log('JSON Server is running')
})