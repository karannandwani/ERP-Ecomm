import React from "react";

import { StyleSheet, Platform } from "react-native";
import adjust from "./adjust";

const selectedTheme = "";

export const StyleLight = StyleSheet.create({
  h1: {
    fontSize: 20,
    color: "#222",
    marginTop: 10,
    // fontFamily: "sans-serif-thin",
    fontWeight: "normal",
  },
  
  MainContainer: {
    flex: 1,
  },

  headerContainer: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },

  h2: {
    fontSize: 16,
  },
  h3: {
    fontSize: 12,
  },
  h4: {
    fontSize: 8,
  },
  h5: {
    fontSize: 6,
  },
  h6: {
    fontSize: 4,
  },

  container: {
    flex: 1,
    padding: 20,
  },

  p: {
    fontSize: adjust(12),
  },

  title: {
    fontSize: adjust(16),
  },
  italic: {
    fontStyle: "italic",
  },
  fixedToBottom: {
    position: "absolute",
    bottom: 0,
  },
  containerCenterAlign: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 10,
    color: "#000",
    backgroundColor: "#fff",
  },

  header: {
    paddingTop: 10,
    paddingBottom: 10,
    textAlign: "center",
    color: "white",
    fontSize: 12,
  },
  cardSize: {
    minHeight: 50,
    maxHeight: 50,
  },
  marginTopTen: {
    marginTop: 10,
  },
  headerStyle: {
    backgroundColor: "#DCDCDC",
    alignContent: "center",
    justifyContent: "center",
    padding: 2,
    minWidth: 80,
  },
  cellStyle: {
    alignContent: "center",
    justifyContent: "center",
    minWidth: 80,
    padding: 2,
  },
  rowStyle: {
    borderColor: "#DCDCDC",
    borderWidth: 1,
    borderStyle: "solid",
  },
  tableContainer: {
    borderColor: "#E8E9EC",
    borderWidth: 1,
    borderStyle: "solid",
    // marginTop: 20,
    backgroundColor: "#fff",
  },
});
export const StyleDark = StyleSheet.create({
  h1: {
    fontSize: 16,
    color: "red",
    fontFamily: "Cochin",
    marginTop: 10,
  },
  MainContainer: {
    flex: 1,
  },
  headerContainer: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  h2: {
    fontSize: 16,
  },
  h3: {
    fontSize: 12,
  },
  h4: {
    fontSize: 8,
  },
  h5: {
    fontSize: 6,
  },
  h6: {
    fontSize: 4,
  },

  p: {
    fontSize: 12 / 2,
  },

  title: {
    fontSize: 16 / 2,
  },
  italic: {
    fontStyle: "italic",
  },
  fixedToBottom: {
    position: "absolute",
    bottom: 0,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  title: {
    fontSize: 10,
    color: "#000",
    backgroundColor: "#fff",
  },
  button: {
    fontSize: adjust(12),
    color: "#000",
    backgroundColor: "red",
    minHeight: 100,
    maxHeight: 100,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 10,
    textAlign: "center",
    color: "white",
    fontSize: adjust(22),
    fontSize: 12,
  },
  cardSize: {
    minHeight: 50,
    maxHeight: 50,
  },
  headerStyle: {
    backgroundColor: "#DCDCDC",
    alignContent: "center",
    justifyContent: "center",
    padding: 2,
    minWidth: 80,
    fontSize: 12,
  },
  cellStyle: {
    alignContent: "center",
    justifyContent: "center",
    minWidth: 80,
  },
  rowStyle: {
    borderColor: "#DCDCDC",
    borderWidth: 1,
    borderStyle: "solid",
  },
  tableContainer: {
    borderColor: "#E8E9EC",
    borderWidth: 1,
    borderStyle: "solid",
    // marginTop: 20,
    backgroundColor: "#fff",
  },
});

export const Styles = selectedTheme === "dark" ? StyleDark : StyleLight;
