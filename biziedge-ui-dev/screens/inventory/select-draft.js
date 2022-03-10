import React, { useState, useEffect } from "react";
import { TouchableOpacity, Text, View, StyleSheet, FlatList, } from "react-native";
import Icon from "../../components/common/icon";
import draft from "../../redux/reducer/draftReducer";


export default function SelectDraft({ draftList, onDraftSelection }) {

    const selectItem = (item) => {
        onDraftSelection(item);
    }



    return (
        <View>
            <Text >Select Draft</Text>
            <View>
                <TouchableOpacity style={{ flex: 1, marginTop: 15,borderBottomWidth: 1,
                                    borderBottomColor: "lightgray", }}     onPress={() => selectItem()}>
                    <Text>New Order</Text> 
                     {/* <Icon name="plus" fill="black" style={{ width: 12, height: 12 }}> </Icon> */}
                </TouchableOpacity>
            </View>

            <View>
                {/* <TouchableOpacity
                            onPress={() => selectItem(item)}
                            style={[styles.listStyle]}
                        > */}



                <FlatList
                    style={{ marginTop: 10, flex: 1 }}
                    keyExtractor={(item, index) => index.toString()}
                    data={draftList}
                    onDraftSelection={selectItem}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onPress={() => selectItem(item)}
                            style={[styles.listStyle]}
                        >
                            <View
                                style={{
                                    padding: 0,
                                    margin: 5,
                                    minWidth: 900,
                                    borderBottomWidth: 1,
                                    borderBottomColor: "lightgray",
                                    minHeight: 40
                                }}
                            >

                                <Text
                                    style={{
                                        fontSize: 13,
                                        fontWeight: "bold",
                                        marginBottom: 10,
                                    }}
                                >
                                    {item.time}
                                </Text>

                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    listStyle: {
        backgroundColor: "#fff",
        marginBottom: 3,
        maxWidth: 300,
        flexDirection: "row",
        justifyContent: "space-between",
    },
});
