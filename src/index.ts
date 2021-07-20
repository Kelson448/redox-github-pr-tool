import { getPullRequests } from "./getPullRequests";
import { getRepos } from "./getRepos";
import _ from 'lodash'

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
