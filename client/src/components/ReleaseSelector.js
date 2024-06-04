import { View, Text, StyleSheet } from 'react-native'
import React, {useState} from 'react'
import { Dropdown } from 'react-native-element-dropdown';


const ReleaseSelector = ({releases, changeRelease}) => {
    
    const [releaseNumber, setReleaseNumber] = useState(0)
    
    const data= releases.map((release, index) => {
        return ({
            label: `${release.name} [${release.tracks.length}]`, 
            value: index
        })
    });

    return (
    <Dropdown
        style={styles.dropdown}
        selectedTextStyle={styles.selectedTextStyle}
        data={data}
        maxHeight={300}
        labelField={'label'}
        valueField={'value'}
        value={releaseNumber}
        onChange={release => {
            changeRelease(release.value)
            setReleaseNumber(release.value)
        }}
        itemContainerStyle={styles.itemContainerStyle}
        itemTextStyle={styles.itemTextStyle}
        activeColor={'#25252d'}
        
    />
  )
}

const styles = StyleSheet.create({
    dropdown: {
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
        backgroundColor: '#25252d',
        borderRadius: 15,
        width: '95%',
        marginLeft: 10,
        marginRight: 10,
        alignSelf: 'center'
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#1be7ff',
        paddingLeft: 10

    },
    itemContainerStyle: {
        backgroundColor: '#25252d',
        borderColor: '#040f16',
        borderWidth: 1,
    },
    itemTextStyle: {
        color: '#fefee3'
        
    }
})

export default ReleaseSelector