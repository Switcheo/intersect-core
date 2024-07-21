import hre from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import { PoolConfigurator__factory } from '../types/factories/protocol/pool/PoolConfigurator__factory';
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

    console.log('Deploying ACLManager contract...');
    const contract = await factory.deploy();
    const contractInstance = await contract.deployed();

    return contractInstance;
  } catch (error) {
    let err = new Error('error deploying ACLManager');
    err.message += error;
    throw err;
  }
}

// deploy
// deploy poolDataProvider

// TODO: group all registration together and deploys together
// pool related contracts are deployed as implementations and registered to the
// poolAddressProvider which will deploy the relevant proxy contracts and link the
// provider implemenation address
// e.g Pool, PoolConfigurator
// Non proxied contracts: poolDataProvider, priceOracleSentinel, priceOracle

// registers a pool configurator to the poolAddressProvider
