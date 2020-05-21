import React from 'react';
import { Dimensions, TextInput, StyleSheet, Text, View, FlatList, StatusBar, TouchableHighlight } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from 'expo-font';

// alert('width: ' + Dimensions.get('window').width + ' - height: '+  Dimensions.get('window').height)

export default class App extends React.Component{
    constructor(props){
        super(props);
        var navigation = this.props.navigation;
        this.state = {
            searchInput: '',
            searchResult: 0,
            error: 'Search for city...',
            item: {},
            fontLoaded: false,
        };
    }
    async componentDidMount(){
        await Font.loadAsync({
            'Iran-Sans': require('../assets/IRANSansWeb.ttf')
        }).then(() => {
            this.setState({fontLoaded: true})
        })
    }
    searchCity = () => {
        this.fetchCityTemp(this.state.searchInput);
    };
    fetchCityTemp = (city1) => {
        this.setState({
            item: {},
            searchResult: 0,
            error: 'Search for city...',
        });
        var emojiList = ['Clouds', 'Clear', 'Haze', 'Thunderstorm', 'Rain', 'Snow', 'Mist'];
        fetch('https://samples.openweathermap.org/data/2.5/weather?q='+city1+'&appid=439d4b804bc8187953eb36d2a8c26a02')
            .then((response) => response.json())
            .then((responseJson) => {
                var r = responseJson.main;
                var obj = responseJson;
                if (responseJson.cod !== 200 || city1 === ''){
                 this.setState({
                     searchResult: 0,
                     error: 'City not found!',
                 })
                }else{
                let weather = emojiList[Math.floor(Math.random() * emojiList.length)];
                var city = {
                    name: city1, //obj.name
                    temp: Math.ceil((r.temp-32)*5/9) - Math.floor(Math.random() * 200),
                    type: weather, //obj.weather[0].main,
                    desc: 'Humidity: ' + r.humidity + '% - '+ weather, //obj.weather[0].main,
                };
                this.setState({
                    item: city,
                    searchResult: 1,
                });
                }
            })
    };
    getTempRange = (t) => {
        if (t < 11){
            return 1
        }else if(t< 10 && t < 20){
            return 2
        }else if (t => 20 && t < 30){
            return 3
        }else if(t => 30){
            return 4
        }
        return 0;
    };

    getEmoji = (type) => {
        if(type === 'Clouds'){
            return '☁️';
        }
        if (type === 'Clear'){
            return '☀️';
        }
        if (type === 'Haze'){
            return '🌤';
        }
        if( type === 'Thunderstorm'){
           return '⛈️'
        }
        if( type === 'Rain'){
            return '🌧️'
        }
        if( type === 'Snow'){
            return '❄️'
        }
        if( type === 'Mist'){
            return '🌫️'
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content"/>
                <Text style={styles.title}>☀️ CityWeather</Text>
                { this.state.fontLoaded === true ? (
                    <View>
                <View style={styles.searchContainer}>
                    <Text style={styles.searchText}>جستجوی شهر</Text>
                    <TextInput
                        onChangeText={(text) => this.setState({searchInput: text})}
                        value={this.state.searchInput}
                        style={styles.input}/>
                    <TouchableHighlight onPress={ () => this.searchCity()}
                                        style={styles.searchButton}>
                        <Text style={styles.searchButtonText}>Search</Text>
                    </TouchableHighlight>

                </View>
                {this.state.searchResult === 1 ? (
                <TouchableHighlight
                    underlayColor="white"
                    onPress={()=> alert(this.state.item.desc)}
                >
                    <LinearGradient
                        colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0)']}
                        start={[0, 0.5]}>
                        <View style={styles.row}>
                            <Text style={[
                                (this.getTempRange(this.state.item.temp) === 1) ? styles.cold: styles.temp,
                                (this.getTempRange(this.state.item.temp) === 2) ? styles.medium: styles.temp,
                                (this.getTempRange(this.state.item.temp) === 3) ? styles.hot: styles.temp,
                                (this.getTempRange(this.state.item.temp) === 4) ? styles.vhot: styles.temp,
                                styles.temp]}>{this.getEmoji(this.state.item.type)} {this.state.item.temp}°C</Text>
                            <Text style={styles.cityName}>{this.state.item.name}</Text>

                        </View>
                    </LinearGradient>
                </TouchableHighlight>
                ): (
                    <View style={styles.container}>
                        <Text>{this.state.error}</Text>
                    </View>
                )}
                    </View>) : (<Text>Loading...</Text>)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flex: 1
    },
    title:{
        width: '100%',
        paddingTop: 20,
        paddingBottom: 15,
        backgroundColor: 'black',
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    row: {
        flex: 1,
        width: Dimensions.get('window').width,
        paddingVertical: 25,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: 'white'
    },
    cityName: {
        fontSize: 20,
        lineHeight: 40,
        fontFamily: 'Roboto'
    },
    temp: {
        fontSize: 30,
        lineHeight: 40,
        width: 130,
        marginRight: 15,
        fontWeight: 'bold',
        fontFamily: 'Roboto'
    },
    cold: {color: 'blue'},
    medium: {color: 'green'},
    hot: {color: 'orange'},
    vhot: {color: 'red'},
    input: {
        width: '80%',
        paddingHorizontal: 5,
        margin: 5,
        backgroundColor: 'white',
        color: 'black',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey'
    },
    searchContainer: {
        alignItems: 'center',
        width: '90%',
        paddingBottom: 10
    },
    searchText: {
        textAlign: 'center',
        lineHeight: 20,
        padding: 5,
        fontSize: 16,
        fontFamily: 'Iran-Sans'
    },
    searchButton: {
        backgroundColor: 'lightgrey',
        paddingHorizontal: '33%',
        paddingVertical: 15,
        borderRadius: 2,
    },
    searchButtonText: {
        fontSize: 14,
        color: 'black'
    }
});
