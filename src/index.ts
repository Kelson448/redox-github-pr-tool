import { getPullRequests } from "./getPullRequests";
import { getRepos } from "./getRepos";
import _ from 'lodash'

//I'm currently running a version of node that doesn't allow top level async
const runQuery = async () => {
	const repos = await getRepos("ramda");
	// Running all these queries in parallel
	const pullRequestPromises = repos.map((repo) =>
		getPullRequests("ramda", repo)
	);

	const pullRequests = await Promise.all(pullRequestPromises)
	//flattening the results
	const flatPullRequests = _.flatMap(pullRequests)
	console.log(flatPullRequests.length)
};

runQuery().then(() => console.log("completed"));
