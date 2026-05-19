import { setUser } from "../config";
import { GuidedExit } from "../index.js";
import { createUser, selectUser, deleteAllUsers} from "../lib/db/queries/user.js";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export const handlerLogin: CommandHandler = async (cmdName: string, ...args: string[]) => {
	if (args.length == 0) {
		throw new GuidedExit("error: the handlerLogin expects a single argument, the username.");
	}

	const username = args[0];
	if ((await selectUser(username)).length == 0) {
		throw new GuidedExit("error: You can't login to an account that doesn't exist!");
	}

	setUser(username)
	console.log(`username <${username}> is set`)
}

export const handlerRegister: CommandHandler = async (cmdName: string, ...args: string[]) => {
	if (args.length == 0) {
		throw new GuidedExit("error: the handlerRegister expects a single argument, name.");
	}

	const username = args[0];
	if ((await selectUser(username)).length > 0) {
		throw new GuidedExit("error: User allready exists");
	}

	const user = await createUser(username)
	setUser(username)
	console.log("success: user created",user)
}

export const handlerReset: CommandHandler = async (cmdName: string, ...args: string[]) => {
	try {
		await deleteAllUsers()
	} catch(err) {
		throw new GuidedExit("error: reset failed");
	}
}