// ==========================================
// P2P LENDING DAPP - APP.JS
// ==========================================

let provider;
let signer;
let contract;
let userAddress;


// ==========================================
// CONTRACT CONFIGURATION
// ==========================================

const CONTRACT_ADDRESS = "0xad47ce33CE62AB6f373b4309F65F4247ef80f302";

const CONTRACT_ABI = [
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
    {
        "inputs": [],
        "name": "ReentrancyGuardReentrantCall",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "loanId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "lender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "collateralAmount",
                "type": "uint256"
            }
        ],
        "name": "LoanDefaulted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "loanId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "lender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "LoanFunded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "loanId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "borrower",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "totalAmount",
                "type": "uint256"
            }
        ],
        "name": "LoanRepaid",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "loanId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "borrower",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "loanAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "collateralAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "interestRate",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "duration",
                "type": "uint256"
            }
        ],
        "name": "LoanRequested",
        "type": "event"
    },
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
    {
        "stateMutability": "payable",
        "type": "receive"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_loanId",
                "type": "uint256"
            }
        ],
        "name": "calculateInterest",
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
                        "internalType": "enum P2PLending.Status",
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
                        "internalType": "enum P2PLending.Status",
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
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_loanId",
                "type": "uint256"
            }
        ],
        "name": "getLoanStatus",
        "outputs": [
            {
                "internalType": "enum P2PLending.Status",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
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
    },
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
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "loans",
        "outputs": [
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
                "internalType": "enum P2PLending.Status",
                "name": "status",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]


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

        button.disabled = true;

        button.textContent =
            "Creating Loan...";


        const tx =
            await contract.requestLoan(
                loanAmountWei,
                interestRate,
                duration,
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

        console.error(error);

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


        await tx.wait();


        alert(
            "Loan funded successfully!"
        );


        await loadLoans();

        await loadDashboard();

        await loadMyLoans();


    } catch (error) {

        console.error(error);

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


        await tx.wait();


        alert(
            "Loan repaid successfully!"
        );


        await loadLoans();

        await loadDashboard();

        await loadMyLoans();


    } catch (error) {

        console.error(error);

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


        await tx.wait();


        alert(
            "Collateral claimed successfully!"
        );


        await loadLoans();

        await loadDashboard();

        await loadMyLoans();


    } catch (error) {

        console.error(error);

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
                    Number(loan.status);


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
                    Number(loan.status);


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


        document.getElementById(
            "totalLoans"
        ).textContent =
            loans.length;


        document.getElementById(
            "activeLoans"
        ).textContent =
            active;


        document.getElementById(
            "completedLoans"
        ).textContent =
            completed;


        document.getElementById(
            "totalVolume"
        ).textContent =
            totalVolume.toFixed(4) +
            " ETH";


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
        ) return;


        const loans =
            await contract.getAllLoans();


        const table =
            document.getElementById(
                "myLoansTable"
            );


        table.innerHTML = "";


        const myLoans =
            loans.filter(
                loan =>
                    loan.borrower.toLowerCase() ===
                    userAddress.toLowerCase()
                    ||
                    (
                        loan.lender !==
                        ethers.ZeroAddress &&
                        loan.lender.toLowerCase() ===
                        userAddress.toLowerCase()
                    )
            );


        if (myLoans.length === 0) {

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
                    Number(loan.status);


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


                let action =
                    "-";


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

        return days + " Day" +
            (days > 1 ? "s" : "");
    }


    const hours =
        Math.floor(
            seconds / 3600
        );


    return hours + " Hours";
}


// ==========================================
// ERROR HANDLER
// ==========================================

function getErrorMessage(
    error
) {

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

    const loanAmount =
        Number(
            document.getElementById(
                "loanAmount"
            ).value
        ) || 0;


    const interestRate =
        Number(
            document.getElementById(
                "interestRate"
            ).value
        ) || 0;


    const collateral =
        Number(
            document.getElementById(
                "collateral"
            ).value
        ) || 0;


    const interest =
        loanAmount *
        interestRate /
        100;


    document.getElementById(
        "previewLoan"
    ).textContent =
        loanAmount.toFixed(4) +
        " ETH";


    document.getElementById(
        "previewCollateral"
    ).textContent =
        collateral.toFixed(4) +
        " ETH";


    document.getElementById(
        "previewInterest"
    ).textContent =
        interest.toFixed(4) +
        " ETH";
}


// ==========================================
// WALLET ACCOUNT CHANGE
// ==========================================

if (window.ethereum) {

    window.ethereum.on(
        "accountsChanged",
        async function (accounts) {

            if (
                accounts.length === 0
            ) {

                userAddress = null;

                location.reload();

            } else {

                await connectWallet();
            }
        }
    );


    window.ethereum.on(
        "chainChanged",
        function () {

            location.reload();

        }
    );
}


// ==========================================
// EVENT LISTENERS
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // Connect wallet

        const connectButton =
            document.getElementById(
                "connectWallet"
            );


        if (connectButton) {

            connectButton.addEventListener(
                "click",
                connectWallet
            );
        }


        // Loan form

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


        // Preview inputs

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


        // Refresh

        const refresh =
            document.getElementById(
                "refreshLoans"
            );


        if (refresh) {

            refresh.addEventListener(
                "click",
                async function () {

                    await loadLoans();

                    await loadDashboard();

                    await loadMyLoans();

                }
            );
        }

    }
);