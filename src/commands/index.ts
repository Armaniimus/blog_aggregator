import { CommandHandler, handlerLogin, handlerRegister, handlerReset, handlerUsers, handleAggregator, handleAddFeed, handleFeeds } from "./handlers";

type CommandsRegistry = Record<string, CommandHandler>

export const initCommands = (): CommandsRegistry => {
	const commandRegistery: CommandsRegistry = {}
	registerCommand(commandRegistery, "login", handlerLogin);
	registerCommand(commandRegistery, "register", handlerRegister);
	registerCommand(commandRegistery, "reset", handlerReset);
	registerCommand(commandRegistery, "users", handlerUsers);
	registerCommand(commandRegistery, "agg", handleAggregator);
	registerCommand(commandRegistery, "addfeed", handleAddFeed);
	registerCommand(commandRegistery, "feeds", handleFeeds);
	return commandRegistery;
}

export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
	return registry[cmdName](cmdName, ...args)
}

const registerCommand = (registry: CommandsRegistry, cmdName: string, handler: CommandHandler): void => {
	registry[cmdName] = handler
}