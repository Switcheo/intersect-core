import hre from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import { PoolConfigurator__factory, Pool__factory } from '../types/factories/protocol/pool/index';
import { AaveProtocolDataProvider__factory } from '../types/factories/misc/index';
import { libraryAddresses } from './DeployLibrary';

const ethers = hre.ethers;

// deploys the pool configurator implementation
async function deployPoolConfiguratorImplementation(
  signer: SignerWithAddress,
  libraryAddresses: libraryAddresses
) {
  try {
    const factory = new PoolConfigurator__factory({
      ['contracts/protocol/libraries/logic/ConfiguratorLogic.sol:ConfiguratorLogic']:
        libraryAddresses.configuratorLogic,
    });

    console.log('Deploying PoolConfigurator contract...');
    const contract = await factory.deploy();
    const contractInstance = await contract.deployed();

    return contractInstance;
  } catch (error) {
    let err = new Error('error deploying PoolConfigurator');
    err.message += error;
    throw err;
  }
}

// deploy poolDataProvider
async function deployProtocolDataProvider(signer: SignerWithAddress, poolAddressProvider: string) {
  try {
    const factory = new AaveProtocolDataProvider__factory(signer);

    console.log('Deploying AaveProtocolDataProvider contract...');
    const contract = await factory.deploy(poolAddressProvider);
    const contractInstance = await contract.deployed();

    return contractInstance;
  } catch (error) {
    let err = new Error('error deploying AaveProtocolDataProvider');
    err.message += error;
    throw err;
  }
}

// deploy pool implementation
async function deployPoolImplementation(
  signer: SignerWithAddress,
  libraryAddresses: libraryAddresses,
  poolAddressProvider: string
) {
  try {
    const factory = new Pool__factory(
      {
        ['contracts/protocol/libraries/logic/LiquidationLogic.sol:LiquidationLogic']:
          libraryAddresses.liquidationLogic,
        ['contracts/protocol/libraries/logic/SupplyLogic.sol:SupplyLogic']:
          libraryAddresses.supplyLogic,
        ['contracts/protocol/libraries/logic/EModeLogic.sol:EModeLogic']:
          libraryAddresses.eModeLogic,
        ['contracts/protocol/libraries/logic/BorrowLogic.sol:BorrowLogic']:
          libraryAddresses.borrowsLogic,
        ['contracts/protocol/libraries/logic/FlashLoanLogic.sol:FlashLoanLogic']:
          libraryAddresses.flashLoanLogic,
        ['contracts/protocol/libraries/logic/PoolLogic.sol:PoolLogic']: libraryAddresses.poolLogic,
        ['contracts/protocol/libraries/logic/BridgeLogic.sol:BridgeLogic']:
          libraryAddresses.bridgeLogic,
      },
      signer
    );
    console.log('Deploying Pool contract...');
    const contract = await factory.deploy(poolAddressProvider);
    const contractInstance = await contract.deployed();

    return contractInstance;
  } catch (error) {
    let err = new Error('error deploying Pool');
    err.message += error;
    throw err;
  }
}
