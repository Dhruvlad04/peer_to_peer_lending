// ============================================================
// P2P LENDING DAPP - APP.JS
// Ethers.js v6
// ============================================================

// ============================================================
// GLOBAL VARIABLES
// ============================================================

let provider = null;
let signer = null;
let contract = null;
let userAddress = null;
let currentChainId = null;


// ============================================================
// CONTRACT CONFIGURATION
// ============================================================

// IMPORTANT:
// This address MUST be the address of the contract deployed
// on the SAME network currently selected in MetaMask.

const CONTRACT_ADDRESS =
    "0x00822919dff2AeD42fa81cc76218ea2caa8dCCb1";


// ============================================================
// CONTRACT ABI
// ============================================================

const CONTRACT_ABI = [

    // --------------------------------------------------------
    // requestLoan
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // fundLoan
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // repayLoan
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // claimCollateral
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // getLoan
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // loanCounter
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // getAllLoans
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // getRepaymentAmount
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // isOverdue
    // --------------------------------------------------------

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


// ============================================================
// STATUS
// ============================================================

const STATUS = {
    0: "Requested",
    1: "Funded",
    2: "Repaid",
    3: "Defaulted"
};


// ============================================================
// CONNECT WALLET
// ============================================================

async function connectWallet() {

    try {

        if (!window.ethereum) {

            alert(
                "MetaMask is not installed.\n\n" +
                "Please install MetaMask and refresh the page."
            );

            return;
        }


        // Create ethers provider
        provider =
            new ethers.BrowserProvider(
                window.ethereum
            );


        // Request wallet connection
        await provider.send(
            "eth_requestAccounts",
            []
        );


        // Get signer
        signer =
            await provider.getSigner();


        // Get wallet address
        userAddress =
            await signer.getAddress();


        // Get network
        const network =
            await provider.getNetwork();


        currentChainId =
            network.chainId;


        console.log(
            "===================================="
        );

        console.log(
            "Wallet connected:",
            userAddress
        );

        console.log(
            "Network:",
            network.name
        );

        console.log(
            "Chain ID:",
            currentChainId.toString()
        );

        console.log(
            "Contract:",
            CONTRACT_ADDRESS
        );


        // ====================================================
        // CHECK CONTRACT CODE
        // ====================================================

        const code =
            await provider.getCode(
                CONTRACT_ADDRESS
            );


        console.log(
            "Contract bytecode:",
            code
        );


        if (!code || code === "0x") {

            contract = null;

            alert(
                "SMART CONTRACT NOT FOUND\n\n" +

                "No contract exists at:\n" +
                CONTRACT_ADDRESS +

                "\n\nCurrent MetaMask network:\n" +
                network.name +

                "\n\nChain ID:\n" +
                currentChainId.toString() +

                "\n\nPlease switch MetaMask to the network " +
                "where you deployed P2PLending."
            );

            return;
        }


        // ====================================================
        // CREATE CONTRACT
        // ====================================================

        contract =
            new ethers.Contract(
                CONTRACT_ADDRESS,
                CONTRACT_ABI,
                signer
            );


        // ====================================================
        // TEST CONTRACT
        // ====================================================

        const counter =
            await contract.loanCounter();


        console.log(
            "Contract connected successfully."
        );

        console.log(
            "Loan counter:",
            counter.toString()
        );


        console.log(
            "===================================="
        );


        // Update wallet button
        updateWalletButton();


        // Load application data
        await loadLoans();

        await loadDashboard();

        await loadMyLoans();


    } catch (error) {

        console.error(
            "Wallet connection error:",
            error
        );


        alert(
            "Wallet connection failed.\n\n" +
            getErrorMessage(error)
        );
    }
}


// ============================================================
// UPDATE WALLET BUTTON
// ============================================================

function updateWalletButton() {

    const button =
        document.getElementById(
            "connectWallet"
        );


    if (!button || !userAddress) {
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


// ============================================================
// REQUEST LOAN
// ============================================================

async function requestLoan(event) {

    event.preventDefault();


    try {

        if (!contract) {

            alert(
                "Please connect MetaMask first."
            );

            return;
        }


        // ====================================================
        // GET FORM VALUES
        // ====================================================

        const loanAmountInput =
            document.getElementById(
                "loanAmount"
            );


        const interestRateInput =
            document.getElementById(
                "interestRate"
            );


        const durationInput =
            document.getElementById(
                "duration"
            );


        const collateralInput =
            document.getElementById(
                "collateral"
            );


        if (
            !loanAmountInput ||
            !interestRateInput ||
            !durationInput ||
            !collateralInput
        ) {

            alert(
                "Form fields are missing.\n\n" +
                "Check your HTML IDs:\n" +
                "loanAmount\n" +
                "interestRate\n" +
                "duration\n" +
                "collateral"
            );

            return;
        }


        const loanAmount =
            loanAmountInput.value.trim();


        const interestRate =
            interestRateInput.value.trim();


        const durationRaw =
            durationInput.value.trim();


        const collateral =
            collateralInput.value.trim();


        // ====================================================
        // VALIDATION
        // ====================================================

        if (
            !loanAmount ||
            !interestRate ||
            !durationRaw ||
            !collateral
        ) {

            alert(
                "Please fill all fields."
            );

            return;
        }


        if (
            !Number.isFinite(
                Number(loanAmount)
            ) ||
            Number(loanAmount) <= 0
        ) {

            alert(
                "Loan amount must be greater than zero."
            );

            return;
        }


        if (
            !Number.isFinite(
                Number(interestRate)
            ) ||
            Number(interestRate) <= 0
        ) {

            alert(
                "Interest rate must be greater than zero."
            );

            return;
        }


        if (
            !Number.isFinite(
                Number(collateral)
            ) ||
            Number(collateral) <= 0
        ) {

            alert(
                "Collateral must be greater than zero."
            );

            return;
        }


        // ====================================================
        // DURATION
        // ====================================================

        const duration =
            normalizeDuration(
                durationRaw
            );


        if (duration <= 0) {

            alert(
                "Invalid loan duration."
            );

            return;
        }


        console.log(
            "Loan amount:",
            loanAmount,
            "ETH"
        );

        console.log(
            "Interest:",
            interestRate,
            "%"
        );

        console.log(
            "Duration:",
            duration,
            "seconds"
        );

        console.log(
            "Collateral:",
            collateral,
            "ETH"
        );


        // ====================================================
        // CONVERT ETH TO WEI
        // ====================================================

        const loanAmountWei =
            ethers.parseEther(
                loanAmount
            );


        const collateralWei =
            ethers.parseEther(
                collateral
            );


        // ====================================================
        // CHECK WALLET BALANCE
        // ====================================================

        const balance =
            await provider.getBalance(
                userAddress
            );


        const gasBuffer =
            ethers.parseEther(
                "0.001"
            );


        if (
            balance <
            collateralWei + gasBuffer
        ) {

            alert(
                "Insufficient ETH balance.\n\n" +

                "Required collateral:\n" +
                collateral +
                " ETH\n\n" +

                "You also need ETH for gas."
            );

            return;
        }


        // ====================================================
        // BUTTON
        // ====================================================

        const button =
            event.target.querySelector(
                "button[type='submit']"
            );


        if (button) {

            button.disabled = true;

            button.textContent =
                "Checking transaction...";
        }


        // ====================================================
        // ESTIMATE GAS
        // ====================================================

        let gasLimit;


        try {

            gasLimit =
                await contract.requestLoan.estimateGas(
                    loanAmountWei,
                    interestRate,
                    duration,
                    {
                        value: collateralWei
                    }
                );


            console.log(
                "Estimated gas:",
                gasLimit.toString()
            );


        } catch (estimateError) {

            console.error(
                "Gas estimation failed:",
                estimateError
            );


            throw estimateError;
        }


        // ====================================================
        // SEND TRANSACTION
        // ====================================================

        if (button) {

            button.textContent =
                "Waiting for MetaMask...";
        }


        const tx =
            await contract.requestLoan(
                loanAmountWei,
                interestRate,
                duration,
                {
                    value: collateralWei,
                    gasLimit:
                        gasLimit +
                        (gasLimit / 5n)
                }
            );


        console.log(
            "Transaction hash:",
            tx.hash
        );


        if (button) {

            button.textContent =
                "Transaction pending...";
        }


        // Wait for blockchain confirmation
        const receipt =
            await tx.wait();


        console.log(
            "Transaction confirmed:",
            receipt
        );


        alert(
            "Loan request created successfully!\n\n" +
            "Transaction:\n" +
            tx.hash
        );


        // Reset form
        event.target.reset();


        // Update preview
        updateLoanPreview();


        // Refresh data
        await loadLoans();

        await loadDashboard();

        await loadMyLoans();


    } catch (error) {

        console.error(
            "REQUEST LOAN ERROR:",
            error
        );


        alert(
            "Loan request failed.\n\n" +
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


// ============================================================
// FUND LOAN
// ============================================================

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


        loanId =
            normalizeLoanId(
                loanId
            );


        const loan =
            await contract.getLoan(
                loanId
            );


        if (
            Number(loan.status) !== 0
        ) {

            alert(
                "This loan is no longer available for funding."
            );

            return;
        }


        if (
            loan.borrower.toLowerCase() ===
            userAddress.toLowerCase()
        ) {

            alert(
                "You cannot fund your own loan."
            );

            return;
        }


        const actualAmount =
            ethers.formatEther(
                loan.loanAmount
            );


        const confirmed =
            confirm(
                `Fund Loan #${loanId} with ${actualAmount} ETH?`
            );


        if (!confirmed) {
            return;
        }


        const amountWei =
            ethers.parseEther(
                actualAmount
            );


        // Check balance
        const balance =
            await provider.getBalance(
                userAddress
            );


        if (
            balance < amountWei
        ) {

            alert(
                "Insufficient ETH balance to fund this loan."
            );

            return;
        }


        // Estimate gas
        const gasLimit =
            await contract.fundLoan.estimateGas(
                loanId,
                {
                    value: amountWei
                }
            );


        const tx =
            await contract.fundLoan(
                loanId,
                {
                    value: amountWei,
                    gasLimit:
                        gasLimit +
                        (gasLimit / 5n)
                }
            );


        alert(
            "Funding transaction submitted.\n\n" +
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
            "FUND LOAN ERROR:",
            error
        );


        alert(
            "Funding failed.\n\n" +
            getErrorMessage(error)
        );
    }
}


// ============================================================
// REPAY LOAN
// ============================================================

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


        loanId =
            normalizeLoanId(
                loanId
            );


        // Get loan
        const loan =
            await contract.getLoan(
                loanId
            );


        // Check borrower
        if (
            loan.borrower.toLowerCase() !==
            userAddress.toLowerCase()
        ) {

            alert(
                "Only the borrower can repay this loan."
            );

            return;
        }


        // Check status
        if (
            Number(loan.status) !== 1
        ) {

            alert(
                "This loan is not currently active."
            );

            return;
        }


        // Get repayment
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


        if (!confirmed) {
            return;
        }


        // Check balance
        const balance =
            await provider.getBalance(
                userAddress
            );


        if (
            balance < repayment
        ) {

            alert(
                "Insufficient ETH balance for repayment and gas."
            );

            return;
        }


        // Estimate gas
        const gasLimit =
            await contract.repayLoan.estimateGas(
                loanId,
                {
                    value: repayment
                }
            );


        const tx =
            await contract.repayLoan(
                loanId,
                {
                    value: repayment,
                    gasLimit:
                        gasLimit +
                        (gasLimit / 5n)
                }
            );


        alert(
            "Repayment transaction submitted.\n\n" +
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
            "REPAY LOAN ERROR:",
            error
        );


        alert(
            "Repayment failed.\n\n" +
            getErrorMessage(error)
        );
    }
}


// ============================================================
// CLAIM COLLATERAL
// ============================================================

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


        loanId =
            normalizeLoanId(
                loanId
            );


        const loan =
            await contract.getLoan(
                loanId
            );


        if (
            Number(loan.status) !== 1
        ) {

            alert(
                "This loan is not active."
            );

            return;
        }


        if (
            loan.lender.toLowerCase() !==
            userAddress.toLowerCase()
        ) {

            alert(
                "Only the lender can claim the collateral."
            );

            return;
        }


        // Check overdue
        const overdue =
            await contract.isOverdue(
                loanId
            );


        if (!overdue) {

            const fundedAt =
                Number(
                    loan.fundedAt
                );


            const duration =
                Number(
                    loan.duration
                );


            const deadline =
                fundedAt +
                duration;


            const deadlineDate =
                new Date(
                    deadline * 1000
                );


            alert(
                "This loan is not overdue yet.\n\n" +
                "Loan deadline:\n" +
                deadlineDate.toLocaleString()
            );

            return;
        }


        const collateral =
            ethers.formatEther(
                loan.collateralAmount
            );


        const confirmed =
            confirm(
                `Loan #${loanId} is overdue.\n\n` +
                `Claim ${collateral} ETH collateral?`
            );


        if (!confirmed) {
            return;
        }


        // Estimate gas
        const gasLimit =
            await contract.claimCollateral.estimateGas(
                loanId
            );


        const tx =
            await contract.claimCollateral(
                loanId,
                {
                    gasLimit:
                        gasLimit +
                        (gasLimit / 5n)
                }
            );


        alert(
            "Liquidation transaction submitted.\n\n" +
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
            "CLAIM COLLATERAL ERROR:",
            error
        );


        alert(
            "Collateral claim failed.\n\n" +
            getErrorMessage(error)
        );
    }
}


