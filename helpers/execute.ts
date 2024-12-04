const execute = async (command: string, args: string[]) => {
	console.log(`%c${command} ${args.join(' ')}`, 'color: blue');
	const { success, stderr } = await new Deno.Command(command, {
		args,
	}).output();

	const textDecoder = new TextDecoder();

	if (success) {
		console.log('%cSuccess!', 'color: green');
	} else {
		console.log('%cError!', 'color: red');
		console.log(textDecoder.decode(stderr));
	}
};

export default execute;
