import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
	fetchUserPassport,
	UploadedPassportType,
} from "../app/user-passports/getPassportAsync";
import { useAppSelector } from "../app/hooks";
import { StateType as AuthStateType } from "../app/auth/authSlice";
import LoaderComponent from "../components/LoaderComponent";
import PassportListComponent from "../components/PassportListComponent";
import { UserPassport } from "../app/user-passports/models/UserPassport";
import { convertUploadedToUserPassport } from "../helper/helper";
import { Text } from "../components/TextComponent";
const UploadedPassportScreen = () => {
	const [data, setData] = useState<UploadedPassportType>({
		perPage: 10,
		lastPage: 1,
		currentPage: 0,
		data: [],
	});
	const [currentPage, setCurrentPage] = useState<number>(1);
	const authState: AuthStateType = useAppSelector((state) => state.auth);
	const [items, setItems] = useState<Partial<UserPassport>[]>([]);

	useEffect(() => {
		// (async function () {
		if (data.currentPage != currentPage) {
			fetchPassportsAsync();
		}

		// })();
	}, [currentPage]);

	const fetchPassportsAsync = async () => {
		try {
			console.log("fetching data from page ", currentPage);
			const data = await fetchUserPassport(currentPage, authState.token);
			console.log("data", data);
			setData(data);
			const convertedItems = convertUploadedToUserPassport(data.data);

			// const items_ = useMemo(() => {
			// 	return [...items, ...convertedItems];
			// }, [convertedItems]);

			setItems([...items, ...convertedItems]);
		} catch (error) {
			console.log(error);
		}
	};

	// console.log(items.length);

	const renderItem_: ListRenderItem<Partial<UserPassport>> = ({ item }) => {
		return <PassportListComponent userPassport={item} fromServer />;
	};

	const onRefreshHandler = () => {
		// console.log("im called");
		setItems([]);
		setCurrentPage(1);
		fetchPassportsAsync();
	};

	// if (items.length === 0) {
	// 	return <LoaderComponent />;
	// }

	return (
		<View style={styles.container}>
			<View style={styles.listWrapper}>
				<FlatList
					data={items}
					renderItem={renderItem_}
					ListHeaderComponent={
						<HeaderComponent
							totalItems={data.perPage * data.currentPage}
						/>
					}
					keyExtractor={(item) => item.id!}
					onEndReachedThreshold={0.2}
					onEndReached={() => setCurrentPage(currentPage + 1)}
					refreshing={items.length === 0}
					onRefresh={onRefreshHandler}
				/>
			</View>
		</View>
	);
};

export default UploadedPassportScreen;

type HeaderType = {
	totalItems: number;
};
const HeaderComponent: React.FC<HeaderType> = ({ totalItems }) => {
	return (
		<View style={styles.headerBar}>
			<Text style={styles.headerText}>
				Showing {totalItems} uploaded Passports - scroll to view more
			</Text>
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#EBF0F5",
		marginBottom: 30,
	},
	listWrapper: {
		marginTop: 10,
	},
	headerBar: {
		marginBottom: 10,
		alignItems: "center",
	},
	headerText: {
		fontStyle: "italic",
		color: "#2A333D80",
	},
});
