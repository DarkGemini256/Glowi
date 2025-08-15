import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '@screens/DashboardScreen';
import ProfilesScreen from '@screens/ProfilesScreen';
import ExposureHistoryScreen from '@screens/ExposureHistoryScreen';
import RoutinesScreen from '@screens/RoutinesScreen';
import SettingsScreen from '@screens/SettingsScreen';
import SkinTypeQuizScreen from '@screens/SkinTypeQuizScreen';
import AllergyQuizScreen from '@screens/AllergyQuizScreen';
import * as Notifications from 'expo-notifications';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
	return (
		<Tab.Navigator>
			<Tab.Screen name="Dashboard" component={DashboardScreen} />
			<Tab.Screen name="Profiles" component={ProfilesScreen} />
			<Tab.Screen name="Exposure" component={ExposureHistoryScreen} />
			<Tab.Screen name="Routines" component={RoutinesScreen} />
			<Tab.Screen name="Settings" component={SettingsScreen} />
		</Tab.Navigator>
	);
}

export default function App() {
	useEffect(() => {
		Notifications.setNotificationHandler({
			handleNotification: async () => ({ shouldPlaySound: false, shouldShowAlert: true, shouldSetBadge: false })
		});
	}, []);
	return (
		<NavigationContainer theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, primary: '#ff7f32' } }}>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				<Stack.Screen name="Root" component={Tabs} />
				<Stack.Screen name="SkinTypeQuiz" component={SkinTypeQuizScreen} />
				<Stack.Screen name="AllergyQuiz" component={AllergyQuizScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
