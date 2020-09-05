const app = require('express')();
const server = require('http').createServer(app);
const socketio = require('socket.io');
const bodyParser = require('body-parser');
// const redis = require('redis');
const handler = require('./utils/wit.handler');
const client = require('./config/wit.config');
const { getTeamIDs } = require('./utils/axios.handler');
require('dotenv').config();

///// Init /////

app.use(bodyParser.urlencoded({ extended: true }));
// const redisClient = redis.createClient();
var ids = undefined;

///// Checking Redis-Cache //////

async function cache(req, res, next) {
    if (ids === undefined) {
        console.log('Getting ids');
        ids = await getTeamIDs();
    }
    next();
}

///// routes /////

app.get('/', (req, res) => {
    res.send('Test Works!');
});

app.post('/', cache, (req, res) => {
    const query = req.body.query;

    client
        .message(query)
        .then(res => handler.responseFromWit(res, ids))
        .then(msg => {
            res.send(msg);
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

io.on('connection', cache, (socket) => {
    console.log('Connected!');

    socket.on('send_query', async(query) => {
        console.log(query.message);
        client
            .message(query.message)
            .then(res => handler.responseFromWit(res, ids))
            .then(msg => {
                console.log(msg);
                socket.broadcast.emit('receive_message', msg);
            })
            .catch(err => {
                console.error(
                    'Oops! Got an error from Wit: ',
                    err.stack || err
                );
                socket.broadcast.emit('receive_message', err);
            });
    });
});

const port = process.env.PORT || 8000;

server.listen(port, () => {
    console.log('Server is up on port ' + port);
});