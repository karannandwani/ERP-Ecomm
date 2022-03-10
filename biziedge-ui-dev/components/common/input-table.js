import React from "react";
import { TouchableOpacity, Text, View, StyleSheet, TextInput, Button } from "react-native";
import InputboxWithBorder from "../../components/common/inputBox/inputBoxWithBorder";

export default function TableInput({ renderData, headerItems, }) {
    const data = [{ item: null, caseQuantity: null, productQuantity: null }, 
        { item: null, caseQuantity: null, productQuantity: null }, {}];
    const elements = [1, 2, 3]
    return (
        <View style={{
            flex: 1,
        }}>
            <View style={[styles.cardHeader]}>
                {headerItems.map((item) => {
                    return (
                        <View
                            style={styles.headerItems}
                        >
                            <Text style={styles.text}>{item}</Text>
                        </View>
                    )

                })}
            </View>
            <View style={styles.row}>
                {data.map(i => {
                    return (
                        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: "#E8E9EC" }}>{
                            elements.map((i) => {
                                return (
                                    <View style={{ flex: 1 }} >
                                        <TextInput
                                            style={styles.textInputStyle}
                                        ></TextInput>
                                    </View>


                                )
                            })
                        }
                            <Button ><Text>Add</Text></Button>

                        </View>
                    )
                })}
            </View>

        </View >
    );
}

const styles = StyleSheet.create({

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#F5F6FA",
        alignItems: "center",
        alignContent: "center",
        minWidth: 160,
        maxWidth: 1000,
        maxHeight: 100,
        flexWrap: "wrap",
        padding: 10

    },
    headerItems: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap"
        , minWidth: 100, maxWidth: 300,
    },
    text: {
        fontSize: 11,
        fontWeight: "bold",
        color: "#A3A6B4",
    },
    row: {
        flex: 1,
        flexDirection: "column",
        // justifyContent: "space-between",
        // backgroundColor: "red",
        alignItems: "flex-start",
        alignContent: "flex-start",


    },
    rowItems: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap"
        , minWidth: 100, maxWidth: 300,
    }
    , textInputStyle: {
        fontWeight: "bold",
        padding: 10,
        color: "black",
        backgroundColor: "#fff",
        flex: 1,
        maxHeight: 40,
        minHeight: 40,
        maxWidth: 400,
        fontSize: 18,
        borderWidth: 1, borderColor: "#E8E9EC",
        margin: 10
    },

});
