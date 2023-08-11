window.addEventListener('load', async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
    } else {
        window.alert('Please download MetaMask');
        return;
    }

    const contractABI = [
        {
            "inputs": [],
            "name": "TestATransaction",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "ADonation",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [],
            "name": "charityOrganization",
            "outputs": [
                {
                    "internalType": "address payable",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address payable",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];
    const contractAddress = "0xb39A5E7A6eCaC69Fc186a6C2EF0a424fc8d5412b";
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    document.getElementById('TestTransaction').addEventListener('click', async () => {
        const accounts = await web3.eth.getAccounts();
        const gasEstimation = await contract.methods.TestATransaction().estimateGas({ from: accounts[0], value: web3.utils.toWei('0.1', 'ether') });
        const gasLimit = Math.ceil(gasEstimation * 1.2); // Add a buffer of 20% to the estimated gas
        await contract.methods.TestATransaction().send({ from: accounts[0], value: web3.utils.toWei('0.1', 'ether'), gas: gasLimit });
    });

    document.getElementById('Donation').addEventListener('click', () => {
        // Show the modal when the "Plant a Tree" button is clicked
        const modal = document.getElementById('donationModal');
        const closeButton = document.getElementsByClassName('close-button')[0];
        modal.style.display = 'block';

        closeButton.onclick = function() {
            modal.style.display = 'none';
        }
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
    });

    document.getElementById('confirmDonation').addEventListener('click', async () => {
        const amount = document.getElementById('donationAmount').value;
        if (!amount || isNaN(amount)) return;
        const accounts = await web3.eth.getAccounts();
        const gasEstimation = await contract.methods.plantATree().estimateGas({ from: accounts[0], value: web3.utils.toWei(amount, 'ether') });
        const gasLimit = Math.ceil(gasEstimation * 1.2);
        await contract.methods.ADonation().send({ from: accounts[0], value: web3.utils.toWei(amount, 'ether'), gas: gasLimit });
        document.getElementById('donationModal').style.display = 'none';
    });
});

$('#addNetwork').click(async function () {
    try {
        const provider = window.ethereum;
        if (provider) {
            const chainId = '0x' + parseInt(14853).toString(16); // Chain-id has been changed.
            await provider.request({
                method: 'wallet_addEthereumChain',
                params: [
                    {
                        chainId: chainId,
                        chainName: 'Humanode Testnet 5',
                        nativeCurrency: {
                            name: 'eHMND',
                            symbol: 'eHMND',
                            decimals: 18,
                        },
                        rpcUrls: ['https://explorer-rpc-ws.testnet5.stages.humanode.io'],
                        blockExplorerUrls: ['https://explorer.testnet5.stages.humanode.io'],
                    },
                ],
            });
        } else {
            console.log('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
        }
    } catch (error) {
        console.log(error);
    }
});
