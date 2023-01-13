const { assert } = require('chai')

const ShoesToken = artifacts.require('./ShoesToken')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('ShoesToken', (accounts) => {
    let ShoesToken

    beforeEach( async () => {
        ShoesToken = await ShoesToken.deployed()
    })

    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = ShoesToken.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('has a name', async () => {
            const name = await ShoesToken.name()
            assert.equal(name, 'ShoesToken')
        })

        it('has a symbol', async () => {
            const symbol = await ShoesToken.symbol()
            assert.equal(symbol, 'SHTK')
        })
    })

    describe('minting', async () => {
        it('creates a new token', async () => {
            const result = await ShoesToken.mint('#EC058E')

            const event = result.logs[0].args
            const tokenId = event.tokenId.toNumber()
            const totalSupply = await ShoesToken.totalSupply()
            const item = await ShoesToken.Items(tokenId)
            const owner = await ShoesToken.ownerOf(tokenId)
            const approvedAddress = await ShoesToken.getApproved(tokenId)
            console.log(approvedAddress)

            //success
            assert.equal(tokenId, totalSupply, 'id is correct')
            assert.equal(item.uri, '#EC058E', 'color is correct')
            assert.equal(item.creator, owner, 'creator is correct')
            // assert.equal(approvedAddress, market.address, 'approved address is correct')
            assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
            assert.equal(event.to, accounts[0], 'to is correct')
        })
    })

    describe('indexing', async () => {
        it('lists colors', async () => {
            //mint 3 more tokens
            await ShoesToken.mint('#5386E4')
            await ShoesToken.mint('#FFFFFF')
            await ShoesToken.mint('#000000')

            const totalSupply = await ShoesToken.totalSupply()
            let item
            let result = []

            for (var i=1; i <= totalSupply; i++){
                item = await ShoesToken.Items(i)
                result.push(item.uri)
            }

            let expected = ['#EC058E', '#5386E4', '#FFFFFF', '#000000']
            assert.equal(result.join(','), expected.join(','))
        })
    })
})