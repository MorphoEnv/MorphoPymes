import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { network } from "hardhat";

describe("MoPy Tests", async function () {
  const { viem } = await network.connect();

  it("Should deploy new MoPy and test all functionality", async function () {
    const [owner, minter, user] = await viem.getWalletClients();
    
    const token = await viem.deployContract("MoPy", [minter.account.address]);

    const name = await token.read.name();
    const symbol = await token.read.symbol();
    const decimals = await token.read.decimals();
    
    assert.equal(name, "MoPy Token");
    assert.equal(symbol, "MPY");
    assert.equal(decimals, 18);

    const mintTx = await token.write.mint([user.account.address, 1000n], { account: minter.account });
    await viem.getPublicClient().then(client => client.waitForTransactionReceipt({ hash: mintTx }));

    const balance = await token.read.balanceOf([user.account.address]);
    assert.equal(balance, 1000n);

    const supply = await token.read.totalSupply();
    assert.equal(supply, 1000n);
  });

  it("Should test burn functionality", async function () {
    const [owner, minter, user] = await viem.getWalletClients();
    
    const token = await viem.deployContract("MoPy", [minter.account.address]);

    await token.write.mint([user.account.address, 1000n], { account: minter.account });

    const burnTx = await token.write.burn([user.account.address, 300n], { account: minter.account });
    await viem.getPublicClient().then(client => client.waitForTransactionReceipt({ hash: burnTx }));

    const balance = await token.read.balanceOf([user.account.address]);
    assert.equal(balance, 700n);

    const supply = await token.read.totalSupply();
    assert.equal(supply, 700n);
  });

  it("Should test minter contract update with normalized addresses", async function () {
    const [owner, oldMinter, newMinter] = await viem.getWalletClients();
    
    const token = await viem.deployContract("MoPy", [oldMinter.account.address]);

    await token.write.updateMinterContract([newMinter.account.address], { account: owner.account });

    const currentMinter = await token.read.minterContract();
    assert.equal(currentMinter.toLowerCase(), newMinter.account.address.toLowerCase());
  });
});