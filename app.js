// ==========================================
// P2P LENDING DAPP - APP.JS
// ==========================================

// ==========================================
// GLOBAL VARIABLES
// ==========================================

let provider = null;
let signer = null;
let contract = null;
let userAddress = null;


// ==========================================
// CONTRACT CONFIGURATION
// ==========================================

// YOUR DEPLOYED SEPOLIA CONTRACT
const CONTRACT_ADDRESS =
    "0x1dD04C337023260540205e966cfdDA594Bc66b2A";

// Ethereum Sepolia Chain ID
const SEPOLIA_CHAIN_ID = 11155111n;


// ==========================================
// CONTRACT ABI
// ==========================================

const CONTRACT_ABI = [

    // ------------------------------------------
    // requestLoan
    // ------------------------------------------

    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_loanAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_interestRate",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_duration",
                "type": "uint256"
            }
        ],
        "name": "requestLoan",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },

    // ------------------------------------------
    // fundLoan
    // ------------------------------------------

    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_loanId",
                "type": "uint256"
            }
        ],
        "name": "fundLoan",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },

    // ------------------------------------------
    // repayLoan
    // ------------------------------------------

    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_loanId",
                "type": "uint256"
            }
        ],
        "name": "repayLoan",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },

    // ------------------------------------------
    // claimCollateral
    // ------------------------------------------

    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_loanId",
                "type": "uint256"
            }
        ],
        "name": "claimCollateral",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },

    // ------------------------------------------
    // getLoan
    // ------------------------------------------

    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_loanId",
                "type": "uint256"
            }
        ],
        "name": "getLoan",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address payable",
                        "name": "borrower",
                        "type": "address"
                    },
                    {
                        "internalType": "address payable",
                        "name": "lender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "loanAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "collateralAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "interestRate",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "duration",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "fundedAt",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint8",
                        "name": "status",
                        "type": "uint8"
                    }
                ],
                "internalType": "struct P2PLending.Loan",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },

    // ------------------------------------------
    // loanCounter
    // ------------------------------------------

    {
        "inputs": [],
        "name": "loanCounter",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },

    // ------------------------------------------
    // getAllLoans
    // ------------------------------------------

    {
        "inputs": [],
        "name": "getAllLoans",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address payable",
                        "name": "borrower",
                        "type": "address"
                    },
                    {
                        "internalType": "address payable",
                        "name": "lender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "loanAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "collateralAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "interestRate",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "duration",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "fundedAt",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint8",
                        "name": "status",
                        "type": "uint8"
                    }
                ],
                "internalType": "struct P2PLending.Loan[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },

    // ------------------------------------------
    // getRepaymentAmount
    // ------------------------------------------

    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_loanId",
                "type": "uint256"
            }
        ],
        "name": "getRepaymentAmount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },

    // ------------------------------------------
    // isOverdue
    // ------------------------------------------

    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_loanId",
                "type": "uint256"
            }
        ],
        "name": "isOverdue",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];


// ==========================================
// LOAN STATUS
// ==========================================

const STATUS = {
    0: "Requested",
    1: "Funded",
    2: "Repaid",
    3: "Defaulted"
};


// ==========================================
// CONNECT WALLET
// ==========================================

