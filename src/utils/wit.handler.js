const { getTeamFixtures, getTeamScore, getTeamPlayers } = require('./axios.handler');
const { getTeamName, getTeamID, getTeamNameFromID, getTrait } = require('../helpers/data.helper');
const { getTeamIDs } = require('./axios.handler');
require('dotenv').config();

async function responseFromWit(data) {

    const intent = data.intents.length > 0 && data.intents[0] || '__foo__';
    var ids = await getTeamIDs();


    if(intent === '__foo__') {
        let trait = Object.keys(data.traits).length === 0 ? '__foo__' : getTrait(data.traits);

        switch(trait.name) {
            case 'wit$thanks':
                return { intent: 'thanks', 'message': 'Anytime!', type: 'string' };
            case 'wit$greetings':
                return { intent: 'greetings', 'message': 'Hello there!', type: 'string' };
            case 'wit$bye':
                return { intent: 'bye', 'message': 'Bye-Bye!', type: 'string' };
        }

        return handleGibberish();
    }else{
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
}
  
function handleGibberish() {
    return {
        intent: 'random',
        text: "Sorry! I didn't get that! Ask me something like 'What is the current score of Manchester City?' or 'Fixtures of Arsenal?' or 'Players of Chelsea FC?'",
        type: 'string'
    };
}


async function handleGetFixtures(data, ids) {

    let teamName = getTeamName(data, ids);
    var fixtures = await getTeamFixtures(ids, teamName);   

    return { fixtures: fixtures, intent: 'get_fixtures', teamName: teamName, type: 'object' }; 
}

async function handleGetScore(data, ids) {

    let teamName = getTeamName(data, ids);
    var score = await getTeamScore(teamName);

    return { score: score, intent: 'get_score', teamName: teamName, type: 'object' };
}
  
async function handlerGetPlayers(data, ids) {

    let teamID = getTeamID(data, ids);
    let teamName = getTeamNameFromID(teamID, ids);
    var players = await getTeamPlayers(teamID);

    return { players: players, intent: 'get_players', teamName: teamName, type: 'object' };
}

exports.responseFromWit = responseFromWit;  