import hre from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { logic } from '../types/factories/protocol/libraries/index';

const ethers = hre.ethers;

export interface libraryAddresses {
  borrowsLogic: string;
  bridgeLogic: string;
  configuratorLogic: string;
  eModeLogic: string;
  flashLoanLogic: string;
  supplyLogic: string;
  poolLogic: string;
  liquidationLogic: string;
  reserveLogic: string;
  validationLogic: string;
}

export async function deployLogicLibraries(signer: SignerWithAddress) {
  try {
    const borrowsLogicFactory = new logic.BorrowLogic__factory(signer);
    const borrowsLogicContract = await borrowsLogicFactory.deploy();
    const borrowsLogicInstance = await borrowsLogicContract.deployed();

    const bridgeLogicFactory = new logic.BridgeLogic__factory(signer);
    const bridgeLogicContract = await bridgeLogicFactory.deploy();
    const bridgeLogicInstance = await bridgeLogicContract.deployed();

    const configuratorLogicFactory = new logic.ConfiguratorLogic__factory(signer);
    const configuratorLogicContract = await configuratorLogicFactory.deploy();
    const configuratorLogicInstance = await configuratorLogicContract.deployed();

    const eModeLogicFactory = new logic.EModeLogic__factory(signer);
    const eModeLogicContract = await eModeLogicFactory.deploy();
    const eModeLogicInstance = await eModeLogicContract.deployed();

    const flashLoanLogicFactory = new logic.FlashLoanLogic__factory(
      {
        ['contracts/protocol/libraries/logic/BorrowLogic.sol:BorrowLogic']:
          borrowsLogicInstance.address,
      },
      signer
    );
    const flashLoanLogicContract = await flashLoanLogicFactory.deploy();
    const flashLoanLogicInstance = await flashLoanLogicContract.deployed();

    const supplyLogicFactory = new logic.SupplyLogic__factory(signer);
    const supplyLogicContract = await supplyLogicFactory.deploy();
    const supplyLogicInstance = await supplyLogicContract.deployed();

    const poolLogicFactory = new logic.PoolLogic__factory(signer);
    const poolLogicContract = await poolLogicFactory.deploy();
    const poolLogicInstance = await poolLogicContract.deployed();

    const liquidationLogicFactory = new logic.LiquidationLogic__factory(signer);
    const liquidationLogicContract = await liquidationLogicFactory.deploy();
    const liquidationLogicInstance = await liquidationLogicContract.deployed();

    const reserveLogicFactory = new logic.ReserveLogic__factory(signer);
    const reserveLogicContract = await reserveLogicFactory.deploy();
    const reserveLogicInstance = await reserveLogicContract.deployed();

    const validationLogicFactory = new logic.ValidationLogic__factory(signer);
    const validationLogicContract = await validationLogicFactory.deploy();
    const validationLogicInstance = await validationLogicContract.deployed();

    return {
      borrowsLogic: borrowsLogicInstance.address,
      bridgeLogic: bridgeLogicInstance.address,
      configuratorLogic: configuratorLogicInstance.address,
      eModeLogic: eModeLogicInstance.address,
      flashLoanLogic: flashLoanLogicInstance.address,
      supplyLogic: supplyLogicInstance.address,
      poolLogic: poolLogicInstance.address,
      liquidationLogic: liquidationLogicInstance.address,
      reserveLogic: reserveLogicInstance.address,
      validationLogic: validationLogicInstance.address,
    };
  } catch (error) {
    console.error('Error deploying libraries:', error);
  }
}

async function main() {
  const signer = (await ethers.getSigners())[0];
  deployLogicLibraries(signer);
}

main().catch((error) => {
  console.error('Error deploying libraries:', error);
});
