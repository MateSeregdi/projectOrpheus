import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const SectionHeader = ({text}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
        marginTop: 16,
        marginBottom: 8
    },
    text: {
        color: '#1be7ff',
        backgroundColor: '#25252d',
        padding: 5,
        paddingLeft: 10,
        fontFamily: 'Roboto',
        fontSize: 16,
        opacity: 1,
        borderRadius: 10,
        marginLeft: 7,
        marginRight: 7,
        textAlignVertical: 'center'
    }
})

export default SectionHeader