async function connectWallet() {

    console.log("==================================");
    console.log("CONNECT WALLET BUTTON CLICKED");
    console.log("==================================");

    try {

        // --------------------------------------
        // CHECK METAMASK
        // --------------------------------------

        if (!window.ethereum) {

            alert(
                "MetaMask is not installed.\n\n" +
                "Please install MetaMask and try again."
            );

            return;
        }

        console.log("MetaMask detected");


        // --------------------------------------
        // SWITCH TO SEPOLIA
        // --------------------------------------

        try {

            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [
                    {
                        chainId: "0xaa36a7"
                    }
                ]
            });

            console.log("Switched to Sepolia");

        } catch (switchError) {

            console.error(
                "Network switch error:",
                switchError
            );

            // If Sepolia is not added
            if (switchError.code === 4902) {

                try {

                    await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                                chainId: "0xaa36a7",
                                chainName: "Sepolia Test Network",
                                nativeCurrency: {
                                    name: "Sepolia ETH",
                                    symbol: "ETH",
                                    decimals: 18
                                },
                                rpcUrls: [
                                    "https://rpc.sepolia.org"
                                ],
                                blockExplorerUrls: [
                                    "https://sepolia.etherscan.io"
                                ]
                            }
                        ]
                    });

                } catch (addError) {

                    console.error(
                        "Add Sepolia error:",
                        addError
                    );

                    alert(
                        "Unable to add Sepolia network."
                    );

                    return;
                }

            } else {

                alert(
                    "Please switch MetaMask to Sepolia Test Network."
                );

                return;
            }
        }


        // --------------------------------------
        // REQUEST ACCOUNT
        // --------------------------------------

        const accounts =
            await window.ethereum.request({
                method: "eth_requestAccounts"
            });


        if (
            !accounts ||
            accounts.length === 0
        ) {

            alert(
                "No MetaMask account selected."
            );

            return;
        }


        userAddress = accounts[0];


        console.log(
            "Wallet connected:",
            userAddress
        );


        // --------------------------------------
        // CREATE ETHERS PROVIDER
        // --------------------------------------

        provider =
            new ethers.BrowserProvider(
                window.ethereum
            );


        // --------------------------------------
        // GET SIGNER
        // --------------------------------------

        signer =
            await provider.getSigner();


        // --------------------------------------
        // GET NETWORK
        // --------------------------------------

        const network =
            await provider.getNetwork();


        console.log(
            "Network:",
            network.name
        );


        console.log(
            "Chain ID:",
            network.chainId.toString()
        );


        // --------------------------------------
        // VERIFY SEPOLIA
        // --------------------------------------

        if (
            network.chainId !==
            SEPOLIA_CHAIN_ID
        ) {

            alert(
                "Wrong network!\n\n" +
                "Please use Sepolia Test Network.\n\n" +
                "Required Chain ID: 11155111"
            );

            return;
        }


        // --------------------------------------
        // SHOW CONTRACT ADDRESS
        // --------------------------------------

        console.log(
            "Contract:",
            CONTRACT_ADDRESS
        );


        // --------------------------------------
        // CHECK CONTRACT BYTECODE
        // --------------------------------------

        const code =
            await provider.getCode(
                CONTRACT_ADDRESS
            );


        console.log(
            "Contract bytecode:",
            code
        );


        if (code === "0x") {

            alert(
                "SMART CONTRACT NOT FOUND\n\n" +

                "Contract:\n" +
                CONTRACT_ADDRESS +

                "\n\nNetwork:\n" +
                network.name +

                "\n\nChain ID:\n" +
                network.chainId.toString() +

                "\n\nPlease make sure the contract " +
                "is deployed on Sepolia."
            );

            return;
        }


        // --------------------------------------
        // CREATE CONTRACT INSTANCE
        // --------------------------------------

        contract =
            new ethers.Contract(
                CONTRACT_ADDRESS,
                CONTRACT_ABI,
                signer
            );


        console.log(
            "Smart contract connected successfully!"
        );


        // --------------------------------------
        // UPDATE WALLET BUTTON
        // --------------------------------------

        updateWalletButton();


        // --------------------------------------
        // LOAD DATA
        // --------------------------------------

        await loadLoans();

        await loadDashboard();

        await loadMyLoans();


        console.log(
            "DApp initialized successfully."
        );

    } catch (error) {

        console.error(
            "WALLET CONNECTION ERROR:",
            error
        );

        alert(
            "Wallet connection failed.\n\n" +
            getErrorMessage(error)
        );
    }
}


// ==========================================
// UPDATE WALLET BUTTON
// ==========================================

function updateWalletButton() {

    const button =
        document.getElementById(
            "connectWallet"
        );


    if (!button) {

        console.error(
            "Button #connectWallet not found."
        );

        return;
    }


    if (!userAddress) {

        button.textContent =
            "Connect Wallet";

        return;
    }


    button.textContent =
        userAddress.substring(0, 6) +
        "..." +
        userAddress.substring(
            userAddress.length - 4
        );


    button.classList.add(
        "connected"
    );
}


// ==========================================
// REQUEST LOAN
// ==========================================

