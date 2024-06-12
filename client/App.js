import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {useEffect, useState, useCallback} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen'
import StatisticsScreen from './src/screens/StatisticsScreen'
import SettingsScreen from './src/screens/SettingsScreen'
import ReleaseDetailsScreen from './src/screens/ReleaseDetailsScreen'
import ArtistDetailsScreen from './src/screens/ArtistDetailsScreen';



//rfce
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


export default function App() {
  /* Reference for backend usage
  const [backendData, setBackendData] = useState([{}])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:5001/api')
      const newData = await response.json()
      setBackendData(newData)
    }
    fetchData()
  }, [])  */

  
  

  function HomeNavigator () {
    return(
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="ReleaseDetails" component={ReleaseDetailsScreen} options={({ route }) => ({ title: route.params.title })}/>
        <Stack.Screen name="ArtistDetails" component={ArtistDetailsScreen} options={({ route }) => ({ title: route.params.title })}/>

      </Stack.Navigator>
    )
  }

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="HomeNavigator" component={HomeNavigator} options={{ headerShown: false }} />
        <Tab.Screen name="Statistics" component={StatisticsScreen}/>
        <Tab.Screen name="Settings" component={SettingsScreen}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  
});
