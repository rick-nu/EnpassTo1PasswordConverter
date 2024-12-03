const getFieldType = (type: string): string => {
	switch (type) {
		case 'username': return 'text';
		case 'url': return 'url';
		case 'email': return 'email';
		default: return 'password';
	}
};

export default getFieldType;
