import * as FileSystem from "expo-file-system";

export const clearImageFromUri = async (uri: string | undefined) => {
	if (!uri) return;

	const imageInfo = await FileSystem.getInfoAsync(uri!);

	if (imageInfo.exists && !imageInfo.isDirectory) {
		try {
			await FileSystem.deleteAsync(uri);
			console.log("deleted ", imageInfo.uri);
		} catch (e) {
			console.log("could not clean image", e);
		}
		return;
	}
	console.log("No Image File found !!", uri);
};

export const clearCacheCameraDirectory = async () => {
	const cameraDirInfo = await FileSystem.getInfoAsync(
		FileSystem.cacheDirectory + "Camera"
	);
	// const cameraDirInfo = await FileSystem.getInfoAsync(uri!);
	if (cameraDirInfo.exists && cameraDirInfo.isDirectory) {
		try {
			await FileSystem.deleteAsync(cameraDirInfo.uri);
			console.log("Deleted Camera Directory ", cameraDirInfo.uri);
		} catch (e) {
			console.log("Could not clean Camera Directory", e);
		}
		return;
	}
	console.log("No Camera Directory found !!", cameraDirInfo.uri);
};

export const clearCacheDirectoy = async () => {
	const cacheDirInfo = await FileSystem.getInfoAsync(
		FileSystem.cacheDirectory!
	);
	// const cacheDirInfo = await FileSystem.getInfoAsync(uri!);
	if (cacheDirInfo.exists && cacheDirInfo.isDirectory) {
		try {
			await FileSystem.deleteAsync(cacheDirInfo.uri);
			console.log("Deleted Cache Directory ", cacheDirInfo.uri);
		} catch (e) {
			console.log("Could not clean Cache Directory", e);
		}
		return;
	}
	console.log("No Cache Directory found !!", cacheDirInfo.uri);
};
