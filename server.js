import 'dotenv/config'
import http from 'node:http'
import debugLib from 'debug'
import app from './app.js'


const debug = debugLib('nodeapp:server')

const port = process.env.PORT || 3000
//arrancar  servidor

const server = http.createServer(app)

server.on('error', err => console.error(err))
server.on('listening', () =>{console.log(`Servidor iniciado en puerto ${port}`)})
server.listen(port)