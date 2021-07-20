import { GraphQLClient } from "graphql-request";
import { GITHUB_TOKEN } from "./token";

const url = "https://api.github.com/graphql";
export const client = new GraphQLClient(url, {
	headers: {
		authorization: `Bearer ${GITHUB_TOKEN}`,
	},
});
