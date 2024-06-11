import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Titel = ({text}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        gap: (2, 0),
        width: '100%',
        height: '75',
        backgroundColor: '#25252d',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,

    },
    text: {
        
        color: '#1be7ff',
        fontSize: 40,
        textAlign: 'center',
        textAlignVertical: 'center',
        height: 'fit-content',
        width: '100%',
        fontFamily: 'Roboto',


    }
})

export default Titel