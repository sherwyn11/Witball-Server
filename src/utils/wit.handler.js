const { getTeamIDs, getTeamFixtures, getTeamScore } = require('./axios.handler');
require('dotenv').config();

function responseFromWit(data) {

    const intent = data.intents.length > 0 && data.intents[0] || "__foo__";
    
    switch (intent.name) {
        case "get_score":
            return handleGetScore(data);
        case "get_fixtures":
            return handleGetFixtures(data);
    }
    
    return handleGibberish();
}
  
function handleGibberish() {
    return Promise.resolve(
        "Ask me something like 'What is the current score of Manchester City?' or 'Fixtures of Arsenal?'"
    );
}
  
async function handleGetFixtures(data) {

    var ids = await getTeamIDs();
    var teamNames = Object.keys(ids);
    var teamArr = data.entities['team_name:team_name'];

    teamArr.forEach((arr) => {
        if(teamNames.includes(arr.value)) {
            teamName = arr.value;
        }
    });

    var fixtures = await getTeamFixtures(ids, teamName);   

    return {fixtures: fixtures}; 
}

async function handleGetScore(data) {

    var ids = await getTeamIDs();
    var teamNames = Object.keys(ids);
    var teamArr = data.entities['team_name:team_name'];

    teamArr.forEach((arr) => {
        if(teamNames.includes(arr.value)) {
            teamName = arr.value;
        }
    });

    var score = await getTeamScore(teamName);
    
    return { score: score};
}
  
exports.responseFromWit = responseFromWit;
  