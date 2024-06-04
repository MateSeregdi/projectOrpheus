const app = require("express")();
const cors = require("cors");
const db = require("./db");

app.use(cors());

app.get("/api", (req, res) => {
  console.log("success");
  res.status(200).json({ users: ["userOne", "userTwo", "userThree"] });
});

app.get("/api/release_group/details/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const releaseIdQuery = `
        WITH ReleaseTracks AS (
            SELECT 
                mr.id AS release_id,
                SUM(mm.track_count) AS total_track_count,
                MAX(CASE WHEN mr.quality = 2 THEN 2 
                         WHEN mr.quality = 1 THEN 1 
                         WHEN mr.quality = -1 THEN -1 
                         ELSE 0 END) AS priority
            FROM musicbrainz.release AS mr
            JOIN musicbrainz.release_group AS mrg ON mr.release_group = mrg.id
            JOIN musicbrainz.medium AS mm ON mr.id = mm.release
            WHERE mrg.id = ${id}
            GROUP BY mr.id
        )
        SELECT 
            release_id
        FROM (
            SELECT 
                release_id,
                total_track_count,
                priority,
                ROW_NUMBER() OVER (PARTITION BY total_track_count ORDER BY priority DESC) AS row_num
            FROM ReleaseTracks
        ) AS ranked_tracks
        WHERE row_num = 1;`;

    const isThereCoverArtQuery = (release_group_id) => {
      return `SELECT * 
        FROM musicbrainz.release_group_cover_art 
        WHERE id = ${release_group_id}
        GROUP BY id;`;
    };

    /**/
    const otherAlbumsByArtistQuery = `SELECT ma.name AS artist_name, ma.id AS artist_id, mrg.id AS release_group_id, mrg.name AS release_group_name, mrg.gid AS mbid
        FROM musicbrainz.artist_credit AS mac 
        JOIN musicbrainz.artist_credit_name AS macn ON mac.id = macn.artist_credit 
        JOIN musicbrainz.release_group AS mrg ON mrg.artist_credit = mac.id 
        JOIN musicbrainz.artist as ma ON ma.id=macn.artist 
        JOIN musicbrainz.release_group_listening_count AS mrglc ON mrglc.id = mrg.id 
        WHERE ma.id=(
            SELECT ma.id 
            FROM musicbrainz.artist_credit AS mac 
            JOIN musicbrainz.artist_credit_name AS macn ON mac.id = macn.artist_credit 
            JOIN musicbrainz.release_group AS mrg ON mrg.artist_credit = mac.id 
            JOIN musicbrainz.artist as ma ON ma.id=macn.artist 
            WHERE mrg.id = ${id}
        ) AND macn.position=0 AND mrg.type=1
        ORDER BY mrglc.listening_count DESC
        LIMIT 7;`;
    //listening counts todo

    const releaseDetailsQuery = (
      releaseId
    ) => `SELECT ma.name AS artistName, ma.id AS artistId, ma.begin_date_year, ma.end_date_year,
        ma.gender AS artistGender, ma.ended AS artistEnded, mar.name AS areaName, mar.id AS areaID,
        ml.id AS languageId, ml.name AS language, mr.id AS releaseID, mr.name AS releaseName, mrg.gid AS mbid,
        mrg.name AS release_group_name, mrg.id AS release_group_id, mrc.date_year, mrc.date_month, mrc.date_day
        FROM musicbrainz.artist_credit AS mac 
        JOIN musicbrainz.artist_credit_name AS macn ON mac.id = macn.artist_credit 
        JOIN musicbrainz.release_group AS mrg ON mrg.artist_credit = mac.id 
        JOIN musicbrainz.artist as ma ON ma.id=macn.artist 
        JOIN musicbrainz.release AS mr ON mr.release_group = mrg.id
        LEFT JOIN musicbrainz.release_label AS mrl ON mrl.release = mr.id
        LEFT JOIN musicbrainz.release_country AS mc ON mc.release = mr.id
        LEFT JOIN musicbrainz.area AS mar ON mar.id = ma.area
        LEFT JOIN musicbrainz.language AS ml ON ml.id = mr.language
        LEFT JOIN musicbrainz.release_country AS mrc ON mrc.release = mr.id
        WHERE mr.id = ${releaseId}
        ORDER BY mr.id ;`;

    const tracksQuery = (
      releaseId
    ) => `SELECT mr.id AS recording_id, mr.name AS recording_name, mac.name AS artist_credit_name,
        mac.id AS artist_credit_id, mr.length, mt.position, mm.position AS medium_position 
        FROM musicbrainz.recording AS mr
        JOIN musicbrainz.track AS mt ON mt.recording = mr.id
        JOIN musicbrainz.medium AS mm ON mt.medium = mm.id
        JOIN musicbrainz.release AS mre ON mre.id = mm.release
        JOIN musicbrainz.artist_credit AS mac ON mac.id = mr.artist_credit
        WHERE mre.id = ${releaseId} ;`;

    const artistsOnTracksQuery = (
      trackId
    ) => ` SELECT mt.id AS track_id, macn.*, ma.gid AS mbid
        FROM musicbrainz.track AS mt 
        JOIN musicbrainz.artist_credit AS mac ON mac.id = mt.artist_credit 
        JOIN musicbrainz.artist_credit_name AS macn ON macn.artist_credit = mac.id 
        JOIN musicbrainz.recording AS mre ON mre.id = mt.recording
        JOIN musicbrainz.artist AS ma ON ma.id = macn.artist
        WHERE mre.id = ${trackId}; `;

    const releaseIdResult = await db.query(releaseIdQuery);
    const otherAlbumsByArtistResult = await db.query(otherAlbumsByArtistQuery);

    const releaseIds = releaseIdResult.rows;
    const otherAlbumsByArtist = otherAlbumsByArtistResult.rows;

    const firstReleaseId = releaseIds[0].release_id;
    const releaseGroupDataResult = await db.query(
      releaseDetailsQuery(firstReleaseId)
    );
    const releaseGroupData = releaseGroupDataResult.rows[0];

    const noCoverArtUrl =
      "https://media.istockphoto.com/photos/vinyl-record-with-blank-cover-picture-id469724807?k=6&m=469724807&s=170667a&w=0&h=Z1d0cDuZzjEuc62gy74iArN4oU7SbDmlc4Xeuv-87wA=";

    const getCoverArt = async ({ mbid, release_group_id, artist_id }) => {
      const isThereCoverArtResult = await db.query(
        isThereCoverArtQuery(release_group_id)
      );
      const isThereCoverArt = isThereCoverArtResult.rows;

      if (isThereCoverArtResult.rowCount > 0) {
        return isThereCoverArt[0].cover_art;
      }

      const response = await fetch(
        `https://coverartarchive.org/release-group/${mbid}`
      );

      const data = await response.json();

      let coverArtUrl = "";

      if (data.images && data.images.length > 0) {
        coverArtUrl = data.images[0].image;
      } else {
        coverArtUrl = noCoverArtUrl;
      }

      const query = release_group_id
        ? {
            text: "INSERT INTO musicbrainz.release_group_cover_art (id, cover_art) VALUES ($1, $2)",
            values: [release_group_id, coverArtUrl],
          }
        : {
            text: "INSERT INTO musicbrainz.artist_cover_art (id, cover_art) VALUES ($1, $2)",
            values: [artist_id, coverArtUrl],
          };
        console.log(query)
      await db.query(query);
      return coverArtUrl;
    };

    await Promise.all(
      otherAlbumsByArtist.map(async (release) => {
        try {
          if (!release.cover_art) {
            const cover_art = await getCoverArt({
              mbid: release.mbid,
              release_group_id: release.release_group_id,
            });
            release.cover_art = cover_art;
          }
        } catch (error) {
          release.cover_art = noCoverArtUrl;
          console.error("Error fetching cover art:", error.message);
        }
      })
    );
    const coverArtUrl = await getCoverArt({
      mbid: releaseGroupData.mbid,
      release_group_id: id,
    });

    let details = {
      releases: [],
      artist: {
        name: releaseGroupData?.artistname,
        id: releaseGroupData?.artistid,
        begin_year: releaseGroupData?.begin_year,
        end_year: releaseGroupData?.end_year,
        gender: releaseGroupData?.artistgender,
        ended: releaseGroupData?.artistended,
      },
      area: {
        name: releaseGroupData?.areaname,
        id: releaseGroupData?.areaid,
      },
      language: {
        name: releaseGroupData?.language,
        id: releaseGroupData?.languageid,
      },
      otherAlbumsByArtist: otherAlbumsByArtist,
      date: {},
      cover_art: coverArtUrl,
    };

    let artistsOnReleaseGroup = [];
    let earliestDate = new Date();

    const promises = releaseIds.map(async ({ release_id }, index) => {
      const releaseDetailsResult = await db.query(
        releaseDetailsQuery(release_id)
      );
      const releaseDetails = releaseDetailsResult.rows;
      const seenReleaseIds = new Set();

      releaseDetails.forEach((release) => {
        let i = 0;
        let date = new Date();
        do {
          release[i]
            ? (date = new Date(
                `${release[i].date_year}-${release[i].date_month}-${release[i].date_day}`
              ))
            : (date = new Date(
                `${release.date_year}-${release.date_month}-${release.date_day}`
              ));
          i++;
        } while ((date === undefined || date === null) && i < 100);
        if (date < earliestDate) {
          // Update earliest date if current date is earlier
          earliestDate = date;
        }
      });

      // Filter the exampleData array to keep only the unique elements based on releaseid
      const uniqueData = releaseDetails.filter((item) => {
        // Check if the current releaseid is already in the Set
        if (seenReleaseIds.has(item.releaseId)) {
          return false; // If yes, skip this item
        } else {
          // If not, add the releaseid to the Set and return true to keep this item
          seenReleaseIds.add(item.releaseId);
          return true;
        }
      });

      const promises = uniqueData.map(async (release) => {
        tracksResult = await db.query(tracksQuery(release_id));
        release.tracks = tracksResult.rows;
      });
      await Promise.all(promises);

      uniqueData.forEach(async (data) => {
        const release = {
          id: data?.releaseid,
          name: data?.releasename,
          mbid: data?.mbid,
          tracks: data?.tracks,
        };

        const promise = release.tracks.map(async (track) => {
          const artistsOnTracksResult = await db.query(
            artistsOnTracksQuery(track.recording_id)
          );
          const artistsOnTracks = artistsOnTracksResult.rows;
          artistsOnTracks.forEach((artist) =>
            artistsOnReleaseGroup.push(artist)
          );
        });
        Promise.all(promise);

        //details.artistsOnTracks = uniqueArtists
        details.releases.push(release);
      });
    });

    await Promise.all(promises);
    const idSet = new Set();
    const nameSet = new Set();
    const uniqueArtists = await Promise.all(
      artistsOnReleaseGroup.filter((artist) => {
        console.log(artist);
        if (idSet.has(artist.artist) || nameSet.has(artist.name)) {
          return false;
        } else {
          idSet.add(artist.artist);
          nameSet.add(artist.name);
          return true;
        }
      })
    );
    console.log(uniqueArtists);
    await Promise.all(
      uniqueArtists.map(async (artist) => {
        try {
          if (!artist.cover_art) {
            console.log(artist)
            const cover_art = await getCoverArt({
              mbid: artist.mbid,
              artist_id: artist.artist,
            });
            console.log(cover_art);
            artist.cover_art = cover_art;
          }
        } catch (error) {
          artist.cover_art = noCoverArtUrl;
          console.error("Error fetching cover art:", error.message);
        }
      })
    );
    details.artistsOnTracks = uniqueArtists;
    details.date = {
      year: earliestDate.getUTCFullYear(),
      month: earliestDate.getUTCMonth() + 1,
      day: earliestDate.getUTCDate(),
    };
    res.status(200).send(details);
  } catch (error) {
    console.error(error);
  }
});

app.get("/api/release_group/query", async (req, res) => {
  const { minListeningCount } = req.query || 0;
  console.log("processing request");
  try {
    const query = `SELECT mrg.name AS release_group_name, mrg.id AS release_group_id, mrg.gid AS mbid,
        mrgca.cover_art
        FROM musicbrainz.release_group AS mrg
        JOIN musicbrainz.release_group_listening_count AS mrglc ON mrg.id = mrglc.id 
        LEFT JOIN musicbrainz.release_group_cover_art AS mrgca ON mrgca.id = mrg.id
        WHERE mrglc.listening_count > ${minListeningCount};`;
    const release_groups = await db.query(query);
    res.status(200).send(release_groups.rows);
  } catch (error) {
    console.error(
      `Error inserting data for release group: ${error.message}`
    );
  }
});

app.listen(5003, () => {
  console.log("Server started on port 5003");
});
/*
    1203432
 */
