import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  SectionList,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import Release from "../components/Release";
import Titel from "../components/Titel";
import Score from "../components/Score";
import Info from "../components/Info";
import Track from "../components/Track";
import ReleaseSelector from "../components/ReleaseSelector";
import OrpheusButton from "../components/OrpheusButton";
import SectionHeader from "../components/SectionHeader";

const ReleaseDetailsScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [release_group, setReleaseGroup] = useState({});
  const [currentRelease, setCurrentRelease] = useState(0);
  const [sections, setSections] = useState([]);

  async function fetchRelease() {
    try {
      const response = await fetch(
        `http://localhost:5003/api/release_group/details/${id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      setReleaseGroup(data);

      return data;
    } catch (error) {
      console.error("Error fetching release:", error.message);
    }
  }
  function getSections(data) {
    const currentReleaseTracks = data.releases[currentRelease].tracks;
    let sections = [];
    currentReleaseTracks.forEach((track) => {
      const existingSection = sections.find(
        (section) =>
          section.title === `Medium Position: ${track.medium_position}`
      );

      if (!existingSection) {
        sections.push({
          title: `Medium Position: ${track.medium_position}`,
          data: [
            {
              name: track.recording_name,
              artist_credit: track.artist_credit_name,
            },
          ],
        });
      } else {
        existingSection.data.push({
          name: track.recording_name,
          artist_credit: track.artist_credit_name,
        });
      }
    });
    setSections(sections);
    return sections;
  }

  useEffect(() => {
    const fetchData = async () => {
      const releaseData = await fetchRelease();
      getSections(releaseData);
    };
    fetchData();
  }, []);

  const navigateToRelease = ({ id, name }) => {
    navigation.replace("ReleaseDetails", { id: id, title: name });
  };
  /**
  const navigateToArtist = (id, name, {coverArt}) => {
    navigation.push('ArtistDetails', {id: id, title: name, coverArt})
  }**/
  function changeRelease(releaseNumber) {
    setCurrentRelease(releaseNumber);
  }
  function reviewRelease() {
    console.log(
      `Reviewing release: ${release_group.releases[currentRelease].name}`
    );
  }

  return (
    <ScrollView style={styles.container}>
      {release_group.releases ? (
        <View>
          <View style={styles.titelContainer}>
            <Image
              key={release_group.cover_art}
              source={{ uri: release_group.cover_art }}
              style={styles.image}
            />
            <Titel text={release_group.releases[0].name} />
          </View>
          <View style={styles.score}>
            <Score score={"100"} scoreText={"Orpheus Score"} />
            <OrpheusButton text={"Review"} onChange={reviewRelease} />
          </View>
          <View style={styles.info}>
            <Info
              width={"31%"}
              height={"100%"}
              info={"Release Date"}
              infoText={`${release_group.date.year}. ${release_group.date.month}. ${release_group.date.day}`}
            />
            <Info
              width={"31%"}
              height={"100%"}
              infoText={`${release_group.releases[currentRelease].tracks.length}`}
              info={"Tracks"}
            />
            <Info
              width={"31%"}
              height={"100%"}
              infoText={"100"}
              info={"Orpheus Score"}
            />
          </View>
          <SectionHeader text={"Select Release"} />
          <ReleaseSelector
            releases={release_group.releases}
            changeRelease={changeRelease}
          />
          <SectionHeader text={"Tracks"} />
          <View style={styles.tracksWrapper}>
            {release_group.releases[currentRelease].tracks.map((track) => {
              return <Track key={track.recording_id} track={track} />;
            })}
          </View>
          <View style={styles.score}>
            <Score score={"100"} scoreText={"Critique Score"} />
            <Score score={"100"} scoreText={"User Score"} />
          </View>
          <SectionHeader text={"You might like"} />
          <View>
            <ScrollView style={styles.otherAlbumsByArtist} horizontal>
              {release_group.otherAlbumsByArtist.map((release) => {
                return (
                  <Release
                    key={release.release_group_id}
                    release={release}
                    onClick={() =>
                      navigateToRelease({
                        name: release.release_group_name,
                        id: release.release_group_id,
                      })
                    }
                  />
                );
              })}
            </ScrollView>
          </View>
          {/**<View style={styles.release}>
            
            <Text>{release_group.artist.name}</Text>
            <Text>{release_group.area.name}</Text>
          </View>
          <SectionList
            style={styles.tracks}
            sections={sections}
            keyExtractor={(item, index) => item + index }
            renderItem={({item}) => (
              <View style={styles.container}>
                <Text style={styles.text}>{item.name}</Text>
                <Text>{item.artist_credit}</Text>
              </View>
            )}
            renderSectionHeader={({section: {title}}) => (
              <Text style={styles.header}>{title}</Text>
            )} /> 
          <FlatList
            horizontal
            style={styles.albumRecommendations}
            data={release_group.otherAlbumsByArtist}
            renderItem={({item}) => <View><Release release={item} onClick={navigateToRelease} /></View>}
            keyExtractor={release => release.release_group_id}
          />
          <FlatList
            horizontal
            style={styles.artistRecommendations}
            data={release_group.artistsOnTracks}
            renderItem={({item}) => <View><Text>{item.name}</Text></View>}
            keyExtractor={artist => artist.artist}
            />**/}
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#040f16",
    flex: 1,
    flexDirection: "column",
    width: "100%",
    gap: 16,
    zIndex: -1,
  },
  titelContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  text: {
    marginBottom: 10,
    fontSize: 16,
  },
  release: {},
  wrapperCustom: {
    flex: 1,
    position: "absolute",
    width: "100%",
  },
  albumRecommendations: {
    flexDirection: "row",
  },
  tracks: {},
  artistsOnTracks: {
    flexDirection: "row",
  },
  score: {
    width: "100%",
    flex: 1,
    justifyContent: "space-around",
    alignItems: "stretch",
    padding: 16,

    flexDirection: "row",
    gap: 10,
  },
  info: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginLeft: 5,
    marginRight: 5,
  },
  tracksWrapper: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
    height: "fit-content",
  },
  otherAlbumsByArtist: {
    paddingLeft: 10,
    backgroundColor: "#040f16",
    flex: 1,
  },
});

export default ReleaseDetailsScreen;
