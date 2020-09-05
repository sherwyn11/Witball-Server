const { getTeamFixtures, getTeamScore, getTeamPlayers } = require('./axios.handler');
const { getTeamName, getTeamID, getTeamNameFromID } = require('../helpers/data.helper');
const { getTeamIDs } = require('./axios.handler');
require('dotenv').config();

async function responseFromWit(data) {

    const intent = data.intents.length > 0 && data.intents[0] || '__foo__';
    var ids = await getTeamIDs();

    switch (intent.name) {
        case 'get_score':
            return handleGetScore(data, ids);
        case 'get_fixtures':
            return handleGetFixtures(data, ids);
        case 'get_players':
            return handlerGetPlayers(data, ids);
    }
    
    return handleGibberish();
}
  
function handleGibberish() {
    return Promise.resolve(
        "Ask me something like 'What is the current score of Manchester City?' or 'Fixtures of Arsenal?'"
    );
}


async function handleGetFixtures(data, ids) {

    let teamName = getTeamName(data, ids);
    var fixtures = await getTeamFixtures(ids, teamName);   

    return { fixtures: fixtures, intent: 'get_fixtures', teamName: teamName }; 
}

async function handleGetScore(data, ids) {

    let teamName = getTeamName(data, ids);
    var score = await getTeamScore(teamName);

    return { score: score, intent: 'get_score', teamName: teamName };
}
  
async function handlerGetPlayers(data, ids) {

    let teamID = getTeamID(data, ids);
    let teamName = getTeamNameFromID(teamID, ids);
    var players = await getTeamPlayers(teamID);

    return { players: players, intent: 'get_score', teamName: teamName };
}


exports.responseFromWit = responseFromWit;
  