async function requestLoan(event) {

    event.preventDefault();


    try {

        if (!contract) {

            alert(
                "Please connect MetaMask first."
            );

            return;
        }


        const loanAmount =
            document.getElementById(
                "loanAmount"
            ).value;


        const interestRate =
            document.getElementById(
                "interestRate"
            ).value;


        const duration =
            document.getElementById(
                "duration"
            ).value;


        const collateral =
            document.getElementById(
                "collateral"
            ).value;


        if (
            !loanAmount ||
            !interestRate ||
            !duration ||
            !collateral
        ) {

            alert(
                "Please fill all fields."
            );

            return;
        }


        if (
            Number(loanAmount) <= 0
        ) {

            alert(
                "Loan amount must be greater than zero."
            );

            return;
        }


        if (
            Number(interestRate) <= 0
        ) {

            alert(
                "Interest rate must be greater than zero."
            );

            return;
        }


        if (
            Number(collateral) <= 0
        ) {

            alert(
                "Collateral must be greater than zero."
            );

            return;
        }


        const loanAmountWei =
            ethers.parseEther(
                loanAmount
            );


        const collateralWei =
            ethers.parseEther(
                collateral
            );


        const button =
            event.target.querySelector(
                "button[type='submit']"
            );


        if (button) {

            button.disabled = true;

            button.textContent =
                "Creating Loan...";
        }


        console.log(
            "Creating loan..."
        );


        const tx =
            await contract.requestLoan(
                loanAmountWei,
                Number(interestRate),
                Number(duration),
                {
                    value: collateralWei
                }
            );


        console.log(
            "Transaction:",
            tx.hash
        );


        await tx.wait();


        alert(
            "Loan request created successfully!"
        );


        event.target.reset();


        await loadLoans();

        await loadDashboard();

        await loadMyLoans();


    } catch (error) {

        console.error(
            "Request loan error:",
            error
        );


        alert(
            getErrorMessage(error)
        );


    } finally {

        const button =
            event.target.querySelector(
                "button[type='submit']"
            );


        if (button) {

            button.disabled = false;

            button.textContent =
                "Create Loan Request";
        }
    }
}


// ==========================================
// FUND LOAN
// ==========================================

async function fundLoan(
    loanId,
    amount
) {

    try {

        if (!contract) {

            alert(
                "Please connect your wallet."
            );

            return;
        }


        const confirmed =
            confirm(
                `Fund Loan #${loanId} with ${amount} ETH?`
            );


        if (!confirmed) return;


        const amountWei =
            ethers.parseEther(
                amount
            );


        const tx =
            await contract.fundLoan(
                loanId,
                {
                    value: amountWei
                }
            );


        alert(
            "Funding transaction submitted."
        );


        console.log(
            "Funding transaction:",
            tx.hash
        );


        await tx.wait();


        alert(
            "Loan funded successfully!"
        );


        await loadLoans();

        await loadDashboard();

        await loadMyLoans();


    } catch (error) {

        console.error(
            "Fund loan error:",
            error
        );


        alert(
            getErrorMessage(error)
        );
    }
}


// ==========================================
// REPAY LOAN
// ==========================================

async function repayLoan(
    loanId
) {

    try {

        if (!contract) {

            alert(
                "Please connect your wallet."
            );

            return;
        }


        const repayment =
            await contract.getRepaymentAmount(
                loanId
            );


        const repaymentETH =
            ethers.formatEther(
                repayment
            );


        const confirmed =
            confirm(
                `Repay Loan #${loanId}\n\n` +
                `Total repayment: ${repaymentETH} ETH`
            );


        if (!confirmed) return;


        const tx =
            await contract.repayLoan(
                loanId,
                {
                    value: repayment
                }
            );


        alert(
            "Repayment transaction submitted."
        );


        console.log(
            "Repayment transaction:",
            tx.hash
        );


        await tx.wait();


        alert(
            "Loan repaid successfully!"
        );


        await loadLoans();

        await loadDashboard();

        await loadMyLoans();


    } catch (error) {

        console.error(
            "Repay loan error:",
            error
        );


        alert(
            getErrorMessage(error)
        );
    }
}


// ==========================================
// CLAIM COLLATERAL
// ==========================================

async function claimCollateral(
    loanId
) {

    try {

        if (!contract) {

            alert(
                "Please connect your wallet."
            );

            return;
        }


        const overdue =
            await contract.isOverdue(
                loanId
            );


        if (!overdue) {

            alert(
                "This loan is not overdue yet."
            );

            return;
        }


        const confirmed =
            confirm(
                `Claim collateral for Loan #${loanId}?`
            );


        if (!confirmed) return;


        const tx =
            await contract.claimCollateral(
                loanId
            );


        alert(
            "Liquidation transaction submitted."
        );


        console.log(
            "Liquidation transaction:",
            tx.hash
        );


        await tx.wait();


        alert(
            "Collateral claimed successfully!"
        );


        await loadLoans();

        await loadDashboard();

        await loadMyLoans();


    } catch (error) {

        console.error(
            "Claim collateral error:",
            error
        );


        alert(
            getErrorMessage(error)
        );
    }
}


