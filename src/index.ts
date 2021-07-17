import { GraphQLClient, gql } from 'graphql-request'
import { GITHUB_TOKEN } from './token'

const url = 'https://api.github.com/graphql'
const client = new GraphQLClient(url, {headers:{
	authorization: `Bearer ${GITHUB_TOKEN}`
}})

// fetch PRs
export async function fetchPRs(){
	const query = gql``

	return await client.request(query)
}
// type created for returned value

// store PRs
