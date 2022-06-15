import {
	ListRenderItem,
	StyleSheet,
	View,
	FlatList,
	SafeAreaView,
	TouchableOpacity,
} from "react-native";
import { Text } from "../components/TextComponent";
import React, { useEffect, useState } from "react";
import { RootScreenProps } from "../types";
import { useIsFocused, useRoute } from "@react-navigation/native";
import AuthComponent from "../components/AuthComponent";
import { useAppSelector } from "../app/hooks";
import { StateType as PassportStateType } from "../app/user-passports/userPassportsSlice";
import { UserPassport } from "../app/user-passports/models/UserPassport";
import PassportListComponent from "../components/PassportListComponent";
import { Icon, Overlay } from "react-native-elements";
import TopBarNotifyComponent from "../components/TopBarNotifyComponent";
import { useUserPassportStoreHandler } from "../hooks/useUserPassportStoreHandler";
import PassportFilterComponent from "../components/PassportFilterComponent";
import { isFormComplete } from "../helper/helper";

const HomeScreen = ({ navigation, route }: RootScreenProps<"HomeTab">) => {
	const [visible, setVisible] = useState<boolean>(false);

	const [items, setItems] = useState<Partial<UserPassport>[]>([]);

	const [filterState, setFilterState] = useState<string>("default");

	const isFocused = useIsFocused();

	let userPassports: PassportStateType = useAppSelector(
		(state) => state.userPassports
	);

	useEffect(() => {
		// console.log("im in useEffect", filterState);
		if (filterState === "draft") {
			let items_ = userPassports.items.filter(
				(userPassport) => !isFormComplete(userPassport)
			);
			setItems(items_);
		} else if (filterState === "completed") {
			let items_ = userPassports.items.filter(
				(userPassport) => !!isFormComplete(userPassport)
			);
			setItems(items_);
		} else {
			setItems(userPassports.items);
		}
	}, [userPassports, filterState]);

	const renderItem_: ListRenderItem<Partial<UserPassport>> = ({ item }) => {
		return <PassportListComponent userPassport={item} />;
	};

	const toggleOverlay = () => {
		setVisible(!visible);
	};

	const onFilterHandler = () => {
		setVisible(true);
	};

	const setFilterStateHandler = (state: string) => {
		setFilterState(state);
		setVisible(false);
	};

	const uploadedPassportHandler = () => {
		setVisible(false);
		navigation.navigate("UploadedPassport");
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<Overlay
				isVisible={visible}
				onBackdropPress={toggleOverlay}
				overlayStyle={styles.overlayStyle}
			>
				<PassportFilterComponent
					setFilterStateHandler={setFilterStateHandler}
					currentState={filterState}
					uploadedPassportHandler={uploadedPassportHandler}
				/>
			</Overlay>
			<View style={styles.container}>
				{useUserPassportStoreHandler()}
				<AuthComponent />
				<TopBarNotifyComponent />

				<View style={styles.listContainer}>
					<View style={styles.listHeader}>
						<Text style={styles.headerText}>Records</Text>

						<View style={styles.filterIcon}>
							<TouchableOpacity onPress={onFilterHandler}>
								<Icon
									name="filter"
									type="ant-design"
									color={
										filterState === "default"
											? "#2A333D80"
											: "red"
									}
									size={24}
								/>
							</TouchableOpacity>
						</View>
					</View>
					<View style={styles.listWrapper}>
						{items.length > 0 ? (
							<FlatList
								data={items}
								renderItem={renderItem_}
								keyExtractor={(item) => item.id!}
							/>
						) : null}
					</View>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#EBF0F5",
	},
	headerText: {
		fontSize: 24,
		fontStyle: "italic",
		fontWeight: "400",
		letterSpacing: 1,
		marginLeft: 16,
		color: "#2A333D",
	},
	listContainer: {
		flex: 1,
		marginTop: 38,
	},
	listHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	listWrapper: {
		marginTop: 30,
	},
	filterIcon: {
		justifyContent: "center",
		marginRight: 16,
	},
	overlayStyle: {
		// flex: 1,
		backgroundColor: "#EBF0F5",
		borderRadius: 10,
	},
});
