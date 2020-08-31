function getTeamName(data, ids) {
    var teamNames = Object.keys(ids);
    var teamArr = data.entities['team_name:team_name'];
    var teamName;

    teamArr.forEach((arr) => {
        if(teamNames.includes(arr.value)) {
            teamName = arr.value;
        }
    });

    return teamName;
}

function getTeamID(data, ids) {
    var teamNames = Object.keys(ids);
    var teamArr = data.entities['team_name:team_name'];
    var teamID;

    teamArr.forEach((arr) => {
        if(teamNames.includes(arr.value)) {
            teamID = ids[arr.value];
        }
    });

    return teamID;
}

module.exports = { getTeamName, getTeamID };