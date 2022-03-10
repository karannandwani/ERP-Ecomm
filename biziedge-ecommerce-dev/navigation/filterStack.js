import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import filter from "../screens/filter/filter";
import profile from "../screens/profile/profile";
import homeScreen from "../screens/homeScreen/homeScreen";
import productDetails from "../components/common/itemDetailsComponent/productDetails";
import locationSearch from "../components/locationAndProductSearch/locationSearch";
import productSearch from "../components/locationAndProductSearch/productSearch";
import landingPage from "../screens/landingPage/landingPage";

const FilterStack = createStackNavigator();
const filterStack = ({}) => {
  return (
    <FilterStack.Navigator initialRouteName="home-page" unmountOnBlur={true}>
      <FilterStack.Screen
        component={landingPage}
        options={{ headerShown: false }}
        name="home-page"
      ></FilterStack.Screen>
      <FilterStack.Screen
        component={homeScreen}
        options={{ headerShown: false }}
        name="homeScreen"
      ></FilterStack.Screen>
      <FilterStack.Screen
        component={filter}
        options={{ headerShown: false }}
        name="filter"
      ></FilterStack.Screen>

      <FilterStack.Screen
        component={profile}
        options={{ headerShown: false }}
        name="Profile"
      ></FilterStack.Screen>
      <FilterStack.Screen
        component={productDetails}
        options={{ headerShown: false }}
        name="product-details"
      ></FilterStack.Screen>
      <FilterStack.Screen
        component={locationSearch}
        options={{ headerShown: false }}
        name="search-location"
      ></FilterStack.Screen>
      <FilterStack.Screen
        component={productSearch}
        options={{ headerShown: false, unmountOnBlur: true }}
        name="search-product"
      ></FilterStack.Screen>
    </FilterStack.Navigator>
  );
};
export default filterStack;
