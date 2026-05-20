import { setUser, readConfig } from "../config";
import { GuidedExit } from "../index.js";
import { createUser, selectUser, deleteAllUsers, selectAllUsers} from "../lib/db/queries/user.js";
import { fetchFeed } from "../../rss.js"; 
import { insertFeed, selectAllFeeds } from "../lib/db/queries/feed.js";
import { Feed, feeds, User } from "../lib/db/schema.js";

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

export const handlerUsers: CommandHandler = async (cmdName: string, ...args: string[]) => {
	try {
		const config = readConfig()

		if ((await selectUser(config.currentUserName)).length == 0) {
			throw new GuidedExit("error: You first have to login for this endpoint!");
		}

		const users = await selectAllUsers();
		
		for (let i = 0; i< users.length; i++) {
			let current = (users[i].name == config.currentUserName ? "(current)": "");
			console.log(`* ${users[i].name} ${current}`)
		};

	} catch (err) {
		throw new GuidedExit("error: reset failed");
	}
}

export const handleAggregator: CommandHandler = async (cmdName: string, ...args: string[]) => {
	const result = await fetchFeed("https://www.wagslane.dev/index.xml");
	console.log(result);
}

export const handleAddFeed: CommandHandler = async (cmdName: string, ...args: string[]) => {
	if (args.length < 2) {
		throw new GuidedExit("error: the handleAddFeed expects a two arguments, <name, url>");
	}

	const [name, url] = args;

	const config = readConfig()
	const user:User[] = await selectUser(config.currentUserName);
	if (user.length == 0) {
		throw new GuidedExit("error: You first have to login for this endpoint!");
	}

	const feed: Feed = await insertFeed(name, url, user[0].id);
	
	printFeed(user[0], feed)
}

export const handleFeeds: CommandHandler = async (cmdName: string, ...args: string[]) => {
	const result = await selectAllFeeds();
	console.log(result);
}

function printFeed(user: User, feed: Feed) {
	console.log(user)
	console.log(feed)
}