import hre from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import { PoolAddressesProvider__factory } from '../types/factories/protocol/configuration/PoolAddressesProvider__factory';
import { PoolAddressesProviderRegistry__factory } from '../types/factories/protocol/configuration/PoolAddressesProviderRegistry__factory';
import { ACLManager__factory } from '../types/factories/protocol/configuration/ACLManager__factory';

const ethers = hre.ethers;

// deploys poolAddressesProvider contract
async function deployPoolAddressProvider(marketId: string, owner: SignerWithAddress) {
  try {
    const factory = new PoolAddressesProvider__factory(owner);
    console.log('Deploying PoolAddressesProvider contract...');
    const contract = await factory.deploy(marketId, owner.address);
    const contractInstance = await contract.deployed();

    // set ACLAdmin address
    await contractInstance.setACLAdmin(owner.address);

    return contractInstance;
  } catch (error) {
    let err = new Error('error deploying PoolAddressesProvider');
    err.message += error;
    throw err;
  }
}

// deploys deployPoolAddressProviderRegistry and registers a poolAddressesProvider contract to the registry
async function deployPoolAddressProviderRegistry(owner: SignerWithAddress) {
  try {
    console.log('Deploying PoolAddressesProviderRegistry contract...');

    const factory = new PoolAddressesProviderRegistry__factory(owner);
    const contract = await factory.deploy(owner.address);
    const registryInstance = await contract.deployed();
    console.log('Registry deployed');

    return registryInstance;
  } catch (error) {
    let err = new Error('error deploying PoolAddressProviderRegistry');
    err.message += error;
    throw err;
  }
}

// deploys ACLManager contract
async function deployACLManager(signer: SignerWithAddress, providerAddress: string) {
  try {
    const factory = new ACLManager__factory(signer);
    console.log('Deploying ACLManager contract...');
    const contract = await factory.deploy(providerAddress);
    const contractInstance = await contract.deployed();

    return contractInstance;
  } catch (error) {
    let err = new Error('error deploying ACLManager');
    err.message += error;
    throw err;
  }
}

async function deployConfiguration() {
  const marketId = 'test-market';
  const [owner] = await ethers.getSigners();

  console.log('Deploying configuration...');
  // Step 1: PoolAddressesProvider
  const poolAddressProvider = await deployPoolAddressProvider(marketId, owner);
  if (!poolAddressProvider) {
    throw new Error('Error deploying PoolAddressesProvider contract');
  }

  // Step 2: PoolAddressesProviderRegistry
  const poolAddressProviderRegistry = await deployPoolAddressProviderRegistry(owner);

  // Step 3: ACLManager
  const ACLManager = await deployACLManager(owner, poolAddressProvider.address);

  // Step 4: Register PoolAddressesProvider contract with PoolAddressesProviderRegistry
  await poolAddressProviderRegistry.registerAddressesProvider(poolAddressProvider.address, 1);

  console.log('PoolAddressesProvider address:', poolAddressProvider.address);
  console.log('PoolAddressesProviderRegistry address:', poolAddressProviderRegistry.address);
  console.log('ACLManager address:', ACLManager.address);

  console.log('Configuration deployed...');
}

// run
deployConfiguration().catch((error) => console.error('Error deploying configuration', error));
