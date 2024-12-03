import {EnpassType, OnePasswordType} from "../types.ts";

const getFieldType = (type: EnpassType): OnePasswordType | null => {
	const types: {[type in EnpassType]: OnePasswordType | null} = {
		section: null,
	}

	return types[type] ?? null;
};

export default getFieldType;
