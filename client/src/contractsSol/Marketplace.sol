pragma solidity >=0.4.21 <0.6.2;

contract Marketplace {
    //state var
    string public contractName;

    //use this not to point at empty mapping
    uint256 public caseCount = 0;

    //similar to linkedList
    mapping(uint256 => Case) public cases;

    constructor() public {
        contractName = "Whistled Market";
    }

    struct Case {
        uint256 caseId;
        string title;
        uint256 price;
        address payable owner;
        bool purchased;
    }
}
