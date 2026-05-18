import { initCommands, runCommand } from "./commands/index.js"
import { closeDb } from "./lib/db/index.js";

export class GuidedExit extends Error { }

async function main() {	
	try {
		const commandRegistery = initCommands();
		const command = process.argv[2];
		const args = process.argv.slice(3);

		if (command == undefined) {
			throw new GuidedExit("not enough arguments were provided.")
		}
		await runCommand(commandRegistery, command, ...args);
	} catch(err) {
		if (err instanceof GuidedExit) {
			console.error(err.message);
			await closeDb();
			process.exit(1)
		} else {
			throw(err)
		}
	}

	await closeDb();
	process.exit(0)
}

main();