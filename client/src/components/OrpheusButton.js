import { View, Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'

const OrpheusButton = ({text, onChange}) => {
    
  return (
    <View style={[styles.container, {opacity: 1}]}>
        <Pressable 
        onPress={onChange}
        style={({pressed}) => [{
            opacity: pressed ? 0.6 : 1
        }, styles.text]}>
            <Text style={styles.text}>{text}</Text>
        </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch', 
        justifyContent: 'center'
    },
    text: {
        color: '#25252d',
        backgroundColor: '#1be7ff',
        borderRadius: 15,
        fontSize: 40,
        textAlign: 'center',
        width: '100%',
        fontFamily: 'Roboto',
        padding: 9
        
    },
    
})

export default OrpheusButton