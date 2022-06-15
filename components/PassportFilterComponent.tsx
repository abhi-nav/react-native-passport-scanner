import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { CheckBox, Icon } from "react-native-elements";
type PassportFilterComponentPropType = {
	currentState: string;
	setFilterStateHandler: (state: string) => void;
	uploadedPassportHandler: () => void;
};
import { Text } from "react-native-elements";
import { StackNavigationProps } from "../types";

// import { Icon }
const PassportFilterComponent: React.FC<PassportFilterComponentPropType> = ({
	currentState,
	setFilterStateHandler,
	uploadedPassportHandler,
}) => {
	return (
		<View style={styles.container}>
			<View style={styles.checkBoxContainer}>
				<CheckBox
					onPress={() => setFilterStateHandler("default")}
					// center
					textStyle={{
						fontFamily: "open-sans",
						color: "#2A333D",
						fontWeight: "400",
					}}
					title="Show Both"
					checkedIcon="dot-circle-o"
					uncheckedIcon="circle-o"
					checked={currentState === "default"}
				/>

				<CheckBox
					onPress={() => setFilterStateHandler("draft")}
					// center

					textStyle={{
						fontFamily: "open-sans",
						color: "#2A333D",
						fontWeight: "400",
					}}
					title="Show Draft"
					checkedIcon="dot-circle-o"
					uncheckedIcon="circle-o"
					checked={currentState === "draft"}
				/>
				<CheckBox
					onPress={() => setFilterStateHandler("completed")}
					// center
					title="Show Completed"
					textStyle={{
						fontFamily: "open-sans",
						color: "#2A333D",
						fontWeight: "400",
					}}
					checkedIcon="dot-circle-o"
					uncheckedIcon="circle-o"
					checked={currentState === "completed"}
				/>
			</View>

			<View style={styles.optionsView}>
				<TouchableOpacity
					activeOpacity={0.6}
					style={styles.clickableOptions}
					onPress={uploadedPassportHandler}
				>
					<View style={styles.itemWrapper}>
						<Icon
							name="clouduploado"
							type="ant-design"
							size={24}
							color="#2A333D80"
						/>
						<Text style={styles.itemText}>
							View Uploaded Passports
						</Text>
						<Icon
							name="right"
							type="ant-design"
							size={16}
							color="#2A333D60"
						/>
						{/* <ListItem.Chevron /> */}
					</View>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default PassportFilterComponent;

const styles = StyleSheet.create({
	container: {
		// flex: 1,
		width: 280,
		height: 300,
		paddingVertical: 16,
		justifyContent: "center",
	},
	checkBoxContainer: {
		// flex: 1,
		paddingBottom: 16,
		borderBottomColor: "#2A333D10",
		borderBottomWidth: 2,
	},

	clickableOptions: {
		// flex: 1,
		borderRadius: 8,
		marginHorizontal: 8,
		paddingVertical: 16,
		paddingHorizontal: 8,
		// paddingVertical: 24,
		backgroundColor: "#0376F810",
		borderColor: "#0376F835",
		borderWidth: 2,
	},
	optionsView: {
		flex: 1,
		borderColor: "red",
		marginTop: 16,
		borderRadius: 8,
		justifyContent: "center",
	},
	itemText: {
		flex: 1,
		color: "#2A333D99",
		marginLeft: 16,
		fontSize: 14,
		fontWeight: "bold",
		fontStyle: "italic",
	},
	itemWrapper: {
		flexDirection: "row",
		alignItems: "center",
	},
});
