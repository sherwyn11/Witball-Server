const app = require('express')();
const server = require('http').createServer(app);
const socketio = require('socket.io');
const bodyParser = require('body-parser');
// const redis = require('redis');
const handler = require('./utils/wit.handler');
const client = require('./config/wit.config');
const { getTeamIDsAndCrestUrls } = require('./utils/axios.handler');
require('dotenv').config();

///// Init /////

app.use(bodyParser.urlencoded({ extended: true }));
// const redisClient = redis.createClient();
var data;
var ids = undefined;
var crestUrls = undefined;

///// Store team ID's on Server //////

async function cache(req, res, next) {
    if (data === undefined) {
        data = await getTeamIDsAndCrestUrls();
        ids = data.ids;
        crestUrls = data.crestUrls;
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
        .then(res => handler.responseFromWit(res, ids, crestUrls))
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

io.on('connection', async (socket) => {
    console.log('Connected!');
    data = await getTeamIDsAndCrestUrls();
    ids = data.ids;
    crestUrls = data.crestUrls;

    socket.on('send_query', async (query) => {

        client
            .message(query.message)
            .then(res => handler.responseFromWit(res, ids, crestUrls))
            .then(msg => {
                socket.emit('receive_message', msg);
            })
            .catch(err => {
                console.error(
                    'Oops! Got an error from Wit: ',
                    err.stack || err
                );
                socket.emit('receive_message', err);
            });
    });
});

const port = process.env.PORT || 8000;

server.listen(port, () => {
    console.log('Server is up on port ' + port);
});