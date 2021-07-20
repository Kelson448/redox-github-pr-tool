import { gql } from "graphql-request";
import { runPaginatedQuery } from "./runPaginatedQuery";

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
	repository: { name: string };
}

/**
 * Returns all pull requests for a specific org/repo
 * @param owner name of owner organization
 * @param repoName name of repo
 * @returns
 */
export async function getPullRequests(owner: string, repoName: string) {
	const query = gql`
		query getPullRequests(
			$cursor: String
			$repoName: String!
			$owner: String!
		) {
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
						repository {
							name
						}
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

	const pullRequests = runPaginatedQuery<PullRequest>(
		query,
		{ repoName, owner },
		(results) => {
			const hasNextPage = results.repository.pullRequests.pageInfo.hasNextPage;
			const cursor = results.repository.pullRequests.pageInfo.endCursor;
			const data = results.repository.pullRequests.nodes;

			return { hasNextPage, cursor, data };
		}
	);

	return pullRequests;
}
