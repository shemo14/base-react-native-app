import React from "react";
import { NavigationContainer  } from "@react-navigation/native";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator,  } from '@react-navigation/stack';
import {Dimensions, I18nManager} from "react-native";
import { createCompatNavigatorFactory, NavigationActions, createSwitchNavigator } from '@react-navigation/compat';


import Home                     from "../components/Home";
import Login                    from "../components/Login";
import DrawerCustomization      from "./DrawerCustomization";

const width = Dimensions.get('window').width;
const drawerCust = (props) => (<DrawerCustomization {...props} />);

const drawerNavigator = createCompatNavigatorFactory(createDrawerNavigator)({
    Home                : Home,
},
    {
    initialRouteName    : 'Home',
    drawerPosition      : I18nManager.isRTL ?'right' : 'left',
    drawerOpenRoute     : 'DrawerOpen',
    drawerCloseRoute    : 'DrawerClose',
    gesturesEnabled     : false,
    drawerToggleRoute   : 'DrawerToggle',
    drawerWidth         : '100%',
    contentComponent    : drawerCust
});





const appStack =  createCompatNavigatorFactory(createStackNavigator)({
	drawerNavigator: {
		screen: drawerNavigator,
	},
	Home: {
		screen: Home,
	},
});


const authStack = createCompatNavigatorFactory(createStackNavigator)({
	Login: {
		screen: Login,
	},
});


const AppNavigator = createSwitchNavigator({
	auth    : authStack,
	app     : appStack,
});

export default AppNavigator;

