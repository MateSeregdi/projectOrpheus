import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Score = ({width, height, info, infoText}) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <Text style={styles.infoText}>{infoText}</Text>
      <Text style={styles.info}>{info}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 15,
        backgroundColor: '#25252d'
    },
    infoText: {
        color: '#1be7ff',
        fontSize: 18,
        textAlign: 'left',
        textAlignVertical: 'top',
        width: '100%',
        fontFamily: 'Halyard-Display-Medium',
        padding: 10,
        paddingBottom: 0
    },
    info: {
        color: '#FEFEE3',
        padding: 10,
        paddingTop: 0,
        fontFamily: 'Halyard-Display-Medium',
        fontSize: 12,
        opacity: 0.8

    }
})

export default Score