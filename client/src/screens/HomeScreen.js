import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";
import React, { useState, useEffect } from "react";
import Release from "../components/Release";

const HomeScreen = ({ navigation }) => {
  const [releaseGroups, setReleaseGroups] = useState([]);

  async function fetchTopReleases() {
    try {
      const response = await fetch(
        "http://localhost:5003/api/release_group/query?minListeningCount=200000"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      setReleaseGroups(data);
    } catch (error) {
      console.error("Error fetching top releases:", error.message);
    }
  }

  const onButtonPress = (id, name, { coverArt }) => {
    navigation.navigate("ReleaseDetails", { id: id, title: name, coverArt });
  };

  useEffect(() => {
    fetchTopReleases();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={releaseGroups}
        renderItem={({ item }) => (
          <View>
            <Release release={item} onClick={onButtonPress} />
          </View>
        )}
        keyExtractor={(release) => release.release_group_id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "stretch",
    flexWrap: "nowrap",
  },
});

export default HomeScreen;
