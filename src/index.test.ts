import { getPullRequests } from "./getPullRequests";
jest.setTimeout(60000)
describe('index', ()=>{
	it('fetchPRs runs', async ()=>{
		const results = await getPullRequests('ramda', 'ramda')
		console.log(results.length)
	})
})