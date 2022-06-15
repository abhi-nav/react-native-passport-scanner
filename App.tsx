import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import Navigation from "./navigation";
import useCachedResources from "./hooks/useCachedResources";
import {
	Text,
	StatusBar as StatusBar_,
	View,
	StyleSheet,
	Platform,
} from "react-native";
import { Provider } from "react-redux";
import { store, persistor } from "./app/store";
// the component we'll use to wrap our component tree
import { PersistGate } from "redux-persist/lib/integration/react";
import SplashScreen from "react-native-lottie-splash-screen";
import { useEffect } from "react";

export default function App() {
	useEffect(() => {
		SplashScreen.hide(); // here
	}, []);

	const isLoadingComplete = useCachedResources();

	if (!isLoadingComplete) {
		return null;
	} else {
		return (
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<View style={styles.container}>
						<Navigation />
						<StatusBar style="auto" />
					</View>
				</PersistGate>
			</Provider>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: Platform.OS === "ios" ? 20 : StatusBar_.currentHeight,
	},
});
