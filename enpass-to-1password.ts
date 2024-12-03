import slugify from "./helpers/slugify.ts";

console.log("Running converter...");

const enpass = JSON.parse(await Deno.readTextFile(`${Deno.cwd()}/export.json`));

// console.log(enpass);

try {
	await Deno.mkdir("./1password");

	console.log(
		"Created directory %c./1password %cto output all 1password templates to.",
		"color: green",
		"color: initial",
	);
} catch (error) {
	if (!(error instanceof Deno.errors.AlreadyExists)) {
		throw error;
	}

	console.log(
		"Directory %c./1password %calready exists.",
		"color: green",
		"color: initial",
	);
}

if (!enpass.items || enpass.items.length < 1) {
	console.log("No enpass items found in the export.");
	Deno.exit(1);
}

console.log(`Detected %c${enpass.items.length} %cpassword from enpass.`, "color: green", "color: initial");

let count = 0;

for (const item of enpass.items) {
	count++;
	console.log("%c========================================", "color: blue");
	console.log(`%c${item.title}`, "color: blue");
	console.log("%c========================================", "color: blue");

	const file = `./1password/${count}-${slugify(item.title)}.json`;

	const newFields = [];
	const newSections = [];

	let currentSection = null;

	for (const field of item.fields) {
		console.log(field);

		if (field.type === "section") {
			const sectionId = slugify(field.label);

			if (sectionId === 'additional-details') {
				console.log('%cIgnoring section additional details.', 'color: red');
				continue;
			}

			newSections.push({
				id: sectionId,
				label: field.label,
			});

			currentSection = sectionId;
			console.log("----------------------------------------");
			continue;
		}

		if (field.value === '') {
			console.log(`%c${field.label} has an empty value, skipping...`, 'color: red');
			continue;
		}

		const newItem = {
			id: slugify(`${currentSection ? `${currentSection}-` : ""}${field.label}`),
			type: field.type,
			label: field.label,
			value: field.value,
		};

		if (currentSection) {
			newItem.section = { id: currentSection };
		}

		newFields.push(newItem);

		console.log("----------------------------------------");
	}

	console.log(`%c${file}`, "color: yellow");

	const passwordTemplate = {
		title: item.title,
		sections: newSections,
		fields: newFields,
	};

	console.log(passwordTemplate);

	await Deno.writeTextFile(file, JSON.stringify(passwordTemplate, null, "\t"));

	console.log("File exported.");

	if (count >= 10) {
		break;
	}
}
