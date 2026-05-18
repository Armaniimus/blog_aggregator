import fs from "node:fs"
import os from "node:os";
import path from "node:path";

// const basePath = "/home/armanimus/repos/blog_aggregator/";
const basePath = "/home/armanimus";

type Config = {
	dbUrl: string,
	currentUserName: string
}

type fileData = {
	db_url: string,
	current_user_name: string
}

const config: Config = readConfig();

function getConfigFilePath(): string {
	return `${basePath}/.gatorconfig.json`;
}

function getConfigFile(): fileData {
	const json = fs.readFileSync(getConfigFilePath(), { encoding: 'utf-8' })
	return JSON.parse(json);
}

function writeConfig(cfg: Config): void {	
	getConfigFile()
	const data: fileData = {
		db_url: cfg.dbUrl,
		current_user_name: cfg.currentUserName
	}

	fs.writeFileSync(getConfigFilePath(), JSON.stringify(data))
}

export function setUser(name:string) {
	const contents = getConfigFile();
	
	contents.current_user_name = name;
	config.currentUserName = name
	writeConfig(config);	
}

export function readConfig(): Config {
	const contents = getConfigFile();

	return {
		dbUrl: contents.db_url,
		currentUserName: contents.current_user_name
	}
}