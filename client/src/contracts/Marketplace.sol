pragma solidity >=0.4.21 <0.6.2;

contract Marketplace {
    //state var
    string public contractName;

    //use this not to point at empty mapping
    uint256 public caseCount = 0;

    //similar to linkedList
    mapping(uint256 => Case) public cases;

    //enum of case Types
    enum CaseType {Bribery, Extortion, MoneyLaundry}

    constructor() public {
        contractName = "Whistled Market";
    }

    struct Case {
        uint256 caseId;
        CaseType caseType; //change this to enum
        string caseTitle;
        string caseDescribtion;
        uint256 casePrice;
        address payable owner;
        bool isPurchased;
    }

    event CaseCreated(
        uint256 caseId,
        CaseType caseType,
        string caseTitle,
        string caseDescribtion,
        uint256 casePrice,
        address payable owner,
        bool isPurchased
    );

    function createCase(string memory _caseTitle,CaseType _caseType,string memory _caseDescribtion, uint256 _casePrice) public{
        caseCount++;
        //create the case
        cases[caseCount] = Case(
            caseCount,
            _caseType,
            _caseTitle,
            _caseDescribtion,
            _casePrice,
            msg.sender,
            false);
            
        //emit the event
        emit CaseCreated(
            caseCount,
            _caseType,
            _caseTitle,
            _caseDescribtion,
            _casePrice,
            msg.sender,
            false
        );

    }
}
