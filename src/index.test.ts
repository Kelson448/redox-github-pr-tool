import { helloWorld } from ".";

describe('index', ()=>{
	it('is able to test a function', ()=>{
		expect(helloWorld()).toContain('Hello World!')
	})
})