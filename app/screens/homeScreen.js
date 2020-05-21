import React from 'react';
import { StyleSheet, Text, View, FlatList, StatusBar, TouchableHighlight } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default class App extends React.Component{
    constructor(props){
        super(props);
        var navigation = this.props.navigation;
        this.state = {
            cities: [
                {
                    name: "London",
                    country: "UK"
                },
                {
                    name: "Rome",
                    country: "Italy"
                },
                {
                    name: "Tokyo",
                    country: "Japan"
                },
                {
                    name: "Oslo",
                    country: "Norway"
                },
                {
                    name: "Tehran",
                    country: "Iran"
                },
                {
                    name: "Paris",
                    country: "France"
                },
                {
                    name: "Berlin",
                    country: "Germany"
                },
                {
                    name: "Baghdad",
                    country: "Iraq"
                },
                {
                    name: "Washington",
                    country: "US"
                },
                {
                    name: "Toronto",
                    country: "Canada"
                }
            ],
            list: [],
            refresh: true,
            newAlert: 0,
        };
        this.fetchTemp();
    }
    fetchTemp = () => {
        var newList = [];
        var list = this.getRandom(this.state.cities, 6);
        for(let city in list){
            var name = list[city].name;
            var country = list[city].country;
            this.feachCityTemp(name, country, newList);
        }
    };
    getRandom = (arr, n) => {
        var result = new Array(n),
            len = arr.length,
            taken = new Array(len);
        while (n--){
            var x = Math.floor(Math.random() * len);
            result[n] = arr[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len]: len;
        }
        return result;
    };

    loadNewTemps = () => {
      this.setState({
          list: [],
          refresh: true
      });
        this.fetchTemp();
    };

    feachCityTemp = (city1, country, newList) => {
        var emojiList = ['Clouds', 'Clear', 'Haze', 'Thunderstorm', 'Rain', 'Snow', 'Mist'];
        fetch('https://samples.openweathermap.org/data/2.5/weather?q='+city1+'&appid=439d4b804bc8187953eb36d2a8c26a02')
            .then((response) => response.json())
            .then((responseJson) => {
                var r = responseJson.main;
                var obj = responseJson;
                let weather = emojiList[Math.floor(Math.random() * emojiList.length)];
                var city = {
                    name: city1, //obj.name
                    county: country,
                    temp: Math.ceil((r.temp-32)*5/9) - Math.floor(Math.random() * 200),
                    type: weather, //obj.weather[0].main,
                    desc: 'Humidity: ' + r.humidity + '% - '+ weather, //obj.weather[0].main,
                };
                // console.log(city);
                newList.push(city);
                this.setState({
                    list: newList,
                    refresh:false
                });
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
                <FlatList
                    style={{width:'100%'}}
                    data={this.state.list}
                    // inverted={true}
                    refreshing={this.state.refresh}
                    onRefresh={this.loadNewTemps}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, index}) => (
                        <TouchableHighlight
                            underlayColor="white"
                            onPress={()=> this.setState({newAlert: 1, alertMessage: item.desc}) /*alert(item.desc)*/}
                        >
                        <LinearGradient
                            colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0)']}
                            start={[0, 0.5]}>
                        <View style={styles.row}>
                            <Text style={[
                                (this.getTempRange(item.temp) === 1) ? styles.cold: styles.temp,
                                (this.getTempRange(item.temp) === 2) ? styles.medium: styles.temp,
                                (this.getTempRange(item.temp) === 3) ? styles.hot: styles.temp,
                                (this.getTempRange(item.temp) === 4) ? styles.vhot: styles.temp,
                                styles.temp]}>{this.getEmoji(item.type)} {item.temp}°C</Text>
                            <Text style={styles.cityName}>{item.name}</Text>

                        </View>
                        </LinearGradient>
                        </TouchableHighlight>
                    )}
                />
                {
                    this.state.newAlert === 1 ? (
                        <View style={styles.customAlertContainer}>
                            <View style={styles.customAlertInnerContainer}>
                                <LinearGradient
                                    style={styles.customAlertLG}
                                    colors={['#136a8a', '#267871']}
                                    start={[0, 0.65]}
                                    >
                            <Text style={styles.customAlertText}>{this.state.alertMessage}</Text>
                                    <TouchableHighlight
                                        underlayColor="white"
                                        onPress={()=>this.setState({alertMessage: '', newAlert:0})}>
                                        <Text style={styles.customAlertButtonText}>Close</Text>
                                    </TouchableHighlight>
                                </LinearGradient>
                            </View>
                        </View>
                    ) : null
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        justifyContent: 'center',
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
    customAlertContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top:0,
        left:0,
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    customAlertInnerContainer:{
        width: '75%',
        height: 90,
    },
    customAlertLG: {
        flex:1,
        borderRadius: 20,
        justifyContent: 'space-between',
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 2,
        padding: 5,
    },
    customAlertText: {
        fontSize: 16,
        color: 'white',
        padding: 10,
        textAlign: 'center'
    },
    customAlertButtonText: {
        fontWeight: 'bold',
        color: 'white',
        padding: 10,
        textAlign: 'center'
    }

});
