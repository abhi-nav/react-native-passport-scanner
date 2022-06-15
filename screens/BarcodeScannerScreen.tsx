import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { UserPassport } from "../app/user-passports/models/UserPassport";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { RootScreenProps } from "../types";
import {
	addUserIccid,
	getUserPassportFromId,
} from "../app/user-passports/userPassportsSlice";
import { RNCamera as Camera, BarCodeReadEvent } from "react-native-camera";

import LoaderComponent from "../components/LoaderComponent";
import { Icon } from "react-native-elements";

const BarcodeScannerScreen = ({
	route,
	navigation,
}: RootScreenProps<"BarcodeScanner">) => {
	const [userPassport, setUserPassport] = useState<Partial<UserPassport>>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { id } = route.params;
	const dispatch = useAppDispatch();
	const userPassports = useAppSelector((state) => state.userPassports);
	const cameraRef = useRef<Camera>(null);
	const icon = <Icon name="mobile1" type="ant-design" size={40} />;

	useEffect(() => {
		let userPassport = null;

		if (id) {
			userPassport = getUserPassportFromId(userPassports, id);
		}

		if (userPassport) {
			setUserPassport(userPassport);
		} else {
			navigation.navigate("HomeTab", { screen: "Home" });
		}
	}, [id, userPassports]);

	const onBarCodeRead = (result: BarCodeReadEvent) => {
		const { data, type } = result;

		// incoming type is CODE_128 instead of code128 (type bug)
		if (
			isLoading === false &&
			(type as "CODE_128") === "CODE_128" &&
			data.length === 19
		) {
			// ignore repeated call
			setIsLoading(true);

			dispatch(addUserIccid({ id: id, iccid: data }));
			navigation.navigate("AddHighlandImage", { id: userPassport!.id! });
		}

		// console.log("barcode result", result);
	};

	if (!userPassport) {
		return null;
	}
	return (
		<View style={styles.container}>
			<View style={styles.cameraContainer}>
				<Camera
					style={{
						...styles.camera,
						// width: width,
						// height: height,
					}}
					type={Camera.Constants.Type.back}
					ref={cameraRef}
					ratio="16:9"
					// autoFocusPointOfInterest={{ x: 0.4, y: 0.75 }}
					// onCameraReady={onCameraReady}
					onBarCodeRead={onBarCodeRead}
					barCodeTypes={[Camera.Constants.BarCodeType.code128]}
					zoom={0.08}
				/>
			</View>

			<View style={styles.loader}>
				<LoaderComponent
					displayText="Please Scan ICCID Barcode"
					icon={icon}
				/>
			</View>
		</View>
	);
};

export default BarcodeScannerScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
	},
	cameraContainer: {
		height: "60%",
		overflow: "hidden",
	},

	camera: {
		flex: 1,
	},

	loader: {
		height: "40%",
	},
});
