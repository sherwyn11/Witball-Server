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
        return Promise.reject(e);
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

function getTeamScore(teamName) {

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear().toString();

    if(dd < 10) { 
        dd = '0' + dd; 
    } 

    if(mm < 10) { 
        mm = '0' + mm; 
    } 

    var formattedDate = yyyy + '-' + mm + '-' + dd;

    return axios.get(`http://api.football-data.org/v2/competitions/2021/matches?dateFrom=${formattedDate}&dateTo=${formattedDate}`, {
        headers: {
            'X-Auth-Token': process.env.FOOTBALL_API_TOKEN
        }
    }).then(data => {
        var matches = data.data.matches;
        var score = {};

        for(const match of matches) {
            if(match.homeTeam.name === teamName || match.awayTeam.name === teamName) {
                score = match.score;
                break;
            }
        }
        return Promise.resolve(score);
    }).catch(e => {
        return Promise.reject(e);
    });
}


function getTeamPlayers(id) {

    return axios.get(`http://api.football-data.org/v2/teams/${id}`, {
        headers: {
            'X-Auth-Token': process.env.FOOTBALL_API_TOKEN
        }
    }).then(data => {
        var players = data.data.squad;
        var resArr = [];

        players.forEach((player) => {
            let obj = {
                'name': player.name,
                'position': player.position === null ? "Manager" : player.position,
                'nationality': player.nationality
            }
            resArr.push(obj);
        })

        return Promise.resolve(resArr);
    }).catch(e => {
        return Promise.reject(e);
    });
}

module.exports = { getTeamIDs, getTeamFixtures, getTeamScore, getTeamPlayers };