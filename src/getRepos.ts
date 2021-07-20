import { runPaginatedQuery } from "./runPaginatedQuery";
import _ from 'lodash'
import { gql } from "graphql-request";

export async function getRepos(orgName: string) {
	const query = gql`
		query getRepos($orgName: String!) {
			organization(login: $orgName) {
				repositories(first: 100) {
					nodes {
						name
					}
					pageInfo {
						endCursor
						hasNextPage
					}
				}
			}
		}
	`;

	const repositories = runPaginatedQuery<string>(
		query,
		{ orgName },
		(results) => {
			const hasNextPage =
				results.organization.repositories.pageInfo.hasNextPage;
			const cursor = results.organization.repositories.pageInfo.endCursor;
			const data = results.organization.repositories.nodes.map(
				(node: { name: string }) => node.name
			);
			return {data, cursor, hasNextPage};
		}
	);

	return repositories
}