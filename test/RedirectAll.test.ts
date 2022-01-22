import chai from "chai";
import { ethers, network } from "hardhat";
import { solidity } from "ethereum-waffle";
import { RedirectAll} from "../typechain-types";
import hostABI from "@superfluid-finance/ethereum-contracts/build/contracts/Superfluid.json";
import cfaABI from "@superfluid-finance/ethereum-contracts/build/contracts/ConstantFlowAgreementV1.json";
import fUSDCxABI from "./helpers/contracts/fUSDCx.json";
import type { Contract } from "ethers";

chai.use(solidity);
const { expect } = chai;

const HOST_ADDRESS = "0x22ff293e14F1EC3A09B137e9e06084AFd63adDF9";
const CFAv1_ADDRESS = "0xEd6BcbF6907D4feEEe8a8875543249bEa9D308E8";
const fUSDCx_ADDRESS = "0x8aE68021f6170E5a766bE613cEA0d75236ECCa9a ";

const mineBlocks = async () => {
  for (let i = 0; i < 10; i++) {
    await network.provider.request({
      method: "evm_mine",
      params: [],
    });
  }
};

describe("RedirectAll", function () {
  let redirectAll: RedirectAll;
  let host: Contract;
  let cfa: Contract;
  let superUSD: Contract;

  beforeEach(async () => {
    const [admin, consumer1] = await ethers.getSigners();

    const redirectAllFactory = await ethers.getContractFactory(
      "RedirectAll",
      admin,
    );
    redirectAll = (await redirectAllFactory.deploy(
      HOST_ADDRESS,
      CFAv1_ADDRESS,
      fUSDCx_ADDRESS,
      admin.address,
    )) as RedirectAll;

    host = new ethers.Contract(HOST_ADDRESS, hostABI.abi);
    cfa = new ethers.Contract(CFAv1_ADDRESS, cfaABI.abi);
    superUSD = new ethers.Contract(fUSDCx_ADDRESS, fUSDCxABI);
  });

  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello world!");

    const setGreetingTx = await greeter.setGreeting("Hola mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola mundo!");
  });
});
