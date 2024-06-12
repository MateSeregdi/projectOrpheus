import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import React from "react";

const Artist = ({ artist, onClick }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.6 : 1,
        },
        styles.wrapperCustom,
      ]}
      onPress={() =>
        onClick(artist.artist, artist.name)
      }
    >
      <View style={styles.container}>
        <Image source={{ uri: artist.cover_art }} style={styles.image} />
        <Text style={styles.text}>{artist.name}</Text>
        <Text style={styles.artist}>{artist.name}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: "left",
    backgroundColor: "#25252d",
    borderRadius: 10,
    width: 170,
  },
  text: {
    fontSize: 20,
    color: "#1be7ff",
    overflow: "hidden",
    fontFamily: "Roboto"
  },
  image: {
    width: 150,
    height: 150,
  },
  wrapperCustom: {
    marginRight: 8,
  },
});

export default Artist;
