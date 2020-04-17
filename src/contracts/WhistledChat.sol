pragma solidity >=0.4.21;


contract WhistledChat {
    //state var
    string public contractName;
    uint256 public membersCount = 0;

    constructor() public {
        contractName = "Whistled Chat";
    }

    enum RelationshipType {NoRelation, Requested, Connected}

    struct Member {
        address memAddress;
        uint256 messageStartBlock;
        bool isMember;
    }

    mapping(address => mapping(address => RelationshipType)) relationships;
    mapping(address => Member) public members;

    function addContact(address addr) public onlyMember {
        require(
            relationships[msg.sender][addr] == RelationshipType.NoRelation,
            "Already connected"
        );
        require(
            relationships[addr][msg.sender] == RelationshipType.NoRelation,
            "Already connected"
        );

        relationships[msg.sender][addr] = RelationshipType.Requested;
        emit addContactEvent(msg.sender, addr);
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

    event acceptContactEvent(address a, address b);

    function join() public {
        require(
            members[msg.sender].isMember == false,
            "You are already a member"
        );

        Member memory newMember = Member(msg.sender, 0, true);
        members[msg.sender] = newMember;
        membersCount++;
    }

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

    event messageSentEvent(address a, address c, string b);

    modifier onlyMember() {
        require(members[msg.sender].isMember == true, "You are not the owner");
        _;
    }

    function getRelationWith(address a) public view returns (RelationshipType) {
        return relationships[msg.sender][a];
    }
}
