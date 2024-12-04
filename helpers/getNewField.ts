import { EnpassField, EnpassType, OnePasswordItem } from '../types.ts';
import slugify from './slugify.ts';

const getNewField = (
	fieldCount: number,
	enpassField: EnpassField,
	currentSection: string | null,
	newFields: OnePasswordItem[],
): OnePasswordItem | null => {
	const types: { [type in EnpassType]: Partial<OnePasswordItem> | null } = {
		section: null,
		email: {
			type: 'EMAIL',
			purpose: newFields.find((newField) => newField.purpose === 'USERNAME') ? undefined : 'USERNAME',
		},
		password: {
			type: 'CONCEALED',
			purpose: newFields.find((newField) => newField.purpose === 'PASSWORD') ? undefined : 'PASSWORD',
		},
		phone: { type: 'PHONE' },
		text: { type: enpassField.sensitive === 1 ? 'CONCEALED' : 'STRING' },
		url: { type: 'URL' },
		totp: { type: 'OTP' },
		username: {
			type: 'STRING',
			purpose: newFields.find((newField) => newField.purpose === 'USERNAME') ? undefined : 'USERNAME',
		},
		multiline: { type: enpassField.sensitive === 1 ? 'CONCEALED' : 'STRING' },
		pin: { type: 'CONCEALED' },
		numeric: { type: 'STRING' },
	};

	const typeProps = types[enpassField.type];

	if (!typeProps) {
		return null;
	}

	const onePasswordItem: OnePasswordItem = {
		id: slugify(`${currentSection ? `${currentSection}-` : ''}${enpassField.label}-${fieldCount}`),
		label: enpassField.label,
		value: enpassField.value,
		type: 'STRING',
		...typeProps,
	};

	if (currentSection) {
		onePasswordItem.section = { id: currentSection };
	}

	return onePasswordItem;
};

export default getNewField;
