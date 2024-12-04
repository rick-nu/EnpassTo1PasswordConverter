import slugify from './helpers/slugify.ts';
import { EnpassFile, OnePasswordItem } from './types.ts';
import execute from './helpers/execute.ts';
import getNewField from './helpers/getNewField.ts';

const vaultName = 'Enpass Import';

console.log('%c========================================', 'color: blue');
console.log(`%cEnpass to 1Password converter`, 'color: blue');
console.log('%c========================================', 'color: blue');

console.log('Running converter...');

const enpass = JSON.parse(await Deno.readTextFile(`${Deno.cwd()}/export.json`)) as EnpassFile;

console.log(`Deleting vault "Enpass Import" if it exists...`);

await execute('op', ['vault', 'delete', vaultName]);

console.log(`Creating vault "Enpass Import"...`);

await execute('op', ['vault', 'create', vaultName]);

try {
	await Deno.remove('./1password', { recursive: true });
} catch (_error) {
	// do nothing
}

try {
	await Deno.mkdir('./1password');

	console.log(
		'Created directory %c./1password %cto output all 1password templates to.',
		'color: green',
		'color: initial',
	);
} catch (error) {
	if (!(error instanceof Deno.errors.AlreadyExists)) {
		throw error;
	}

	console.log(
		'Directory %c./1password %calready exists.',
		'color: green',
		'color: initial',
	);
}

if (!enpass.items || enpass.items.length < 1) {
	console.log('No enpass items found in the export.');
	Deno.exit(1);
}

console.log(`Detected %c${enpass.items.length} %cpassword from enpass.`, 'color: green', 'color: initial');

let count = 0;

for (const enpassItem of enpass.items) {
	count++;
	console.log('%c========================================', 'color: blue');
	console.log(`%c(${count}/${enpass.items.length}) %c${enpassItem.title} `, 'color: blue', 'color: initial');
	console.log('%c========================================', 'color: blue');

	const onePasswordOutputFile = `./1password/${count}-${slugify(enpassItem.title)}.json`;

	const onePasswordFields: OnePasswordItem[] = [];
	const onePasswordSections = [];

	let currentSection = null;
	let fieldCount = 1;

	for (const enpassField of enpassItem.fields) {
		if (enpassField.deleted === 1) {
			console.log(`%c${enpassField.label} was removed, skip.`, 'color: gray');
			continue;
		}

		if (enpassField.type === 'section') {
			const sectionId = slugify(enpassField.label);

			if (sectionId === 'additional-details') {
				console.log('%cSkipping section additional details.', 'color: gray');
				continue;
			}

			onePasswordSections.push({
				id: sectionId,
				label: enpassField.label,
			});

			currentSection = sectionId;
			continue;
		}

		if (enpassField.value === '') {
			console.log(`%c${enpassField.label} empty, skip.`, 'color: gray');
			continue;
		}

		if (['.Android#'].includes(enpassField.type)) {
			console.log(`%cSkipping field type ${enpassField.type}.`, 'color: gray');
			continue;
		}

		const newItem = getNewField(fieldCount, enpassField, currentSection, onePasswordFields);

		if (!newItem) {
			console.log(`%cNo new item was created!`, 'color: red');
			continue;
		}

		fieldCount++;

		console.log(
			`%c${currentSection ? `(${currentSection}) ` : ''}${
				newItem.purpose ? `[${newItem.purpose}] ` : ''
			}${newItem.label} = ${['CONCEALED', 'OTP'].includes(newItem.type) ? '•••••' : newItem.value}`,
			'color: green',
		);

		onePasswordFields.push(newItem);
	}

	const onePasswordTemplate = {
		title: enpassItem.title,
		category: 'LOGIN',
		sections: onePasswordSections,
		fields: onePasswordFields,
	};

	await Deno.writeTextFile(onePasswordOutputFile, JSON.stringify(onePasswordTemplate, null, '\t'));

	console.log(`File ${onePasswordOutputFile} exported.`);

	await execute('op', [`item`, `create`, `--template`, onePasswordOutputFile, '--vault', vaultName]);
}

console.log('%c========================================', 'color: blue');
console.log(`%cEnpass to 1Password converter`, 'color: blue');
console.log('%c========================================', 'color: blue');
console.log(`%cImport completed! You're welcome! ~Rick (https://github.com/rick-nu)`, 'color: green');