// ==========================================
// LOAD ALL LOANS
// ==========================================

async function loadLoans() {

    try {

        if (!contract) return;


        const loans =
            await contract.getAllLoans();


        const loanList =
            document.getElementById(
                "loanList"
            );


        if (!loanList) return;


        loanList.innerHTML = "";


        if (loans.length === 0) {

            loanList.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        ◆
                    </div>

                    <h3>
                        No loan requests yet
                    </h3>

                    <p>
                        New loan requests will appear here.
                    </p>

                </div>

            `;

            return;
        }


        loans.forEach(
            loan => {

                const status =
                    Number(
                        loan.status
                    );


                const amount =
                    ethers.formatEther(
                        loan.loanAmount
                    );


                const collateral =
                    ethers.formatEther(
                        loan.collateralAmount
                    );


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "loan-card";


                let action = "";


                // Requested
                if (status === 0) {

                    if (
                        userAddress &&
                        loan.borrower.toLowerCase() ===
                        userAddress.toLowerCase()
                    ) {

                        action = `

                            <button
                                class="secondary-btn loan-action"
                                disabled
                            >
                                Your Loan
                            </button>

                        `;

                    } else {

                        action = `

                            <button
                                class="primary-btn loan-action"
                                onclick="fundLoan(
                                    ${loan.id},
                                    '${amount}'
                                )"
                            >
                                Fund Loan
                            </button>

                        `;
                    }
                }


                // Funded - Borrower can repay
                if (
                    status === 1 &&
                    userAddress &&
                    loan.borrower.toLowerCase() ===
                    userAddress.toLowerCase()
                ) {

                    action = `

                        <button
                            class="primary-btn loan-action"
                            onclick="repayLoan(
                                ${loan.id}
                            )"
                        >
                            Repay Loan
                        </button>

                    `;
                }


                // Funded - Lender can check default
                if (
                    status === 1 &&
                    userAddress &&
                    loan.lender !==
                    ethers.ZeroAddress &&
                    loan.lender.toLowerCase() ===
                    userAddress.toLowerCase()
                ) {

                    action = `

                        <button
                            class="secondary-btn loan-action"
                            onclick="claimCollateral(
                                ${loan.id}
                            )"
                        >
                            Check Default
                        </button>

                    `;
                }


                card.innerHTML = `

                    <div class="loan-header">

                        <span class="loan-id">
                            Loan #${loan.id}
                        </span>

                        <span class="status ${getStatusClass(status)}">
                            ${STATUS[status]}
                        </span>

                    </div>


                    <div class="loan-amount">
                        ${amount} ETH
                    </div>


                    <div class="loan-details">

                        <div class="loan-detail">

                            <span>
                                Collateral
                            </span>

                            <strong>
                                ${collateral} ETH
                            </strong>

                        </div>


                        <div class="loan-detail">

                            <span>
                                Interest
                            </span>

                            <strong>
                                ${loan.interestRate}%
                            </strong>

                        </div>


                        <div class="loan-detail">

                            <span>
                                Duration
                            </span>

                            <strong>
                                ${formatDuration(
                    Number(
                        loan.duration
                    )
                )}
                            </strong>

                        </div>


                        <div class="loan-detail">

                            <span>
                                Loan ID
                            </span>

                            <strong>
                                #${loan.id}
                            </strong>

                        </div>

                    </div>


                    <div class="loan-address">

                        Borrower:
                        ${shortAddress(
                    loan.borrower
                )}

                    </div>


                    ${action}

                `;


                loanList.appendChild(
                    card
                );
            }
        );


    } catch (error) {

        console.error(
            "Loading loans failed:",
            error
        );
    }
}


// ==========================================
// LOAD DASHBOARD
// ==========================================

async function loadDashboard() {

    try {

        if (!contract) return;


        const loans =
            await contract.getAllLoans();


        let active = 0;

        let completed = 0;

        let totalVolume = 0;


        loans.forEach(
            loan => {

                const status =
                    Number(
                        loan.status
                    );


                if (status === 1) {
                    active++;
                }


                if (status === 2) {
                    completed++;
                }


                totalVolume +=
                    Number(
                        ethers.formatEther(
                            loan.loanAmount
                        )
                    );
            }
        );


        const totalLoans =
            document.getElementById(
                "totalLoans"
            );

        if (totalLoans) {

            totalLoans.textContent =
                loans.length;
        }


        const activeLoans =
            document.getElementById(
                "activeLoans"
            );

        if (activeLoans) {

            activeLoans.textContent =
                active;
        }


        const completedLoans =
            document.getElementById(
                "completedLoans"
            );

        if (completedLoans) {

            completedLoans.textContent =
                completed;
        }


        const totalVolumeElement =
            document.getElementById(
                "totalVolume"
            );

        if (totalVolumeElement) {

            totalVolumeElement.textContent =
                totalVolume.toFixed(4) +
                " ETH";
        }


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );
    }
}


// ==========================================
// LOAD MY LOANS
// ==========================================

async function loadMyLoans() {

    try {

        if (
            !contract ||
            !userAddress
        ) {
            return;
        }


        const loans =
            await contract.getAllLoans();


        const table =
            document.getElementById(
                "myLoansTable"
            );


        if (!table) return;


        table.innerHTML = "";


        const myLoans =
            loans.filter(
                loan => {

                    const isBorrower =
                        loan.borrower.toLowerCase() ===
                        userAddress.toLowerCase();


                    const isLender =
                        loan.lender !==
                        ethers.ZeroAddress &&
                        loan.lender.toLowerCase() ===
                        userAddress.toLowerCase();


                    return (
                        isBorrower ||
                        isLender
                    );
                }
            );


        if (
            myLoans.length === 0
        ) {

            table.innerHTML = `

                <tr>

                    <td
                        colspan="7"
                        class="table-empty"
                    >
                        You have no loans yet.
                    </td>

                </tr>

            `;

            return;
        }


        myLoans.forEach(
            loan => {

                const status =
                    Number(
                        loan.status
                    );


                const isBorrower =
                    loan.borrower.toLowerCase() ===
                    userAddress.toLowerCase();


                const role =
                    isBorrower
                        ? "Borrower"
                        : "Lender";


                const amount =
                    ethers.formatEther(
                        loan.loanAmount
                    );


                const collateral =
                    ethers.formatEther(
                        loan.collateralAmount
                    );


                let action = "-";


                // Borrower repay
                if (
                    isBorrower &&
                    status === 1
                ) {

                    action = `

                        <button
                            class="primary-btn"
                            onclick="repayLoan(
                                ${loan.id}
                            )"
                        >
                            Repay
                        </button>

                    `;
                }


                // Lender default
                if (
                    !isBorrower &&
                    status === 1
                ) {

                    action = `

                        <button
                            class="secondary-btn"
                            onclick="claimCollateral(
                                ${loan.id}
                            )"
                        >
                            Default
                        </button>

                    `;
                }


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        #${loan.id}
                    </td>

                    <td>
                        ${role}
                    </td>

                    <td>
                        ${amount} ETH
                    </td>

                    <td>
                        ${collateral} ETH
                    </td>

                    <td>
                        ${loan.interestRate}%
                    </td>

                    <td>

                        <span class="status
                            ${getStatusClass(status)}">

                            ${STATUS[status]}

                        </span>

                    </td>

                    <td>
                        ${action}
                    </td>

                `;


                table.appendChild(
                    row
                );
            }
        );


    } catch (error) {

        console.error(
            "My loans error:",
            error
        );
    }
}


