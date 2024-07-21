import hre from 'hardhat';
import PoolAddressProviderRegistryContract from '../artifacts/contracts/protocol/configuration/PoolAddressesProviderRegistry.sol/PoolAddressesProviderRegistry.json';

const ethers = hre.ethers;

async function test() {
  const ADDRESSES_PROVIDER_REGISTRY_ABI = PoolAddressProviderRegistryContract.abi;
  const ADDRESSES_PROVIDER_REGISTRY_BYTECODE = PoolAddressProviderRegistryContract.bytecode;
  const ADDRESS = '0xEcc0a6dbC0bb4D51E4F84A315a9e5B0438cAD4f0';

  const [signer] = await ethers.getSigners();

  const factory = new ethers.ContractFactory(
    ADDRESSES_PROVIDER_REGISTRY_ABI,
    ADDRESSES_PROVIDER_REGISTRY_BYTECODE,
    signer
  );
  const contract = factory.attach(ADDRESS);

  // test function call
  const res = await contract.getAddressesProvidersList();
  console.log(res);
}

test()
  .then(() => {
    console.log('Test done');
  })
  .catch((error) => {
    console.error(error);
  });
