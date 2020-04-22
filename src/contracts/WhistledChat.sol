pragma solidity >=0.4.21;


contract WhistledChat {
    //state var
    string public contractName;
    uint256 public membersCount = 0;
    uint256 public relationsCount =0;

    constructor() public {
        contractName = "Whistled Chat";
    }

    enum RelationshipType {NoRelation, Requested, Connected}

    struct Member {
        address memAddress;
        uint256 messageStartBlock;
        bool isMember;
    }

    mapping(address => mapping(address => RelationshipType)) public relationships;
    mapping(address => Member) public members;

    function addContact(address addr) public onlyMember {
        require(
            relationships[msg.sender][addr] == RelationshipType.NoRelation,
            "you already sent an invitation"
        );
        require(
            relationships[addr][msg.sender] == RelationshipType.NoRelation,
            "the person already send an invitation, accept the invitation"
        );

        relationships[msg.sender][addr] = RelationshipType.Requested;
        emit addContactEvent(msg.sender, addr);
        relationsCount++;
    }

    event addContactEvent(address requester, address receiver);

    function acceptContactRequest(address addr) public onlyMember {
        require(
            relationships[addr][msg.sender] == RelationshipType.Requested,
            "There is no invitation to accept"
        );

        relationships[msg.sender][addr] = RelationshipType.Connected;
        relationships[addr][msg.sender] = RelationshipType.Connected;

        emit acceptContactEvent(msg.sender, addr);
    }

    event acceptContactEvent(address theAccepting, address theAccepted);

    function join() public {
        require(
            members[msg.sender].isMember == false,
            "You are already a member"
        );

        Member memory newMember = Member(msg.sender, block.number, true);
        members[msg.sender] = newMember;
        membersCount++;

        emit newMemberJoined(msg.sender, block.number);
    }

    event newMemberJoined(address newMemberAddress, uint256 blockNum);

    function sendMessage(address to, string memory message) public onlyMember {
        require(
            relationships[to][msg.sender] == RelationshipType.Connected,
            "you are not connected to this person"
        );

        if (members[to].messageStartBlock == 0) {
            members[to].messageStartBlock = block.number;
        }

        emit messageSentEvent(msg.sender, to, message);
    }

    event messageSentEvent(address msgSender, address msgReceiver, string messages);

    modifier onlyMember() {
        require(members[msg.sender].isMember == true, "You are not the owner");
        _;
    }

    function getRelationWith(address a) public view returns (RelationshipType) {
        return relationships[msg.sender][a];
    }
}
