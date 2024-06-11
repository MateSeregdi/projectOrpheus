import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";

const Release = ({ release, onClick }) => {
  const noCoverArtUrl =
    "https://media.istockphoto.com/photos/vinyl-record-with-blank-cover-picture-id469724807?k=6&m=469724807&s=170667a&w=0&h=Z1d0cDuZzjEuc62gy74iArN4oU7SbDmlc4Xeuv-87wA=";

  useEffect(() => {
    async function GetCoverArt() {
      const result = await fetch(
        `https://coverartarchive.org/release-group/${release.mbid}`
      );
      const data = await result.json();

      if (data.images && data.images.length > 0) {
        release.cover_art = data.images[0].image;
      } else {
        release.cover_art = noCoverArtUrl;
      }
    }
    if (!release.cover_art) {
      GetCoverArt();
    }
  }, [])
    return (
      <Pressable
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.6 : 1,
          },
          styles.wrapperCustom,
        ]}
        onPress={() =>
          onClick(release.release_group_id, release.release_group_name, {
            coverArt: release.cover_art,
          })
        }
      >
        <View style={styles.container}>
          <Image source={{ uri: release.cover_art }} style={styles.image} />
          <Text style={styles.text}>{release.release_group_name}</Text>
          <Text style={styles.artist}>{release.artist_name}</Text>
        </View>
      </Pressable>
    );
  }

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
    fontFamily: "Roboto",
  },
  image: {
    width: 150,
    height: 150,
  },
  wrapperCustom: {
    marginRight: 8,
  },
  artist: {
    color: "#FEFEE3",
    fontSize: 14,
    fontFamily: "Roboto",
    fontStyle: "normal",
    opacity: 0.9,
  },
});

export default Release;
