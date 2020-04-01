import React from 'react';
import { Text } from 'react-native';
import { Container } from 'native-base';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import AppNavigator from './src/routes';
import { Root } from "native-base";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistedStore } from './src/store';
import './ReactotronConfig';
import { NavigationContainer  } from "@react-navigation/native";

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isReady: false,
		};
	}

	async componentDidMount() {
		await Font.loadAsync({
			Roboto: require('native-base/Fonts/Roboto.ttf'),
			Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
			...Ionicons.font,
		});
		this.setState({ isReady: true });
	}

	render() {
		if (!this.state.isReady) {
			return <AppLoading />;
		}

		return (
			<Provider store={store}>
				<PersistGate persistor={persistedStore}>
					<Root>
						<AppNavigator />
					</Root>
				</PersistGate>
			</Provider>
		);
	}
}
