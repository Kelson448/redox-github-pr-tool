import { getPullRequests } from "./getPullRequests";

//I'm currently running a version of node that doesn't allow top level async
const runQuery = async () => {
	const results = await getPullRequests();
};

runQuery().then(() => console.log("completed"));
