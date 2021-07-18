import { getPullRequests } from ".";
jest.setTimeout(20000)
describe('index', ()=>{
	it('fetchPRs runs', async ()=>{
		const results = await getPullRequests()
		console.log(results)
	})
})