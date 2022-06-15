import { Text as RNText, View } from "react-native";
import React from "react";

type styleType1 = {
	fontStyle?: "normal" | "italic" | undefined;
	[key: string]: string | number | undefined;
};

type styleType2 = styleType1[];

type TextPropsType = {
	style?: styleType1 | styleType2;
};

export const Text: React.FC<TextPropsType> = ({ style, children }) => {
	let newStyle: styleType1 = {};

	let fontFamily = "open-sans";

	if (Array.isArray(style)) {
		for (let styleObject of style) {
			newStyle = { ...newStyle, ...styleObject };
		}
	} else {
		newStyle = { ...newStyle, ...style };
	}
	if (newStyle.fontStyle !== undefined) {
		if (newStyle.fontStyle === "italic") {
			fontFamily = "open-sans-italic";
		}
		// removing fontStyle
		delete newStyle.fontStyle;
	}

	newStyle = { ...newStyle, fontFamily };

	return <RNText style={newStyle}>{children}</RNText>;
};
