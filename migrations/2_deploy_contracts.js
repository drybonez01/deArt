const ShoesToken = artifacts.require("ShoesToken");
const ShoesMarket = artifacts.require("ShoesMarket");

module.exports = async function(deployer) {
    await deployer.deploy(ShoesToken);

    const token = await ShoesToken.deployed()

    await deployer.deploy(ShoesMarket, token.address)

    const market = await ShoesMarket.deployed()

    await token.setMarketplace(market.address)
};

