import { db } from "..";
import { users, feeds, Feed } from "../schema";
import { eq } from 'drizzle-orm';

export async function insertFeed(name: string, url: string, userId: string): Promise<Feed> {
	const [result] = await db.insert(feeds).values({ name: name, url: url, userId: userId }).returning();
	return result;
}

export async function selectAllFeeds() {
	const result = await db.select({
		id: feeds.id,
		name: feeds.name,
		url: feeds.url,
		username: users.name
	}).from(feeds).innerJoin(users, eq(feeds.userId, users.id))
	
	return result;
}
