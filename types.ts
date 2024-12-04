export type EnpassBoolean = 0 | 1;

export type EnpassType =
	| 'username'
	| 'password'
	| 'text'
	| 'url'
	| 'totp'
	| 'phone'
	| 'section'
	| 'email'
	| 'multiline'
	| 'pin'
	| 'numeric';

export type EnpassField = {
	deleted: EnpassBoolean;
	label: string;
	order: number;
	sensitive: EnpassBoolean;
	type: EnpassType;
	value: string;
};

export type EnpassItem = {
	title: string;
	fields: EnpassField[];
};

export type EnpassFile = {
	items: EnpassItem[];
};

export type OnePasswordPurpose = 'NOTES' | 'PASSWORD' | 'USERNAME';

export type OnePasswordType = 'CONCEALED' | 'STRING' | 'EMAIL' | 'URL' | 'DATE' | 'MONTH_YEAR' | 'PHONE' | 'OTP';

export type OnePasswordItem = {
	id: string;
	type: OnePasswordType;
	purpose?: OnePasswordPurpose;
	label: string;
	value: string;
	section?: {
		id: string;
	};
};
