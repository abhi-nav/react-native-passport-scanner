import React, { useEffect } from "react";
import { TabBarScannerIcon, TabBarIcon } from "../components/IconComponents";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import LoginScreen from "../screens/LoginScreen";

import { NavigationContainer } from "@react-navigation/native";
import {
	TabParamList,
	LoginStackParamList,
	RootStackParamList,
} from "../types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppSelector } from "../app/hooks";
import CameraScreen from "../screens/CameraScreen";
import SignatureScreen from "../screens/SignatureScreen";
import BarcodeScannerScreen from "../screens/BarcodeScannerScreen";
import AddHighlandImageScreen from "../screens/AddHighlandImageScreen";
import UploadedPassportScreen from "../screens/UploadedPassportScreen";
import { setUpInterceptor } from "../axios-interceptor";

export default function Navigation() {
	// const navigationRef = React.createRef<NavigationContainerRef<any>>();
	const authState = useAppSelector((state) => state.auth);

	// baseUrl setup depending upon the settings productio/development
	setUpInterceptor(authState.isProduction);

	// useEffect(() => {
	// }, []);

	return (
		<NavigationContainer>
			{/* <AuthComponent /> */}
			{!authState.token ? <LoginNavigator /> : <RootNavigator />}
		</NavigationContainer>
	);
}

const Stack = createNativeStackNavigator<LoginStackParamList>();

const LoginNavigator = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name="Login" component={LoginScreen} />
		</Stack.Navigator>
	);
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
	return (
		<RootStack.Navigator
			// initialRouteName="HomeTab"
			screenOptions={{
				headerShown: false,
				headerTitleAlign: "center",
				headerTitleStyle: { fontFamily: "open-sans" },
			}}
		>
			<RootStack.Screen component={HomeScreenTab} name="HomeTab" />

			<RootStack.Group
				screenOptions={{
					headerShown: true,
					// presentation: "containedTransparentModal",
					// headerBackVisible: false,
				}}
			>
				<RootStack.Screen
					component={CameraScreen}
					name="Camera"
					options={{
						title: "Scan Passport",
					}}
				/>
				<RootStack.Screen
					component={SignatureScreen}
					name="Signature"
					initialParams={{ id: "check" }}
					options={{
						headerBackVisible: false,
						title: "Add Signature",
					}}
				/>
				<RootStack.Screen
					component={BarcodeScannerScreen}
					name="BarcodeScanner"
					initialParams={{ id: "check" }}
					options={{
						headerBackVisible: false,
						title: "ICCID Scanner",
					}}
				/>
				<RootStack.Screen
					component={AddHighlandImageScreen}
					name="AddHighlandImage"
					initialParams={{ id: "check" }}
					options={{
						headerBackVisible: false,
						title: "Highland Image",
					}}
				/>
				<RootStack.Screen
					component={UploadedPassportScreen}
					name="UploadedPassport"
					options={{
						headerBackVisible: true,
						title: "Uploaded Passport",
					}}
				/>
			</RootStack.Group>
		</RootStack.Navigator>
	);
};

// const Drawer = createDrawerNavigator<RootDrawerParamList>();

// const RootNavigator = () => {
// 	return (
// 		<Drawer.Navigator
// 			screenOptions={{
// 				headerShown: false,
// 				drawerPosition: "right",
// 				drawerStyle: {
// 					// backgroundColor: "green",
// 					// paddingTop: 100,
// 					marginTop: 50,
// 					marginBottom: 50,
// 					// alignItems: "center",
// 					width: "70%",
// 				},
// 			}}
// 			// useLegacyImplementation={false}
// 		>
// 			<Drawer.Screen
// 				name="Root"
// 				component={HomeScreenTab}
// 				options={{
// 					title: "Home",
// 					drawerIcon: ({ color }) => (
// 						<DrawerIcon name="home" color={color} />
// 					),
// 				}}
// 			/>
// 			<Drawer.Screen
// 				name="Settings"
// 				component={SettingsScreen}
// 				options={{
// 					title: "Settings",
// 					drawerIcon: ({ color }) => (
// 						<DrawerIcon name="gear" color={color} />
// 					),
// 				}}
// 			/>

// 			<Drawer.Screen
// 				name="Logout"
// 				component={LogoutScreen}
// 				options={{
// 					title: "Logout",
// 					drawerIcon: ({ color }) => (
// 						<DrawerIcon name="sign-out" color={color} />
// 					),
// 				}}
// 			/>
// 		</Drawer.Navigator>
// 	);
// };

const Tab = createBottomTabNavigator<TabParamList>();

const HomeScreenTab = () => {
	return (
		<Tab.Navigator
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					// position: "absolute",
					height: 64,
					elevation: 1,
					backgroundColor: "#ffffff",

					alignItems: "center",
					justifyContent: "center",
				},
				tabBarItemStyle: {
					marginBottom: 14,
				},
				tabBarActiveTintColor: "#0376F8",
			}}
		>
			<Tab.Screen
				name="Home"
				component={HomeScreen}
				options={{
					tabBarLabelStyle: { fontFamily: "open-sans" },
					title: "HOME",
					// tabBarStyle: { display: "none" },
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="home" color={color} />
					),
				}}
			/>

			<Tab.Screen
				name="ScanPassport"
				component={CameraScreen}
				listeners={({ navigation, route }) => ({
					tabPress: (e) => {
						// Prevent default action
						e.preventDefault();
						// console.log("im pressed");
						// Do something with the `navigation` object
						// navigation.openDrawer();
						navigation.navigate("Camera");
					},
				})}
				options={{
					headerShown: true,
					title: "",
					tabBarStyle: { display: "none" },
					tabBarIcon: ({ color }) => (
						<TabBarScannerIcon name="scan1" color={color} />
					),
				}}
			/>
			<Tab.Screen
				name="Settings"
				component={SettingsScreen}
				options={{
					tabBarLabelStyle: { fontFamily: "open-sans" },
					title: "SETTINGS",
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="setting" color={color} />
					),
				}}
			/>
		</Tab.Navigator>
	);
};
