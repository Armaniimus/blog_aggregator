import { CommandHandler, UserCommandHandler, handlerLogin, handlerRegister, handlerReset, handlerUsers, handleAggregator, handleAddFeed, handleFeeds, handleFollow, handleFollowing, handleUnfollow } from "./handlers";
import { readConfig } from "../config";
import { selectUser } from "../lib/db/queries/user";
import { GuidedExit } from "..";

type CommandsRegistry = Record<string, CommandHandler>

type middlewareLoggedInType = (handler: UserCommandHandler) => CommandHandler;

const middlewareLoggedIn: middlewareLoggedInType = (handler: UserCommandHandler): CommandHandler => {
	return async (cmdName: string, ...args: string[])  => {
		const config = readConfig()
		const user = await selectUser(config.currentUserName)
		if (user.length == 0) {
			throw new GuidedExit("error: You first have to login for this endpoint!");
		}

		await handler(cmdName, user[0], ...args );
	}
}


export const initCommands = (): CommandsRegistry => {
	const commandRegistery: CommandsRegistry = {}
	registerCommand(commandRegistery, "login", handlerLogin);
	registerCommand(commandRegistery, "register", handlerRegister);
	registerCommand(commandRegistery, "reset", handlerReset);
	registerCommand(commandRegistery, "users", middlewareLoggedIn(handlerUsers));
	registerCommand(commandRegistery, "agg", handleAggregator);
	registerCommand(commandRegistery, "addfeed", middlewareLoggedIn(handleAddFeed));
	registerCommand(commandRegistery, "feeds", handleFeeds);
	registerCommand(commandRegistery, "follow", middlewareLoggedIn(handleFollow));
	registerCommand(commandRegistery, "following", middlewareLoggedIn(handleFollowing));
	registerCommand(commandRegistery, "unfollow", middlewareLoggedIn(handleUnfollow));
	return commandRegistery;
}

export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
	return registry[cmdName](cmdName, ...args)
}

const registerCommand = (registry: CommandsRegistry, cmdName: string, handler: CommandHandler): void => {
	registry[cmdName] = handler
}