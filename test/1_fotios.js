const Fotios = artifacts.require("./Fotios.sol");
const {
    BN,
    time,
    ether,
    balance,
    constants,
    expectEvent,
    expectRevert
} = require('openzeppelin-test-helpers');

const {
    expect
} = require('chai');

var assert = require('assert');

contract("Fotios", (accounts) => {
  const OWNER = accounts[0];
  const SENDER = accounts[1];
  const OTHER = accounts[2];

  let sc;

  beforeEach("setup", async () => {
    await time.advanceBlock();
    sc = await Fotios.new();
  });

  describe("Fotios tests", () => {
    it("should increase balance on fallback", async () => {
      assert.strictEqual(0, (await balance.current(sc.address, "ether")).cmp(new BN("0")), "should be 0 before");

      await web3.eth.sendTransaction({
        to: sc.address,
        from: SENDER,
        value: ether("1")
      });

      assert.strictEqual(0, (await balance.current(sc.address, "ether")).cmp(new BN("1")), "should be 1 after");
    });

    it("should fail if not OWNER on withdraw", async () => {
      await web3.eth.sendTransaction({
        to: sc.address,
        from: SENDER,
        value: ether("1")
      });

      await expectRevert(sc.withdraw({from: OTHER}), "caller is not the owner");
    });

    it("should increase balance after withdraw for OWNER", async () => {
      await web3.eth.sendTransaction({
        to: sc.address,
        from: SENDER,
        value: ether("1")
      });

      let OWNER_balanceBefore = new BN(await web3.eth.getBalance(OWNER));
      let tx = await sc.withdraw({from: OWNER});
      let gasUsed = new BN(tx.receipt.gasUsed);
      let txInfo = await web3.eth.getTransaction(tx.tx);
      let gasPrice = new BN(txInfo.gasPrice);
      let gasSpent = gasUsed.mul(gasPrice);

      let OWNER_balanceAfter = new BN(await web3.eth.getBalance(OWNER));
      assert.strictEqual(0, OWNER_balanceBefore.add(ether("1")).sub(gasSpent).cmp(OWNER_balanceAfter), "wrong OWNER_balanceAfter");
    });

    it("should set balance to 0 for SC", async () => {
      await web3.eth.sendTransaction({
        to: sc.address,
        from: SENDER,
        value: ether("1")
      });

      assert.strictEqual(0, (await balance.current(sc.address, "ether")).cmp(new BN("1")), "should be 1 before");
      await sc.withdraw({from: OWNER});
      assert.strictEqual(0, (await balance.current(sc.address, "ether")).cmp(new BN("0")), "should be 0 after");
    });

    it("should fail if not OWNER on kill", async () => {
      await web3.eth.sendTransaction({
        to: sc.address,
        from: SENDER,
        value: ether("1")
      });

      await expectRevert(sc.kill({from: OTHER}), "caller is not the owner");
    });

    it("should increase balance after kill for OWNER", async () => {
      await web3.eth.sendTransaction({
        to: sc.address,
        from: SENDER,
        value: ether("1")
      });

      let OWNER_balanceBefore = new BN(await web3.eth.getBalance(OWNER));
      let tx = await sc.kill({from: OWNER});
      let gasUsed = new BN(tx.receipt.gasUsed);
      let txInfo = await web3.eth.getTransaction(tx.tx);
      let gasPrice = new BN(txInfo.gasPrice);
      let gasSpent = gasUsed.mul(gasPrice);

      let OWNER_balanceAfter = new BN(await web3.eth.getBalance(OWNER));
      assert.strictEqual(0, OWNER_balanceBefore.add(ether("1")).sub(gasSpent).cmp(OWNER_balanceAfter), "wrong OWNER_balanceAfter");
    });
  });
});