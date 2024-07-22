import hre from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import { PoolAddressesProvider__factory } from '../types/factories/protocol/configuration/index';

async function registerContractsToProvider(
  signer: SignerWithAddress,
  poolAddressProvider: string,
  ACLManager: string,
  poolDataProvider: string,
  poolConfigurator: string
) {
  const poolAddressProviderInstance = new PoolAddressesProvider__factory(signer).attach(
    poolAddressProvider
  );

  // register poolDataProvider, no proxy
  console.log('Registering poolDataProvider...');
  await poolAddressProviderInstance.setPoolDataProvider(poolDataProvider);

  // register poolConfigurator implementation and deploys a proxy
  console.log('Registering poolConfiguratorImplementation...');
  await poolAddressProviderInstance.setPoolConfiguratorImpl(poolConfigurator);

  // register poolImpl
  console.log('Registering poolImplementation...');
  await poolAddressProviderInstance.setPoolImpl(poolConfigurator);

  // register ACL Manager to the pool Provider
  await poolAddressProviderInstance.setACLManager(ACLManager);
}

// TODO: group all registration together and deploys together
// pool related contracts are deployed as implementations and registered to the
// poolAddressProvider which will deploy the relevant proxy contracts and link the
// provider implemenation address
// e.g Pool, PoolConfigurator
// Non proxied contracts: poolDataProvider, priceOracleSentinel, priceOracle

// registers a pool configurator to the poolAddressProvider
