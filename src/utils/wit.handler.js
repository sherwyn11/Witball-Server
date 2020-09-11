const { getTeamFixtures, getTeamScore, getTeamPlayers } = require('./axios.handler');
const { getTeamName, getTeamID, getTeamNameFromID, getTrait } = require('../helpers/data.helper');
require('dotenv').config();

async function responseFromWit(data, ids, crestUrls) {

    const intent = data.intents.length > 0 && data.intents[0] || '__foo__';


    if(intent === '__foo__') {
        let trait = Object.keys(data.traits).length === 0 ? '__foo__' : getTrait(data.traits);

        switch(trait.name) {
            case 'wit$thanks':
                return { intent: 'thanks', 'message': 'Anytime!', type: 'string' };
            case 'wit$greetings':
                return { intent: 'greeting', 'message': 'Hello there!', type: 'string' };
            case 'wit$bye':
                return { intent: 'bye', 'message': 'Bye-Bye!', type: 'string' };
        }

        return handleGibberish();
    }else{
        switch (intent.name) {
            case 'get_score':
                return handleGetScore(data, ids, crestUrls);
            case 'get_fixtures':
                return handleGetFixtures(data, ids, crestUrls);
            case 'get_players':
                return handleGetPlayers(data, ids, crestUrls);
            case 'get_info':
                return handleGetInfo();
            case 'get_work':
                return handleGetWork();
        }

        return handleGibberish();
    }
}
  
function handleGibberish() {
    return {
        intent: 'gibberish',
        message: "Sorry! I didn't get that! Ask me something like 'What is the current score of Manchester City?' or 'Fixtures of Arsenal?' or 'Players of Chelsea FC?'",
        type: 'string'
    };
}


async function handleGetFixtures(data, ids, crestUrls) {

    let teamName = getTeamName(data, ids);
    var fixtures = {};

    if(teamName === undefined) {
        return { type: 'string', message: 'Sorry! I couldn\'t resolve the team name', intent: 'error' }; 
    } else{
        fixtures = await getTeamFixtures(ids, teamName, crestUrls);   
    }

    return { object: fixtures, intent: 'get_fixtures', teamName: teamName, type: 'object' }; 
}

async function handleGetScore(data, ids, crestUrls) {

    let teamName = getTeamName(data, ids);
    var score = {};

    if(teamName === undefined) {
        return { type: 'string', message: 'Sorry! I couldn\'t resolve the team name', intent: 'error' }; 
    } else{
        score = await getTeamScore(teamName);
        if(Object.keys(score).length === 0) {
            return { message: `No matches of ${teamName} going on currently! Check back later!`, intent: 'get_score', teamName: teamName, type: 'string', crestUrl: crestUrls[teamName] }; 
        }
        return { object: score, intent: 'get_score', teamName: teamName, type: 'object', crestUrl: crestUrls[teamName] };
    }
}
  
async function handleGetPlayers(data, ids, crestUrls) {

    let teamID = getTeamID(data, ids);
    var players = {};

    if(teamID === undefined) {
        return { type: 'string', message: 'Sorry! I couldn\'t resolve the team name', intent: 'error' }; 
    }else{
        var teamName = getTeamNameFromID(teamID, ids);
        players = await getTeamPlayers(teamID);
    }

    return { object: players, intent: 'get_players', teamName: teamName, type: 'object', crestUrl: crestUrls[teamName] };
}

function handleGetInfo() {
    return { intent: 'info', 'message': "Hey there fellow Soccer-Geek! I am Witball! Your personal assistant. I have been created to bring you football info", type: 'string' };
}

function handleGetWork() {
    return { intent: 'work', 'message': "You can ask me anything related to football! Ask me something like 'What is the current score of Manchester City?' or 'Fixtures of Arsenal?' or 'Players of Chelsea FC?", type: 'string' };
}

exports.responseFromWit = responseFromWit;  