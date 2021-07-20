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
	createdAt: string;
	mergedAt: string;
	updatedAt: string;
	closedAt: string;
	state: string;
	title: string;
	commits: { totalCount: number };
	id: string;
}

// fetch PRs
export async function getPullRequests( owner:string, repoName: string) {
	const query = gql`
		query getPullRequests($cursor: String, $repoName: String!, $owner:String!) {
			repository(name: $repoName, owner: $owner) {
				pullRequests(first: 100, after: $cursor) {
					nodes {
						author {
							login
						}
						publishedAt
						createdAt
						mergedAt
						closedAt
						state
						title
						commits(first: 100) {
							totalCount
						}
						id
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

	// totalPrs = 1644
	let pullRequests: PullRequest[] = [];
	let cursor: string | undefined = undefined;
	let hasNextPage = true;
	let totalCount: number = 0;

	while (hasNextPage) {
		const results: any = await client.request(query, {
			cursor: cursor,
			repoName,
			owner
		});
		hasNextPage = results.repository.pullRequests.pageInfo.hasNextPage;
		cursor = results.repository.pullRequests.pageInfo.endCursor;
		totalCount = results.repository.pullRequests.totalCount;
		pullRequests = pullRequests.concat(results.repository.pullRequests.nodes);
	}

	return pullRequests;
}
