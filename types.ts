export type EnpassBoolean = 0 | 1;

export type EnpassType = 'username' | 'password' | 'text' | 'url' | 'totp' | 'phone' | 'section' | 'email';

export type EnpassItem = {
	deleted: EnpassBoolean;
	label: string;
	order: number;
	sensitive: EnpassBoolean;
	type: EnpassType;
	value: string;
}

export type OnePasswordType = 'password' | 'text' | 'email' | 'url' | 'date' | 'monthYear' | 'phone' | 'otp' | 'file';

export type OnePasswordItem = {
	id: string;
	type: OnePasswordType;
	label: string;
	value: string;
	section?: {
		id: string;
	}
}
