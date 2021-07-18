import { GraphQLClient, gql } from "graphql-request";
import { GITHUB_TOKEN } from "./token";

const url = "https://api.github.com/graphql";
const client = new GraphQLClient(url, {
	headers: {
		authorization: `Bearer ${GITHUB_TOKEN}`,
	},
});

interface PullRequest {
	author: {
		login: string;
	};
	publishedAt: string;
	state: string;
	title: string;
}

// fetch PRs
export async function getPullRequests() {
	const query = gql`
		query getPullRequests($cursor: String) {
			repository(name: "ramda", owner: "ramda") {
				pullRequests(first: 100, after: $cursor) {
					nodes {
						author {
							login
						}
						publishedAt
						state
						title
					}
					pageInfo {
						endCursor
						hasNextPage
					}
					totalCount
				}
			}
		}
	`;

	// const totalPrs = 1644
	let pullRequests: PullRequest[] = [];
	let cursor: string | undefined = undefined;
	let hasNextPage = true;
	let totalCount: number = 0;

	while (hasNextPage) {
		const results: any = await client.request(query, { cursor: cursor });
		hasNextPage = results.repository.pullRequests.pageInfo.hasNextPage;
		cursor = results.repository.pullRequests.pageInfo.endCursor;
		totalCount = results.repository.pullRequests.totalCount;
		pullRequests = pullRequests.concat(results.repository.pullRequests.nodes);
	}
	console.log(pullRequests.length);
	return pullRequests;
}
// type created for returned value

// store PRs
