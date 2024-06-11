import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Track = ({track}) => {
  return (
    <View style={styles.container}>
        <View style={styles.trackWrapper}>
            <Text style={styles.text}>{track.recording_name}</Text>
            <Text style={styles.artist}>{track.artist_credit_name}</Text>
        </View>
        <View style={styles.scoreWrapper}>
            <Text style={styles.score}>100</Text>
        </View> 
    </View>
  )
}

const styles = StyleSheet.create({
    text: {
        color: '#FEFEE3',
        paddingTop: 0,
        fontFamily: 'Roboto',
        fontSize: 18,
        overflow: 'hidden'

    },
    trackWrapper: {
        backgroundColor: '#25252d',
        margin: 5,
        marginLeft: 7,
        borderRadius: 10,
        padding: 10,
        width: '77%'

    },
    artist: {
        color: '#FEFEE3',
        fontSize: 12,
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        opacity: 0.8

    },
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    scoreWrapper: {
        backgroundColor: '#25252d',
        borderRadius: 10,
        margin: 5,
        marginRight: 7,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'

    },
    score: {
        color: '#1be7ff',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 30,
        fontFamily: "Roboto"
    }
})

export default Track