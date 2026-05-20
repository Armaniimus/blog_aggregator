import { boolean } from "drizzle-orm/gel-core";
import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
	channel: Channel
};

type Channel = {
	title: string;
	link: string;
	description: string;
	item: RSSItem[];
}

type RSSItem = {
	title: string;
	link: string;
	description: string;
	pubDate: string;
};
// type RSSItemKeys = "title" | "link" | "description" | "pubDate";

export const fetchFeed = async (feedURL: string) =>  {
	const response = await fetch(feedURL,{
		headers: {
			"User-Agent": "gator"
		}
	});

	const parser = await new XMLParser({processEntities: false});
	const parsedXml = parser.parse(await response.text());

	const channel: Channel 		= await getOrThrow(parsedXml.rss, "channel")
	const items: RSSItem[] 		= await getItems(channel);

	// console.log(items);

	const results = {
		metaData: { 
			title: await getOrThrow(channel, "title"), 
			link: await getOrThrow(channel, "link"), 
			description: await getOrThrow(channel, "description")
		 },
		itemList: await filterItemList(items),
	}
	
	return results;
}

function getOrThrow(obj: Record<string, any>, field: string) {
	if (obj[field] == undefined) {
		throw new Error(`field <${field}> doesn't exist in the given object`)
	}

	return obj[field];
}

function getItems(channel: Channel): RSSItem[] {
	if (channel.item == undefined) {
		return [];
	}

	if (Array.isArray(channel.item)) {
		return channel.item;
	}

	return [channel.item]
}

function filterItemList(items: RSSItem[]): RSSItem[] {
	const out = [];

	const isEmpty = (item: RSSItem, key: keyof RSSItem) => {return item[key] == undefined || item[key] == ""};

	for (const item of items) {
		if (isEmpty(item, "title") || isEmpty(item, "link"), isEmpty(item, "description"), isEmpty(item, "pubDate")) {
			continue;
		}

		out.push({ 
			title: item.title, 
			pubDate: item.pubDate,
			link: item.link, 
			description: item.description, 
		});
	}
	return out;
}