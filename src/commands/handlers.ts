import { setUser, readConfig } from "../config";
import { GuidedExit } from "../index.js";
import { createUser, selectUser, deleteAllUsers, selectAllUsers} from "../lib/db/queries/user.js";
import { fetchFeed } from "../../rss.js"; 
import { insertFeed, selectAllFeeds, getFeedByUrl } from "../lib/db/queries/feed.js";
import { selectFullFeedFollow, insertFeedFollows, selectAllFullFeedFollows, deleteFeedFollow } from "../lib/db/queries/feed_follows.js";
import { Feed, FeedMini, feeds, User, FullFeedFollow, FeedFollows } from "../lib/db/schema.js";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
export type UserCommandHandler = (cmdName: string, user: User, ...args: string[]) => Promise<void>;

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

export const handlerUsers: UserCommandHandler = async (cmdName: string,  user: User, ...args: string[]) => {
	try {
		const config = readConfig()
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

export const handleAddFeed: UserCommandHandler = async (cmdName: string, user: User, ...args: string[]) => {
	if (args.length < 2) {
		throw new GuidedExit("error: the handleAddFeed expects a two arguments, <name, url>");
	}

	const [name, url] = args;
	const feed: Feed = await insertFeed(name, url, user.id);
	const insert: FeedFollows = await insertFeedFollows(feed.id, user.id)
	const fullFeed: FullFeedFollow = await selectFullFeedFollow(insert.id)
	console.log(fullFeed)
}

export const handleFeeds: CommandHandler = async (cmdName: string, ...args: string[]) => {
	const result = await selectAllFeeds();
	console.log(result);
}

export const handleFollow: UserCommandHandler = async (cmdName: string, user: User, ...args: string[]) => {
	if (args.length < 1) {
		throw new GuidedExit("error: the handleFollow expects one argument <url>");
	}
	const [url] = args;

	const feed: FeedMini = await getFeedByUrl(url);
	if (feed == undefined) {
		throw new GuidedExit(`error: get FeedByUrl with url <${url}>`);
	}

	const insert: FeedFollows = await insertFeedFollows(feed.id, user.id)
	const fullFeed: FullFeedFollow = await selectFullFeedFollow(insert.id)
	
	console.log(fullFeed)
}

export const handleFollowing: UserCommandHandler = async (cmdName: string, user: User,  ...args: string[]) => {
	const fullFeeds: FullFeedFollow[] = await selectAllFullFeedFollows(user.id)
	console.log(fullFeeds)
}

export const handleUnfollow: UserCommandHandler = async (cmdName: string, user: User, ...args: string[]) => {
	if (args.length < 1) {
		throw new GuidedExit("error: the handleFollow expects one argument <url>");
	}

	const [url] = args;
	const feed: FeedMini = await getFeedByUrl(url);
	if (feed == undefined) {
		throw new GuidedExit(`error: get FeedByUrl with url <${url}>`);
	}
	
	const result = await deleteFeedFollow(user.id, feed.id)
	console.log("succesfull deletion")
}