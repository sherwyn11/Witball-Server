const app = require('express')();
const server = require('http').createServer(app);
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const handler = require('./utils/wit.handler');
const client = require('./config/wit.config');
require('dotenv').config();

app.use(bodyParser.urlencoded({extended: true}));


///// routes /////

app.get('/', (req, res) => {
    res.send('Test Works!');
});

app.post('/', (req, res) => {
    const query = req.body.query;

    client
    .message(query)
    .then(res => handler.responseFromWit(res))
    .then(msg => {
        res.send({ 'fixtures': msg });
    })
    .catch(err => {
        console.error(
            'Oops! Got an error from Wit: ',
            err.stack || err
        );
    });
});

//// sockets to be implemented ////

const io = socketio(server);

io.on('connection', (socket) => {
    console.log('Connected!');
    socket.on('send_query', (query) => {
        console.log(query);
    });
});

const port = process.env.PORT || 8000;

server.listen(port, () => {
    console.log('Server is up on port ' + port);
});