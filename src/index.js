const app = require('express')();
const server = require('http').createServer(app);
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const redis = require('redis');
const handler = require('./utils/wit.handler');
const client = require('./config/wit.config');
const { getTeamIDs } = require('./utils/axios.handler');
require('dotenv').config();

///// Init /////

app.use(bodyParser.urlencoded({extended: true}));
const redisClient = redis.createClient();
var ids;

///// Checking Redis-Cache //////

function cache(req, res, next) {
    redisClient.get('ids', async (err, data) => {
        if(err) throw err;

        if(data != null) {
            ids = JSON.parse(data);
        }else{
            ids = await getTeamIDs();
            redisClient.setex('ids', 3600, JSON.stringify(ids));
        }
        next();
    });
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