// ==========================================
// STATUS CSS CLASS
// ==========================================

function getStatusClass(
    status
) {

    switch (status) {

        case 0:
            return "requested";

        case 1:
            return "funded";

        case 2:
            return "repaid";

        case 3:
            return "defaulted";

        default:
            return "";
    }
}


// ==========================================
// SHORT ADDRESS
// ==========================================

function shortAddress(
    address
) {

    if (!address) {

        return "N/A";
    }


    return (
        address.substring(0, 6) +
        "..." +
        address.substring(
            address.length - 4
        )
    );
}


// ==========================================
// FORMAT DURATION
// ==========================================

function formatDuration(
    seconds
) {

    const days =
        Math.floor(
            seconds / 86400
        );


    if (days >= 1) {

        return (
            days +
            " Day" +
            (days > 1 ? "s" : "")
        );
    }


    const hours =
        Math.floor(
            seconds / 3600
        );


    return (
        hours +
        " Hours"
    );
}


// ==========================================
// ERROR HANDLER
// ==========================================

function getErrorMessage(
    error
) {

    console.error(
        "Full error:",
        error
    );


    if (
        error.code ===
        4001
    ) {

        return "Transaction rejected by user.";
    }


    if (
        error.code ===
        "ACTION_REJECTED"
    ) {

        return "Transaction rejected by user.";
    }


    if (
        error.reason
    ) {

        return error.reason;
    }


    if (
        error.shortMessage
    ) {

        return error.shortMessage;
    }


    if (
        error.info &&
        error.info.error &&
        error.info.error.message
    ) {

        return error.info.error.message;
    }


    if (
        error.message
    ) {

        return error.message;
    }


    return "Transaction failed.";
}


