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

    event CasePurchased(
        uint256 caseId,
        CaseType caseType,
        string caseTitle,
        string caseDescribtion,
        uint256 casePrice,
        address payable owner,
        bool isPurchased
    );

    function createCase(string memory _caseTitle,CaseType _caseType,string memory _caseDescribtion,uint256 _casePrice) public {
        //requires valid name and price
        require(bytes(_caseTitle).length > 0, "Case Title is not valid!");
        require(_casePrice > 0, "Case price is not valid!");

        caseCount++;
        //create the case
        cases[caseCount] = Case(caseCount,_caseType,_caseTitle,_caseDescribtion,_casePrice,msg.sender,false);

        //emit the event
        emit CaseCreated(caseCount,_caseType,_caseTitle,_caseDescribtion,_casePrice,msg.sender,false);

    }


    function purchaseCase(uint256 _caseId)public payable{

        //fetch the case
        Case memory _case = cases[_caseId];

        //fetch the owner
        address payable _seller = _case.owner;

        //ensure case has a valid id
        require(_case.caseId>0 && _case.caseId<=caseCount, "wrong case id");

         //require that it has enough Ether
        require(msg.value>=_case.casePrice, "not enough ether");

        //require that's not prudhced
        require(!_case.isPurchased, "case already purchsed");

        //require that buyer is not seller
        require(_seller != msg.sender, "can't buy your own cases");

        //now we ensured all, transfer ownership and mark as Purchased
        _case.owner = msg.sender;
        _case.isPurchased = true;

        //update the list
        cases[_caseId] = _case;

        //pay the seller
        _seller.transfer(msg.value);

        //trigger purchase event
        emit CasePurchased(caseCount,_case.caseType,_case.caseTitle,_case.caseDescribtion,_case.casePrice,msg.sender,true);

    }



}
