const app = require('express')()
const db = require('./db');

//get 1 release group
//fetch the listening count using the mbid (gid)
//insert the listening count with the release_group id into release_listening_counts

TOKEN = '862e176d-210b-4010-bb70-a8e2cfbefb88'
AUTH_HEADER = {
  "Authorization": `Token ${TOKEN}`
}
const requestOptions = {
  headers: AUTH_HEADER,
  method: 'GET'
}

async function getEveryReleaseGroup() {
  try {
    const release_groups = await db.query('SELECT * FROM musicbrainz.release_group')
    return release_groups.rows
  } catch(err) {
    console.error(err);
    return []
  }
}

async function fetchDataFromListenbrainz(release) {
  try {
    const response = await fetch(`https://api.listenbrainz.org/1/stats/release-group/${release.gid}/listeners`, requestOptions);
    
    const remainingRequests = parseInt(response.headers.get('x-ratelimit-remaining'));
    const resetInterval = parseInt(response.headers.get('x-ratelimit-reset-in'));
    
    if (remainingRequests === 1 && resetInterval > 0) {
      console.log(`Rate limit reached. Waiting for ${resetInterval} seconds...`);
      await new Promise(resolve => setTimeout(resolve, resetInterval * 1000));
    }


    const data = await response.json()
    
    return data.payload.total_listen_count || 0;
  } catch (error) {
    console.error(`Failed to fetch data for release group ${release.name}: ${error.message}`);
    return 0;
  }
}

async function insertListeningCount(release) {
  try {
    const query = 'INSERT INTO musicbrainz.release_group_listening_count (id, listening_count, last_updated) VALUES ($1, $2, NOW())';
    await db.query(query, [release.id, release.listening_count]);
  } catch (error) {
    console.error(`Error inserting data for release group ${release.name}: ${error.message}`);
  }
}

async function hasData(release) {
  try {
    const query = `SELECT COUNT(*) FROM musicbrainz.release_group_listening_count WHERE id = ${release.id}`
    const result = await db.query(query)
    const count = result.rows[0].count

    if (count == 0)
    {
      return false
    }
    else {
      console.log(`${release.name} listening count already exists`)
      return true

    }
  } catch(error) {
    console.error('Unexpected error at checking for release_group:', error);
  }
}

async function main (){
 const release_groups = await getEveryReleaseGroup()
 const dbLength = release_groups.length
 for (const [index, release] of release_groups.entries())
 {
  console.log(`${index}/${dbLength} Collecting data for ${release.name}...`)
  if (! (await hasData(release)))
  {
    release.listening_count = await fetchDataFromListenbrainz(release);
    await insertListeningCount(release)
  }
 }
}

main()
  .then(() => console.log('Finished fetching and inserting listening counts'))
  .catch(error => console.error('Error:', error.message) )
