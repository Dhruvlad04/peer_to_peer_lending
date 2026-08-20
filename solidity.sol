// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract P2PLending is ReentrancyGuard {

    enum Status {
        Requested,
        Funded,
        Repaid,
        Defaulted
    }

    struct Loan {
        uint256 id;
        address payable borrower;
        address payable lender;

        uint256 loanAmount;
        uint256 collateralAmount;

        uint256 interestRate; // Percentage, e.g. 10 = 10%
        uint256 duration;    // Seconds
        uint256 fundedAt;

        Status status;
    }

    uint256 public loanCounter;

    mapping(uint256 => Loan) public loans;

    event LoanRequested(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 loanAmount,
        uint256 collateralAmount,
        uint256 interestRate,
        uint256 duration
    );

    event LoanFunded(
        uint256 indexed loanId,
        address indexed lender,
        uint256 amount
    );

    event LoanRepaid(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 totalAmount
    );

    event LoanDefaulted(
        uint256 indexed loanId,
        address indexed lender,
        uint256 collateralAmount
    );

    // =========================================================
    // 1. REQUEST LOAN
    // =========================================================

    function requestLoan(
        uint256 _loanAmount,
        uint256 _interestRate,
        uint256 _duration
    ) external payable returns (uint256) {

        require(_loanAmount > 0, "Loan amount must be greater than zero");
        require(msg.value > 0, "Collateral required");
        require(_interestRate > 0, "Interest rate required");
        require(_duration > 0, "Duration required");

        loanCounter++;

        loans[loanCounter] = Loan({
            id: loanCounter,
            borrower: payable(msg.sender),
            lender: payable(address(0)),
            loanAmount: _loanAmount,
            collateralAmount: msg.value,
            interestRate: _interestRate,
            duration: _duration,
            fundedAt: 0,
            status: Status.Requested
        });

        emit LoanRequested(
            loanCounter,
            msg.sender,
            _loanAmount,
            msg.value,
            _interestRate,
            _duration
        );

        return loanCounter;
    }

    // =========================================================
    // 2. FUND LOAN
    // =========================================================

    function fundLoan(uint256 _loanId)
        external
        payable
        nonReentrant
    {
        Loan storage loan = loans[_loanId];

        require(loan.id != 0, "Loan does not exist");
        require(
            loan.status == Status.Requested,
            "Loan is not available"
        );

        require(
            msg.sender != loan.borrower,
            "Borrower cannot fund own loan"
        );

        require(
            msg.value == loan.loanAmount,
            "Incorrect funding amount"
        );

        loan.lender = payable(msg.sender);
        loan.fundedAt = block.timestamp;
        loan.status = Status.Funded;

        // Send loan amount to borrower
        (bool success, ) = loan.borrower.call{
            value: loan.loanAmount
        }("");

        require(success, "Transfer to borrower failed");

        emit LoanFunded(
            _loanId,
            msg.sender,
            msg.value
        );
    }

    // =========================================================
    // 3. CALCULATE INTEREST
    // =========================================================

    function calculateInterest(uint256 _loanId)
        public
        view
        returns (uint256)
    {
        Loan memory loan = loans[_loanId];

        require(loan.id != 0, "Loan does not exist");

        uint256 interest = (
            loan.loanAmount *
            loan.interestRate
        ) / 100;

        return interest;
    }

    // =========================================================
    // 4. CALCULATE TOTAL REPAYMENT
    // =========================================================

    function getRepaymentAmount(uint256 _loanId)
        public
        view
        returns (uint256)
    {
        Loan memory loan = loans[_loanId];

        require(loan.id != 0, "Loan does not exist");

        uint256 interest = calculateInterest(_loanId);

        return loan.loanAmount + interest;
    }

    // =========================================================
    // 5. REPAY LOAN
    // =========================================================

    function repayLoan(uint256 _loanId)
        external
        payable
        nonReentrant
    {
        Loan storage loan = loans[_loanId];

        require(loan.id != 0, "Loan does not exist");

        require(
            loan.status == Status.Funded,
            "Loan is not active"
        );

        require(
            msg.sender == loan.borrower,
            "Only borrower can repay"
        );

        uint256 interest = (
            loan.loanAmount *
            loan.interestRate
        ) / 100;

        uint256 totalRepayment =
            loan.loanAmount + interest;

        require(
            msg.value == totalRepayment,
            "Incorrect repayment amount"
        );

        loan.status = Status.Repaid;

        // Pay lender
        (bool lenderPaid, ) = loan.lender.call{
            value: totalRepayment
        }("");

        require(
            lenderPaid,
            "Payment to lender failed"
        );

        // Return collateral to borrower
        (bool collateralReturned, ) =
            loan.borrower.call{
                value: loan.collateralAmount
            }("");

        require(
            collateralReturned,
            "Collateral return failed"
        );

        emit LoanRepaid(
            _loanId,
            msg.sender,
            totalRepayment
        );
    }

    // =========================================================
    // 6. CLAIM COLLATERAL / DEFAULT
    // =========================================================

    function claimCollateral(uint256 _loanId)
        external
        nonReentrant
    {
        Loan storage loan = loans[_loanId];

        require(loan.id != 0, "Loan does not exist");

        require(
            loan.status == Status.Funded,
            "Loan is not active"
        );

        require(
            block.timestamp >
            loan.fundedAt + loan.duration,
            "Loan is not overdue"
        );

        loan.status = Status.Defaulted;

        uint256 collateral =
            loan.collateralAmount;

        // Give collateral to lender
        (bool success, ) =
            loan.lender.call{
                value: collateral
            }("");

        require(
            success,
            "Collateral transfer failed"
        );

        emit LoanDefaulted(
            _loanId,
            loan.lender,
            collateral
        );
    }

    // =========================================================
    // 7. GET LOAN
    // =========================================================

    function getLoan(uint256 _loanId)
        external
        view
        returns (Loan memory)
    {
        require(
            loans[_loanId].id != 0,
            "Loan does not exist"
        );

        return loans[_loanId];
    }

    // =========================================================
    // 8. GET ALL LOANS
    // =========================================================

    function getAllLoans()
        external
        view
        returns (Loan[] memory)
    {
        Loan[] memory allLoans =
            new Loan[](loanCounter);

        for (uint256 i = 1; i <= loanCounter; i++) {
            allLoans[i - 1] = loans[i];
        }

        return allLoans;
    }

    // =========================================================
    // 9. GET LOAN STATUS
    // =========================================================

    function getLoanStatus(uint256 _loanId)
        external
        view
        returns (Status)
    {
        return loans[_loanId].status;
    }

    // =========================================================
    // 10. CHECK IF LOAN IS OVERDUE
    // =========================================================

    function isOverdue(uint256 _loanId)
        external
        view
        returns (bool)
    {
        Loan memory loan = loans[_loanId];

        if (loan.status != Status.Funded) {
            return false;
        }

        return (
            block.timestamp >
            loan.fundedAt + loan.duration
        );
    }

    // =========================================================
    // RECEIVE ETH
    // =========================================================

    receive() external payable {}
}
