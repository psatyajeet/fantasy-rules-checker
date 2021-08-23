import axios from 'axios';
import dotenv from 'dotenv';
import url from 'url';
import xml2js from 'xml2js';

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

async function parseXml(xml) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, (err, result) => {
      if (err) {
        reject(err);
      }

      resolve(result);
    });
  });
}

async function makeRequest(urlString): Promise<any> {
  const params = new url.URLSearchParams({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: "oob",
    refresh_token: process.env.REFRESH_TOKEN,
    grant_type: "refresh_token",
  });

  const {
    data: { access_token: accessToken },
  } = await axios.post(
    `https://api.login.yahoo.com/oauth2/get_token`,
    params.toString()
  );

  const { data } = await axios({
    method: "get",
    headers: { Authorization: `Bearer ${accessToken}` },
    url: urlString,
  });

  const jsonData = await parseXml(data);
  return jsonData;
}

async function getTeamsInLeague(leagueId) {
  const result = await makeRequest(
    `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueId}/standings`
  );

  const teams = result.fantasy_content.league[0].standings[0].teams[0].team;

  return teams;
}

async function getTeamRoster(teamId) {
  const result = await makeRequest(
    `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamId}/roster/players`
  );

  const { name, roster } = result.fantasy_content.team[0];

  return { name: name[0], players: roster[0].players };
}

export async function checkTeamRosters() {
  const leagueId = process.env.LEAGUE_ID;

  const teams = await getTeamsInLeague(leagueId);


  for (const team of teams) {
    const { name, players } = await getTeamRoster(team.team_key);
    console.log(name, players);
  }
}

