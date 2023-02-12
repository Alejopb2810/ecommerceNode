require('dotenv').config();

//importamos el modelo
const Server = require('./models/server');

//instanciamos el servidor o la clase
const server = new Server();

//pongo a escuchar mi servidor
server.listen();
// get    post    put  patch    delete
// obtener  enviar    actualizar    borrar
