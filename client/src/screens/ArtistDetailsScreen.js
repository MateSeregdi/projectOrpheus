import { View, Text } from 'react-native'
import React from 'react'

const ArtistDetailsScreen = ({route, navigation}) => {
    const {id} = route.params
    const {title} = route.params
  return (
    <View>
      <Text>{title}</Text>
    </View>
  )
}

export default ArtistDetailsScreen