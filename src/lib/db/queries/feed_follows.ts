import { db } from "..";
import { FeedFollows, feedFollows, feeds, users } from "../schema";
import { eq, and } from 'drizzle-orm';

export async function insertFeedFollows(feedId: string, userId: string): Promise<FeedFollows> {
	const [result] = await db.insert(feedFollows).values({ feedId: feedId, userId: userId }).returning();
	return result;
}

export async function selectFullFeedFollow(id: string) {
	const [result] = await db.select({
		id: feedFollows.id,
		createdAt: feedFollows.createdAt,
		updatedAt: feedFollows.updatedAt,		
		username: users.name,
		feedname: feeds.name,
		feedUrl: feeds.url,
		
	}).from(feedFollows)
	.innerJoin(users, eq(feedFollows.userId, users.id))
	.innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
	.where(eq(feedFollows.id, id))
	
	return result;
}

export async function selectAllFullFeedFollows(userId: string) {
	const result = await db.select({
		id: feedFollows.id,
		createdAt: feedFollows.createdAt,
		updatedAt: feedFollows.updatedAt,
		username: users.name,
		feedname: feeds.name,
		feedUrl: feeds.url,

	}).from(feedFollows)
		.innerJoin(users, eq(feedFollows.userId, users.id))
		.innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
		.where(eq(feedFollows.userId, userId))

	return result;
}

export async function deleteFeedFollow(userId: string, feedId: string) {
	return await db.delete(feedFollows).where(
		and(
			eq(feedFollows.userId, userId),
			eq(feedFollows.feedId, feedId)
		)
	);
}