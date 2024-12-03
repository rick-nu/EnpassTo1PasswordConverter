console.log('Running converter...');

const enpass = JSON.parse(await Deno.readTextFile(`${Deno.cwd()}/export.json`));

console.log(enpass);

try {
	await Deno.mkdir('./1password')

	console.log('Created directory %c./1password %cto output all 1password templates to.', 'color: green', 'color: initial');
} catch (error) {
	if (!(error instanceof Deno.errors.AlreadyExists)) {
		throw error;
	}

	console.log('Directory %c./1password %calready exists.', 'color: green', 'color: initial');
}

Deno.writeTextFile('./1password/test.json', JSON.stringify({
	newFile: true,
}, null, '\t'))
