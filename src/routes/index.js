import React from "react";
import { NavigationContainer  } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';


import Home                     from "../components/Home";
import Login                    from "../components/Login";



const AppStack = createStackNavigator();
const AuthStack = createStackNavigator();

function AppNavigator() {
	return (
		<NavigationContainer>
			<AppStack.Navigator initialRouteName="home">
				<AppStack.Screen name="home" component={Home} />
				<AuthStack.Screen name="login" component={Login} />
			</AppStack.Navigator>
		</NavigationContainer>
	);
}

export default AppNavigator;

