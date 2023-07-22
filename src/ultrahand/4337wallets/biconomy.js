import { UltrahandWallet } from '../core/ultrahandWallet';
import { ethers } from 'ethers';
import { IBundler, Bundler } from '@biconomy/bundler';
import { BiconomySmartAccount, BiconomySmartAccountConfig, DEFAULT_ENTRYPOINT_ADDRESS } from '@biconomy/account';
import { IPaymaster, BiconomyPaymaster } from '@biconomy/paymaster';

export class Biconomy extends UltrahandWallet {
  biconomyAddress = '';
  biconomySmartAccount = null;
  //   ethAdapterOwner1 = null;
  //   signer = null;

  constructor() {
    super();
  }

  currentAddress() {
    return this.safeAddress;
  }

  offChainSignTx() {}

  async connect() {
    if (!window.ethereum) throw new Error(`metamask not found.`);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    this.signer = web3Provider.getSigner();

    const signerAddress = await this.signer.getAddress();
    console.log(`💥 signerAddress: ${signerAddress}`);
    const signerChainId = await this.signer.getChainId();
    console.log(`💥 signerChainId: ${signerChainId}`);
    const default_entrypoint_address = '0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789'
    const bundler: IBundler = new Bundler({
      bundlerUrl: 'https://api.stackup.sh/v1/node/6cfaddddd4a050ba516d9abbdbbbb4aea90232281a746c07759cee1f6c50507e', // you can get this value from biconomy dashboard.
      chainId: signerChainId,
      entryPointAddress: default_entrypoint_address
    });

    // const paymaster: IPaymaster = new BiconomyPaymaster({
    //   paymasterUrl: 'https://paymaster.biconomy.io/api/v1/80001/'
    // });

    try {
      const biconomySmartAccountConfig: BiconomySmartAccountConfig = {
        signer: web3Provider.getSigner(),
        chainId: signerChainId,
        bundler: bundler,
        // paymaster: paymaster
      };
      let biconomySmartAccount = new BiconomySmartAccount(biconomySmartAccountConfig);
      biconomySmartAccount = await biconomySmartAccount.init();
      this.biconomySmartAccount = biconomySmartAccount;
      console.log('owner: ', biconomySmartAccount.owner);
      const smartAccountAddress = biconomySmartAccount.getSmartAccountAddress();
      console.log('address: ', await biconomySmartAccount.getSmartAccountAddress());
      console.log('deployed: ', await biconomySmartAccount.isAccountDeployed(await biconomySmartAccount.getSmartAccountAddress()));
      this.biconomyAddress = smartAccountAddress;
      const code = await web3Provider.getCode(smartAccountAddress);
      if (code === '0x') {
        /**
         * deploy address
         */
        
      }
    } catch (err) {
      console.log('error setting up smart account... ', err);
    }


    UltrahandWallet.setCurrentWallet(this);
  }

  async simulateTx(unsignedUOP) {
    return { data: unsignedUOP };
  }

  async sendTx(signedUOP) {
    const partialUserOp = signedUOP.data;
    const userOpResponse = await smartAccount.sendUserOp(partialUserOp);
    const transactionDetails = await userOpResponse.wait();
    console.log(`💥 transactionDetails: ${JSON.stringify(transactionDetails, null, '  ')}`);
    // console.log('Transaction executed: ');
    // console.log(`https://www.jiffyscan.xyz/bundle/${receipt.transactionHash}?network=matic&pageNo=0&pageSize=10`);
  }

  isBatchSupported() {
    return true;
  }

  packTx(invoke) {
    return {
      to: invoke.to,
      value: invoke.value,
      data: invoke.data
    };
  }

  async packBatchTx(invokes) {
    console.log('packBatchTx', invokes);

    const biconomyTransactionData = invokes.map((invoke) => {
      return {
        to: invoke.to,
        value: invoke.value.startsWith('0x') ? ethers.BigNumber.from(invoke.value).toString(10) : invoke.value,
        data: invoke.data.length === 0 ? '0x' : invoke.data
      };
    });

    let partialUserOp = await biconomySmartAccount.buildUserOp(biconomyTransactionData);

    // const biconomyPaymaster = biconomySmartAccount.paymaster;

    // let paymasterServiceData: SponsorUserOperationDto = {
    //   mode: PaymasterMode.SPONSORED
    //   // optional params...
    // };

    // const paymasterAndDataResponse = await biconomyPaymaster.getPaymasterAndData(partialUserOp, paymasterServiceData);
    // partialUserOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;

    return {
      data: partialUserOp
    };
  }
}
