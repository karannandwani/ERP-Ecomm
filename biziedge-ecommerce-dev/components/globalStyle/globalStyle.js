import React from "react";

import { StyleSheet } from "react-native";
import adjust from "./adjust";

const selectedTheme = "light";

export const StyleLight = StyleSheet.create({
  h1: {
    fontSize: adjust(28),
    fontFamily: "Source Sans Pro",
  },
  h2: {
    fontSize: adjust(40),
    fontWeight: "bold",
  },
  h3: {
    fontSize: adjust(18),
    fontFamily: "Source Sans Pro",
  },
  h4: {
    fontSize: adjust(15),
    fontFamily: "Source Sans Pro",
    color: "#AFAEBF",
  },
  h5: {
    fontSize: 17,
    // fontWeight: "bold",
  },
  h6: {
    fontSize: 12,
    fontWeight: "bold",
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
  stats: {
    fontWeight: "bold",
    fontSize: 25,
    fontFamily: "Source Sans Pro",
  },
});

export const StyleDark = StyleSheet.create({
  h1: {
    fontSize: 50 / 2,
    fontWeight: "bold",
  },
  h2: {
    fontSize: 40 / 2,
    fontWeight: "bold",
  },
  h3: {
    fontSize: 30 / 2,
    fontWeight: "bold",
  },
  h4: {
    fontSize: 20 / 2,
    fontWeight: "bold",
  },
  h5: {
    fontSize: 15 / 2,
    fontWeight: "bold",
  },
  h6: {
    fontSize: 12 / 2,
    fontWeight: "bold",
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
});

export const Styles = selectedTheme === "dark" ? StyleDark : StyleLight;
