const fs = require('fs');

function getTeamName(data, ids) {
    var teamNames = Object.keys(ids);
    var teamArr = data.entities['team_name:team_name'];
    var teamName;

    try{
        teamArr.forEach((arr) => {
            if(teamNames.includes(arr.value)) {
                teamName = arr.value;
            }
        });
        return teamName;

    }catch(e) {
        return undefined;
    }

}

function getTeamID(data, ids) {
    var teamNames = Object.keys(ids);
    var teamArr = data.entities['team_name:team_name'];
    var teamID = undefined;

    try{
        if(teamArr !== undefined) {
            teamArr.forEach((arr) => {
                if(teamNames.includes(arr.value)) {
                    teamID = ids[arr.value];
                }
            });
        }
        return teamID;

    } catch(e) {
        return undefined;
    }
}

function getTeamNameFromID(id, ids) {
    var teamNames = Object.keys(ids);
    var teamName;

    for(const team of teamNames) {
        if(ids[team] === id){
            teamName = team
            break;
        }
    }

    return teamName;
}

function getTrait(traits) {
    var traitNames = Object.keys(traits);
    var max = 0;
    var fin;

    for(const trait of traitNames) {
        if(traits[trait][0].confidence >= max) {
            max = traits[trait][0].confidence;
            traits[trait][0]['name'] = trait;
            fin = traits[trait];
        }
    }

    return fin[0];
}

function getRandomFact() {
    let rawdata = fs.readFileSync('./src/data/data.json');
    let facts = JSON.parse(rawdata).facts;
    let num = Math.floor(Math.random() * 100) % facts.length;

    return facts[num].fact
}

module.exports = { getTeamName, getTeamID, getTeamNameFromID, getTrait, getRandomFact };