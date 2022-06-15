export const converterDataURItoBlob: any = (dataURI: string) => {
	let byteString;
	let mimeString;
	let ia;

	if (dataURI.split(",")[0].indexOf("base64") >= 0) {
		byteString = atob(dataURI.split(",")[1]);
	} else {
		byteString = encodeURI(dataURI.split(",")[1]);
	}
	// separate out the mime component
	mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

	// write the bytes of the string to a typed array
	ia = new Uint8Array(byteString.length);
	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}
	return new Blob([ia], { type: mimeString });
};
