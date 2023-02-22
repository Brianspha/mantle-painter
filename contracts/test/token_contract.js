const { SignerWithAddress } = require("@nomiclabs/hardhat-ethers/signers");
const { expect } = require("chai");
const { ethers, upgrades, waffle } = require("hardhat");
const { LocalTableland, getAccounts } = require("@tableland/local");
const utils = require("web3-utils");
const randomColor = require("randomcolor");

const lt = new LocalTableland({
  // use the silent option to avoid cluttering the test output
  silent: true,
});
describe("Token contract", function () {
  let deployer, alice, jane, tokenContract, registry, mantlePainterContract;
  before(async function () {
    this.timeout(25000);
    lt.start();
    await lt.isReady();
    console.log(
      "================================================Assigning singers================================================"
    );
    [deployer, alice, jane] = await ethers.getSigners();
    console.log(
      "================================================Deploying SQLHelpers library================================================"
    );

    const SQLHelpersFactory = await ethers.getContractFactory("SQLHelpers");
    const sqlHelpers = await SQLHelpersFactory.deploy();
    await sqlHelpers.deployed();
    console.log(
      `================================================SQLHelpers library deployed at ${sqlHelpers.address}================================================`
    );
    console.log(
      "================================================Deploying SafeMathV2 library================================================"
    );

    const SafeMathV2Factory = await ethers.getContractFactory("SafeMathV2");
    const safeMathV2 = await SafeMathV2Factory.deploy();
    await safeMathV2.deployed();
    console.log(
      `================================================SafeMathV2 library deployed at ${safeMathV2.address}================================================`
    );
    console.log(
      "================================================Deploying TablelandTables================================================"
    );
    const RegistryFactory = await ethers.getContractFactory("TablelandTables");
    registry = await RegistryFactory.deploy();
    await registry.deployed();
    await registry.connect(deployer).initialize("http://localhost:8080/");
    console.log(
      `================================================TablelandTables deployed at ${registry.address}================================================`
    );
    console.log(
      "================================================Deploying TokenContract================================================"
    );
    const TokenContract = await ethers.getContractFactory("TokenContract", {
      libraries: {
        SQLHelpers: sqlHelpers.address,
      },
    });
    tokenContract = await TokenContract.deploy(
      "https://testnet.tableland.network/query?s=",
      "not.implemented.com",
      registry.address
    );

    tokenContract.deployed();
    console.log(
      `================================================TokenContract deployed at ${tokenContract.address}================================================`
    );
    console.log(
      "================================================Deploying MantlePainter================================================"
    );
    const MantlePainter = await ethers.getContractFactory("MantlePainter");
    mantlePainterContract = await MantlePainter.deploy(tokenContract.address);
    await mantlePainterContract.deployed();
    console.log(
      `================================================MantlePainter deployed at ${mantlePainterContract.address}================================================`
    );
  });

  it("Should set the Mantle Painter address on the token contract", async () => {
    const tx = await tokenContract
      .connect(deployer)
      .setContractMantlePainterAddress(mantlePainterContract.address);
    expect(
      (await tokenContract.mantlePainterAddress()) ===
        mantlePainterContract.address,
      "MantlePainter address not set"
    );
  });
  it("Should mint a new token for alice", async () => {
    const color = randomColor();
    const tx = await mantlePainterContract
      .connect(alice)
      .colorPixel(0, color, { value: ethers.utils.parseEther("1") });
    const events = (await tx.wait()).events;
    const transferEvent = events[events.length - 1].args;

    expect(transferEvent.owner === alice.address, "Alice doesnt own pixel");
  });
  it("Should mint a new token for jane", async () => {
    const color = randomColor();
    const tx = await mantlePainterContract
      .connect(jane)
      .colorPixel(1, color, { value: ethers.utils.parseEther("1") });
    const events = (await tx.wait()).events;
    const transferEvent = events[events.length - 1].args;

    expect(transferEvent.owner === jane.address, "Alice doesnt own pixel");
  });
  it("Should mint a new token for jane and fail", async () => {
    const color = randomColor();
    await expect(
      mantlePainterContract
        .connect(alice)
        .colorPixel(1, color, { value: ethers.utils.parseEther("1") })
    ).to.be.revertedWith("Pixel occupied");
  });

  it("Should get alices tokenURI", async () => {
    const tokenURI = await tokenContract.tokenURI(0);
    console.log("tokenURI: ", tokenURI);
  });
});
