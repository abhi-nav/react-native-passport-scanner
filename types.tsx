/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import {
	BottomTabNavigationProp,
	BottomTabScreenProps,
} from "@react-navigation/bottom-tabs";
import {
	CompositeNavigationProp,
	CompositeScreenProps,
	NavigatorScreenParams,
} from "@react-navigation/native";
import {
	NativeStackNavigationProp,
	NativeStackScreenProps,
} from "@react-navigation/native-stack";
// import {
// 	DrawerNavigationProp,
// 	DrawerScreenProps,
// } from "@react-navigation/drawer";

declare global {
	namespace ReactNavigation {
		interface RootParamList extends RootStackParamList {}
	}
}

export type LoginStackParamList = {
	Login: undefined;
	Signup: undefined;
};

// export type RootDrawerParamList = {
// 	Root: NavigatorScreenParams<TabParamList> | undefined;
// };

// export type RootStackScreenProps<Screen extends keyof RootDrawerParamList> =
// 	NativeStackScreenProps<RootDrawerParamList, Screen>;

export type RootStackParamList = {
	HomeTab: NavigatorScreenParams<TabParamList>;
	Camera: undefined;
	Signature: { id: string };
	BarcodeScanner: { id: string };
	AddHighlandImage: { id: string };
	UploadedPassport: undefined;
	// Settings: undefined;
	Logout: undefined;
	NotFound: undefined;
};

export type StackNavigationProps =
	NativeStackNavigationProp<RootStackParamList>;

export type StackScreenProps<Screen extends keyof RootStackParamList> =
	NativeStackScreenProps<RootStackParamList, Screen>;

export type TabParamList = {
	// HomeStack: NavigatorScreenParams<HomeStackParamList>;
	Home: undefined;
	ScanPassport: undefined;
	Settings: undefined;
};

export type TabScreenProps<Screen extends keyof TabParamList> =
	BottomTabScreenProps<TabParamList, Screen>;

// export type SideDrawerScreenProps<Screen extends keyof RootDrawerParamList> =
// 	DrawerScreenProps<RootDrawerParamList, Screen>;

export type RootScreenProps<Screen extends keyof RootStackParamList> =
	NativeStackScreenProps<RootStackParamList, Screen>;

// export type RootScreenProps<Screen extends keyof RootStackParamList> =
// 	CompositeScreenProps<
// 		NativeStackScreenProps<RootStackParamList, Screen>,
// 		BottomTabScreenProps<TabParamList>
// 	>;

export type RootNavigationProps<Screen extends keyof RootStackParamList> =
	CompositeNavigationProp<
		NativeStackNavigationProp<RootStackParamList, Screen>,
		BottomTabNavigationProp<TabParamList>
	>;

// export type RootNavigationProps = CompositeNavigationProp<
// 	DrawerNavigationProp<RootDrawerParamList>,
// 	BottomTabNavigationProp<TabParamList>
// >;
export type Dimensions = {
	width: number;
	height: number;
};

export enum STATUSES {
	IDLE = "IDLE",
	FAILED = "FAILED",
	PENDING = "PENDING",
	SUCCEEDED = "SUCCEEDED",
}

export type OCR_STATUS = keyof typeof STATUSES;

export type ImageCropResponse = {
	uri: string;
	width: number;
	height: number;
};