// ==========================================
// LIVE LOAN PREVIEW
// ==========================================

function updateLoanPreview() {

    const loanElement =
        document.getElementById(
            "loanAmount"
        );


    const interestElement =
        document.getElementById(
            "interestRate"
        );


    const collateralElement =
        document.getElementById(
            "collateral"
        );


    if (
        !loanElement ||
        !interestElement ||
        !collateralElement
    ) {

        return;
    }


    const loanAmount =
        Number(
            loanElement.value
        ) || 0;


    const interestRate =
        Number(
            interestElement.value
        ) || 0;


    const collateral =
        Number(
            collateralElement.value
        ) || 0;


    const interest =
        loanAmount *
        interestRate /
        100;


    const previewLoan =
        document.getElementById(
            "previewLoan"
        );


    if (previewLoan) {

        previewLoan.textContent =
            loanAmount.toFixed(4) +
            " ETH";
    }


    const previewCollateral =
        document.getElementById(
            "previewCollateral"
        );


    if (previewCollateral) {

        previewCollateral.textContent =
            collateral.toFixed(4) +
            " ETH";
    }


    const previewInterest =
        document.getElementById(
            "previewInterest"
        );


    if (previewInterest) {

        previewInterest.textContent =
            interest.toFixed(4) +
            " ETH";
    }
}


// ==========================================
// METAMASK ACCOUNT CHANGE
// ==========================================

if (window.ethereum) {

    window.ethereum.on(
        "accountsChanged",
        async function (accounts) {

            console.log(
                "Accounts changed:",
                accounts
            );


            if (
                accounts.length === 0
            ) {

                userAddress = null;

                provider = null;

                signer = null;

                contract = null;

                updateWalletButton();

            } else {

                await connectWallet();
            }
        }
    );


    window.ethereum.on(
        "chainChanged",
        function (chainId) {

            console.log(
                "Chain changed:",
                chainId
            );

            // Reload so the correct provider
            // and contract are created again
            location.reload();
        }
    );
}


// ==========================================
// PAGE EVENT LISTENERS
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "P2P Lending DApp loaded."
        );


        // --------------------------------------
        // CONNECT WALLET BUTTON
        // --------------------------------------

        const connectButton =
            document.getElementById(
                "connectWallet"
            );


        if (connectButton) {

            console.log(
                "Connect Wallet button found."
            );


            connectButton.addEventListener(
                "click",
                connectWallet
            );

        } else {

            console.error(
                "ERROR: #connectWallet button not found."
            );
        }


        // --------------------------------------
        // LOAN FORM
        // --------------------------------------

        const loanForm =
            document.getElementById(
                "loanForm"
            );


        if (loanForm) {

            loanForm.addEventListener(
                "submit",
                requestLoan
            );
        }


        // --------------------------------------
        // PREVIEW INPUTS
        // --------------------------------------

        const inputs = [

            "loanAmount",

            "interestRate",

            "collateral"

        ];


        inputs.forEach(
            id => {

                const element =
                    document.getElementById(
                        id
                    );


                if (element) {

                    element.addEventListener(
                        "input",
                        updateLoanPreview
                    );
                }
            }
        );


        // --------------------------------------
        // REFRESH LOANS
        // --------------------------------------

        const refresh =
            document.getElementById(
                "refreshLoans"
            );


        if (refresh) {

            refresh.addEventListener(
                "click",
                async function () {

                    if (!contract) {

                        alert(
                            "Please connect your wallet first."
                        );

                        return;
                    }


                    await loadLoans();

                    await loadDashboard();

                    await loadMyLoans();

                }
            );
        }

    }
);