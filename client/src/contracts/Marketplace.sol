pragma solidity >=0.4.21 <0.6.2;

contract Marketplace {
    //state var
    string public contractName;

    //use this not to point at empty mapping
    uint256 public caseCount = 0;

    //similar to linkedList
    mapping(uint256 => Case) public cases;

    //enum of case Types
    enum CaseType {Bribery, Extortion}

    constructor() public {
        contractName = "Whistled Market";
    }

    struct Case {
        uint256 caseId;
        CaseType castType; //change this to enum
        string caseTitle;
        uint256 casePrice;
        address payable owner;
        bool isPurchased;
    }

    event CaseCreated(uint256 caseId, string cast);
}
