import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Score = ({score, scoreText}) => {
  return (
    <View style={[styles.container]}>
      <Text style={styles.score}>{score}</Text>
      <Text style={styles.scoreText}>{scoreText}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 15,
        backgroundColor: '#25252d',
        flex: 1,
        alignItems: 'stretch', 

    },
    score: {
        color: '#1be7ff',
        fontSize: 35,
        textAlign: 'left',
        textAlignVertical: 'top',
        width: '100%',
        fontFamily: 'Halyard-Display-Medium',
        padding: 10,
        paddingBottom: 0,
        
    },
    scoreText: {
        color: '#FEFEE3',
        padding: 10,
        paddingTop: 0,
        fontFamily: 'Halyard-Display-Medium',
        fontSize: 16,
        opacity: 1

    }
})

export default Score