import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Image } from "react-native";

export default function CardWithGraph({
    style, header, currency, percentage, headerStyle, currencyStyle, curLowerStyle, onPress
}) {

    return (

        <TouchableOpacity style={[styles.boxContainer, style]} onPress={onPress}>
            <View style={[styles.cardContainer, {
                backgroundColor: '#fff',
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between'
            }]}>
                <View style={{
                    flex: 1,
                }}>
                    <View>
                        <Text style={[styles.headerStyle, headerStyle]}>
                            {header ? header : ''}
                        </Text>
                    </View>

                    <View style={[{ marginTop: 20 }, currencyStyle]}>
                        <Text style={styles.curStyle}>
                            {currency}
                        </Text>
                        <Text style={[styles.curLowerStyle, curLowerStyle]}>
                            {percentage}
                        </Text>
                    </View>

                </View>
                <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 10 }}>
                    <Image style={{ resizeMode: 'cover', width: 100, height: 100 }} source={require('../../../assets/demo.jpg')} />
                </View>

            </View>

        </TouchableOpacity >

    );
};

const styles = StyleSheet.create({
    boxContainer: {
        flex: 1,
        backgroundColor: '#efefef',
        minHeight: 133,
        maxHeight: 133,
        maxWidth: 370,
        minWidth: 370,
    },
    cardContainer: {
        backgroundColor: 'white',
        height: '100%',
        width: '100%',
        padding: 10,
    },

    headerStyle: {
        fontSize: 15,
        color: 'red',
    },

    curStyle: {
        fontSize: 25,
        color: '#4D4F5C',
        fontWeight: 'bold',
    },

    curLowerStyle: {
        fontSize: 11,
        color: '#FF4141',
        fontWeight: 'bold',
    }
});