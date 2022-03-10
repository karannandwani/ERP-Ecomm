import React from 'react';
import { Dimensions } from "react-native";

export const DimensionContext =
 React.createContext({window: Dimensions.get("window"), screen: Dimensions.get("screen")})