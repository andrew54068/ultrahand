import {UltrahandComponent} from "../core/ultrahandComponent";
import {Web3} from "web3";
import {UltrahandWallet} from "../core/ultrahandWallet";

export class OneInchComponent extends UltrahandComponent {


    chainId = 137; // polygon mainnet
    web3RpcUrl = 'https://rpc.payload.de'; // The URL for the BSC node you want to connect to
    apiBaseUrl = 'https://api.1inch.io/v5.0/' + this.chainId;
    web3 = new Web3(this.web3RpcUrl);
    tokenSetting = {
        polygon: {
            usdc: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
            matic: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
        }
    }

    static id() {
        return "1inchComponent"
    }

    async run(inputs) {
        if (!inputs || inputs.length < 1) {
            throw new Error("input 0 is required")
        }

        let fromTokenAddress = ''
        let toTokenAddress = ''
        if (inputs[0].optionIndex === 0) {
            fromTokenAddress = this.tokenSetting.polygon.usdc
            toTokenAddress = this.tokenSetting.polygon.matic
        } else {
            fromTokenAddress = this.tokenSetting.polygon.matic
            toTokenAddress = this.tokenSetting.polygon.usdc
        }

        let walletAddress = UltrahandWallet.currentWallet.currentAddress()
        const swapParams = {
            fromTokenAddress: fromTokenAddress, // The address of the token you want to swap from (1INCH)
            toTokenAddress: toTokenAddress, // The address of the token you want to swap to (DAI)
            amount: inputs[0].value, // The amount of the fromToken you want to swap (in wei)
            fromAddress: walletAddress, // Your wallet address from which the swap will be initiated
            slippage: 1, // The maximum acceptable slippage percentage for the swap (e.g., 1 for 1%)
            disableEstimate: true, // Whether to disable estimation of swap details (set to true to disable)
            allowPartialFill: false, // Whether to allow partial filling of the swap order (set to true to allow)
        };

        let allowance = await this.checkAllowance(swapParams.fromTokenAddress, walletAddress);
        console.log('Allowance: ', allowance);

        const txData = await this.buildTxForApproveTradeWithRouter(swapParams.fromTokenAddress);
        console.log('Transaction for approve: ', txData);

        this.addInvoke({
            to: txData.to,
            data: txData.data,
            value: parseInt(txData.value, 10).toString(16),
        })

        // First, let's build the body of the transaction
        const swapTransaction = await this.buildTxForSwap(swapParams);
        console.log('Transaction for swap: ', swapTransaction);
        this.addInvoke({
            to: swapTransaction.tx.to,
            data: swapTransaction.tx.data,
            value: parseInt(swapTransaction.tx.value, 10).toString(16),
        })

        this.output = [
            {
                name: "Token: "+ (inputs[0].optionIndex === 0 ? 'MATIC' : 'USDC'),
                description: "To token for swap",
                valueType: "string",
                value: swapTransaction.toTokenAmount
            }
        ]
    }

    // Construct full API request URL
    apiRequestUrl(methodName, queryParams) {
        return this.apiBaseUrl + methodName + '?' + (new URLSearchParams(queryParams)).toString();
    }

    checkAllowance(tokenAddress, walletAddress) {
        return fetch(this.apiRequestUrl('/approve/allowance', {tokenAddress, walletAddress}))
            .then(res => res.json())
            .then(res => res.allowance);
    }

    async buildTxForApproveTradeWithRouter(tokenAddress, amount) {
        const url = this.apiRequestUrl(
            '/approve/transaction',
            amount ? {tokenAddress, amount} : {tokenAddress}
        );

        const transaction = await fetch(url).then(res => res.json());
        return transaction;
    }

    async buildTxForSwap(swapParams) {
        const url = this.apiRequestUrl('/swap', swapParams);

        // Fetch the swap transaction details from the API
        return fetch(url)
            .then(res => res.json())
            .then(res => res);
    }

    inputOptions() {
        return [
            {
                name: "USDC",
                description: "From token for swap",
                valueType: "string",
            },
            {
                name: "MATIC",
                description: "From token for swap",
                valueType: "string",
            },
        ]
    }

}