// ============================================================
// LOAD ALL LOANS
// ============================================================

async function loadLoans() {

    try {

        if (!contract) {
            return;
        }


        const loans =
            await contract.getAllLoans();


        const loanList =
            document.getElementById(
                "loanList"
            );


        if (!loanList) {
            return;
        }


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


                const loanId =
                    loan.id.toString();


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "loan-card";


                let action = "";


                // ====================================================
                // REQUESTED
                // ====================================================

                if (
                    status === 0
                ) {

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
                                    '${loanId}',
                                    '${amount}'
                                )"
                            >
                                Fund Loan
                            </button>

                        `;
                    }
                }


                // ====================================================
                // FUNDED - BORROWER
                // ====================================================

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
                                '${loanId}'
                            )"
                        >
                            Repay Loan
                        </button>

                    `;
                }


                // ====================================================
                // FUNDED - LENDER
                // ====================================================

                if (
                    status === 1 &&
                    userAddress &&
                    loan.lender.toLowerCase() ===
                    userAddress.toLowerCase()
                ) {

                    action = `

                        <button
                            class="secondary-btn loan-action"
                            onclick="claimCollateral(
                                '${loanId}'
                            )"
                        >
                            Check Default
                        </button>

                    `;
                }


                // ====================================================
                // CARD HTML
                // ====================================================

                card.innerHTML = `

                    <div class="loan-header">

                        <span class="loan-id">
                            Loan #${loanId}
                        </span>

                        <span class="status ${getStatusClass(status)}">
                            ${STATUS[status] || "Unknown"}
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
                                ${loan.interestRate.toString()}%
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
                                #${loanId}
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


        const loanList =
            document.getElementById(
                "loanList"
            );


        if (loanList) {

            loanList.innerHTML = `

                <div class="empty-state">

                    <h3>
                        Unable to load loans
                    </h3>

                    <p>
                        Check MetaMask network and contract address.
                    </p>

                </div>

            `;
        }
    }
}


// ============================================================
// LOAD DASHBOARD
// ============================================================

async function loadDashboard() {

    try {

        if (!contract) {
            return;
        }


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


                if (
                    status === 1
                ) {

                    active++;
                }


                if (
                    status === 2
                ) {

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


        const totalLoansElement =
            document.getElementById(
                "totalLoans"
            );


        const activeLoansElement =
            document.getElementById(
                "activeLoans"
            );


        const completedLoansElement =
            document.getElementById(
                "completedLoans"
            );


        const totalVolumeElement =
            document.getElementById(
                "totalVolume"
            );


        if (totalLoansElement) {

            totalLoansElement.textContent =
                loans.length;
        }


        if (activeLoansElement) {

            activeLoansElement.textContent =
                active;
        }


        if (completedLoansElement) {

            completedLoansElement.textContent =
                completed;
        }


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


// ============================================================
// LOAD MY LOANS
// ============================================================

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


        if (!table) {
            return;
        }


        table.innerHTML = "";


        const myLoans =
            loans.filter(
                loan => {

                    const isBorrower =
                        loan.borrower &&
                        loan.borrower.toLowerCase() ===
                        userAddress.toLowerCase();


                    const isLender =
                        loan.lender &&
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


                const loanId =
                    loan.id.toString();


                let action =
                    "-";


                // Borrower repay
                if (
                    isBorrower &&
                    status === 1
                ) {

                    action = `

                        <button
                            class="primary-btn"
                            onclick="repayLoan(
                                '${loanId}'
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
                                '${loanId}'
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
                        #${loanId}
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
                        ${loan.interestRate.toString()}%
                    </td>

                    <td>

                        <span class="status
                            ${getStatusClass(status)}">

                            ${STATUS[status] || "Unknown"}

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


// ============================================================
// NORMALIZE LOAN ID
// ============================================================

function normalizeLoanId(
    loanId
) {

    const id =
        Number(
            loanId
        );


    if (
        !Number.isInteger(id) ||
        id <= 0
    ) {

        throw new Error(
            "Invalid loan ID."
        );
    }


    return id;
}


// ============================================================
// NORMALIZE DURATION
// ============================================================
//
// Solidity expects duration in SECONDS.
//
// If your HTML uses:
// value="604800"
// this function keeps it as seconds.
//
// If your HTML uses:
// value="7"
// for "7 Days",
// this function converts it to:
// 7 * 86400 = 604800 seconds.
//

function normalizeDuration(
    value
) {

    const number =
        Number(
            value
        );


    if (
        !Number.isFinite(number) ||
        number <= 0
    ) {

        return 0;
    }


    // If duration is small, assume the HTML
    // is providing DAYS.
    //
    // Example:
    // 7  -> 604800 seconds
    // 14 -> 1209600 seconds
    // 30 -> 2592000 seconds

    if (
        number <= 365
    ) {

        return Math.floor(
            number * 86400
        );
    }


    // Otherwise assume it is already seconds.

    return Math.floor(
        number
    );
}


// ============================================================
// STATUS CSS CLASS
// ============================================================

function getStatusClass(
    status
) {

    switch (
        Number(status)
    ) {

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


// ============================================================
// SHORT ADDRESS
// ============================================================

function shortAddress(
    address
) {

    if (!address) {

        return "N/A";
    }


    return (
        address.substring(
            0,
            6
        ) +
        "..." +
        address.substring(
            address.length - 4
        )
    );
}


// ============================================================
// FORMAT DURATION
// ============================================================

function formatDuration(
    seconds
) {

    seconds =
        Number(
            seconds
        );


    if (
        !Number.isFinite(seconds) ||
        seconds <= 0
    ) {

        return "N/A";
    }


    const days =
        Math.floor(
            seconds / 86400
        );


    if (
        days >= 1
    ) {

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


    if (
        hours >= 1
    ) {

        return (
            hours +
            " Hour" +
            (hours > 1 ? "s" : "")
        );
    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    if (
        minutes >= 1
    ) {

        return (
            minutes +
            " Minute" +
            (minutes > 1 ? "s" : "")
        );
    }


    return (
        seconds +
        " Seconds"
    );
}


// ============================================================
// ERROR HANDLER
// ============================================================

function getErrorMessage(
    error
) {

    console.error(
        "FULL BLOCKCHAIN ERROR:",
        error
    );


    // User rejected MetaMask
    if (
        error?.code ===
        "ACTION_REJECTED"
    ) {

        return (
            "Transaction rejected by user."
        );
    }


    if (
        error?.code ===
        4001
    ) {

        return (
            "Transaction rejected by user."
        );
    }


    // Solidity revert reason
    if (
        error?.reason
    ) {

        return (
            "Smart contract rejected the transaction:\n" +
            error.reason
        );
    }


    // Ethers short message
    if (
        error?.shortMessage
    ) {

        return (
            error.shortMessage
        );
    }


    // Nested provider error
    if (
        error?.info?.error?.message
    ) {

        return (
            error.info.error.message
        );
    }


    // Nested revert data
    if (
        error?.data?.message
    ) {

        return (
            error.data.message
        );
    }


    if (
        error?.error?.message
    ) {

        return (
            error.error.message
        );
    }


    // Common "missing revert data" case
    if (
        error?.message?.includes(
            "missing revert data"
        )
    ) {

        return (
            "The blockchain node returned no revert reason.\n\n" +

            "Most common causes:\n" +
            "1. Wrong MetaMask network\n" +
            "2. Wrong contract address\n" +
            "3. ABI does not match deployed contract\n" +
            "4. Contract call is reverting\n\n" +

            "Open F12 → Console and check:\n" +
            "Contract bytecode\n" +
            "Chain ID\n" +
            "Contract address"
        );
    }


    if (
        error?.message
    ) {

        return (
            error.message
        );
    }


    return (
        "Transaction failed.\n\n" +
        "Check MetaMask network, contract address, " +
        "wallet balance and contract ABI."
    );
}


// ============================================================
// LIVE LOAN PREVIEW
// ============================================================

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


    const previewCollateral =
        document.getElementById(
            "previewCollateral"
        );


    const previewInterest =
        document.getElementById(
            "previewInterest"
        );


    if (previewLoan) {

        previewLoan.textContent =
            loanAmount.toFixed(4) +
            " ETH";
    }


    if (previewCollateral) {

        previewCollateral.textContent =
            collateral.toFixed(4) +
            " ETH";
    }


    if (previewInterest) {

        previewInterest.textContent =
            interest.toFixed(4) +
            " ETH";
    }
}


// ============================================================
// WALLET ACCOUNT CHANGE
// ============================================================

if (
    window.ethereum
) {

    window.ethereum.on(
        "accountsChanged",
        async function(accounts) {

            console.log(
                "Accounts changed:",
                accounts
            );


            if (
                accounts.length === 0
            ) {

                userAddress =
                    null;

                signer =
                    null;

                contract =
                    null;

                location.reload();

            } else {

                await connectWallet();
            }
        }
    );


    window.ethereum.on(
        "chainChanged",
        function(chainId) {

            console.log(
                "Network changed:",
                chainId
            );


            // Reload so the contract is recreated
            // on the new network.

            location.reload();
        }
    );
}


// ============================================================
// EVENT LISTENERS
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {


        // ====================================================
        // CONNECT WALLET
        // ====================================================

        const connectButton =
            document.getElementById(
                "connectWallet"
            );


        if (
            connectButton
        ) {

            connectButton.addEventListener(
                "click",
                connectWallet
            );
        }


        // ====================================================
        // LOAN FORM
        // ====================================================

        const loanForm =
            document.getElementById(
                "loanForm"
            );


        if (
            loanForm
        ) {

            loanForm.addEventListener(
                "submit",
                requestLoan
            );
        }


        // ====================================================
        // PREVIEW INPUTS
        // ====================================================

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


                if (
                    element
                ) {

                    element.addEventListener(
                        "input",
                        updateLoanPreview
                    );
                }
            }
        );


        // ====================================================
        // INITIAL PREVIEW
        // ====================================================

        updateLoanPreview();


        // ====================================================
        // REFRESH
        // ====================================================

        const refresh =
            document.getElementById(
                "refreshLoans"
            );


        if (
            refresh
        ) {

            refresh.addEventListener(
                "click",
                async function() {

                    if (!contract) {

                        alert(
                            "Please connect MetaMask first."
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