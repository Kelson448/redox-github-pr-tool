import { client } from "./client";

/**
 * Runs a query that contains pagination, handling all cursor logic
 * @param query Query to be run
 * @param variables Record of variables, passed to query
 * @param handler Handler for between page runs. Must return the cursor, hasNextPage,
 *  and the data array to be combined after all pagination is completed
 * @returns
 */
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
