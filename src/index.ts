import { gql } from "graphql-request";
import { getPullRequests } from "./getPullRequests";
import { runPaginatedQuery } from "./runPaginatedQuery";
import _ from 'lodash'

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

	const organizations = runPaginatedQuery<string>(
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

	return organizations
}

//I'm currently running a version of node that doesn't allow top level async
const runQuery = async () => {
	const repos = await getRepos("ramda");
	const pullRequestPromises = repos.map((repo) =>
		getPullRequests("ramda", repo)
	);

	const pullRequests = await Promise.all(pullRequestPromises)
	const flatPullRequests = _.flatMap(pullRequests)
	console.log(flatPullRequests.length)
};

runQuery().then(() => console.log("completed"));
