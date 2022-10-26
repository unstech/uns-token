const { expect } = require("chai");
const { ethers } = require("hardhat");
const crypto = require('crypto');
const {
  BN,           // Big Number support
  balance,
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');

async function getTestWallet(signer) {
    const id = crypto.randomBytes(32).toString('hex');
    const privateKey = "0x" + id;
    let testWallet = new ethers.Wallet(privateKey);
    await signer.sendTransaction({
      to: testWallet.address,
      value: ethers.utils.parseEther("1.0"),
    });
    testWallet = testWallet.connect(ethers.provider);
    return testWallet;
}

describe("UNS Token constants test", function () {
  it("Should return the UNS constants", async function () {
    const [signer] = await ethers.getSigners();

    const totalSupply = ethers.utils.parseEther("1000000000");
    const UnsToken = await ethers.getContractFactory("UnsToken");
    const unsToken = await UnsToken.deploy(totalSupply);
    await unsToken.deployed();

    expect(await unsToken.totalSupply()).to.equal(totalSupply);
    expect(await unsToken.balanceOf(signer.address)).to.equal(totalSupply);
    expect(await unsToken.symbol()).to.equal("UNS");
    expect(await unsToken.name()).to.equal("UNS Token");
    expect(await unsToken.decimals()).to.equal(18);

  });
});

describe("UNS Token transfer", function () {
  it("Should test the UNS transfer", async function () {
    const [signer] = await ethers.getSigners();
    const testWallet = await getTestWallet(signer);

    const totalSupply = ethers.utils.parseEther("1000000000");
    const UnsToken = await ethers.getContractFactory("UnsToken");
    const unsToken = await UnsToken.deploy(totalSupply);
    await unsToken.deployed();

    let amountToTransfer = ethers.utils.parseEther("1000");

    await unsToken.transfer(testWallet.address, amountToTransfer);
    expect(await unsToken.balanceOf(testWallet.address)).to.equal(amountToTransfer);

    await unsToken.connect(testWallet).transfer(signer.address, amountToTransfer);
    expect(await unsToken.balanceOf(testWallet.address)).to.equal(0);

  });
});
