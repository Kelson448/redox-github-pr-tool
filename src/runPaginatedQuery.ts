import { client } from "./client";

export async function runPaginatedQuery<T>(
	query: string,
	variables: Record<string, any>,
	handler: (results: any) => {
		cursor: string;
		hasNextPage: boolean;
		data: T[];
	}
): Promise<T[]> {
	let collectedData: T[] = [];
	let cursor: string | undefined = undefined;
	let hasNextPage = true;
	while (hasNextPage) {
		const results: any = await client.request(query, {
			...variables,
			cursor: cursor,
		});
		const handlerResults = handler(results);
		collectedData = collectedData.concat(handlerResults.data);
		hasNextPage = handlerResults.hasNextPage;
		cursor = handlerResults.cursor;
	}
	return collectedData;
}
