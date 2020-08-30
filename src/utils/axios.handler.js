const axios = require('axios');
require('dotenv').config();

function getTeamIDs() {

    return axios.get('http://api.football-data.org/v2/competitions/2021/teams', { 
        headers: {
            'X-Auth-Token': process.env.FOOTBALL_API_TOKEN
        }
    }).then(data => {
        var teams = data.data.teams;
        var ids = {};

        teams.forEach(team => {
            ids[team.name] = team.id;
        });
        return Promise.resolve(ids);
    }).catch(e => {
        return Promise.reject(ids);(e);
    });
}


function getTeamFixtures(ids, teamName) {

    return axios.get(`http://api.football-data.org/v2/teams/${ids[teamName]}/matches`, {
        headers: {
            'X-Auth-Token': process.env.FOOTBALL_API_TOKEN,
        }
    }).then(data => {
        var matches = data.data.matches;
        var filtered = matches.filter((match) => { return match.competition.id === 2021 });
        filtered = filtered.splice(0, 5);

        var resArr = []
        filtered.forEach((match) => {
            var obj = {
                'homeTeam': match.homeTeam.name,
                'awayTeam': match.awayTeam.name,
                'datetimeOfMatch': match.utcDate
            };
            resArr.push(obj);
        });
        return Promise.resolve(resArr);
    }).catch(e => {
        return Promise.reject(e);
    });
}

module.exports = { getTeamIDs, getTeamFixtures };