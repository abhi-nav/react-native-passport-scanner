import { parse, Result } from "mrz";

export const parseMrz = (text: string): false | Result => {
	try {
		// if redundant text is captured towards border, ignore
		const splitText = text.split(" ");
		let extractedText = "";

		for (const splitItem of splitText) {
			if (splitItem.length > extractedText.length) {
				extractedText = splitItem;
			}
		}
		// console.log("extractedText", extractedText);

		const result = parse(extractedText);
		if (!result.valid) {
			// console.log("MRZ PARSE INVALID: ", text);
			return false;
			// retakePhotoHandler();
		}
		// console.log("mrz result", result);
		return result;
	} catch (error) {
		console.log("MRZ Text not recognized", error);
		return false;
	}
};
