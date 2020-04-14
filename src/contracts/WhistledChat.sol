pragma solidity >=0.4.21;


contract WhistledChat {
    //state var
    string public contractName;

   
    constructor() public {
        contractName = "Whistled Chat";
    }


    enum RelationshipType {NoRelation, Requested, Connected}

    struct Member{
        bytes32 publicKeyLeft;
        bytes32 publicKeyRight;
        bytes32 name;
        uint messageStartBlock;
        bool isMember;
    }

    mapping (address => mapping (address => RelationshipType)) relationships;
    mapping (address => Member) public members;


   
    function addContact(address addr) public onlyMember {
        require(relationships[msg.sender][addr] == RelationshipType.NoRelation, "Already connected");
        require(relationships[addr][msg.sender] == RelationshipType.NoRelation, "Already connected");
        
        relationships[msg.sender][addr] = RelationshipType.Requested;
        emit addContactEvent(msg.sender, addr);
    }
     event addContactEvent(address a, address b);
    

    function acceptContactRequest(address addr) public onlyMember {
        require(relationships[addr][msg.sender] == RelationshipType.Requested,"There is no invitation to accept");
        
        relationships[msg.sender][addr] = RelationshipType.Connected;
        relationships[addr][msg.sender] = RelationshipType.Connected;

        emit acceptContactEvent(msg.sender, addr);
    }
    event acceptContactEvent(address a, address b);
    
    function join(bytes32 publicKeyLeft, bytes32 publicKeyRight) public {
        require(members[msg.sender].isMember == false, "You are already a member");
        
        Member memory newMember = Member(publicKeyLeft, publicKeyRight, "", 0, true);
        members[msg.sender] = newMember;
    }
    
    function sendMessage(address to, bytes memory message, bytes32 encryption) public onlyMember {
        require(relationships[to][msg.sender] == RelationshipType.Connected, "you are not connected to this person");

        if (members[to].messageStartBlock == 0) {
            members[to].messageStartBlock = block.number;
        }
        
        emit messageSentEvent(msg.sender, to, message, encryption);
    }
    event messageSentEvent(address a, address c, bytes b, bytes32 enc);
    
/*    
    
    function updateProfile(bytes32 name, bytes32 avatarUrl) public onlyMember {
        members[msg.sender].name = name;
        members[msg.sender].avatarUrl = avatarUrl;
        emit profileUpdateEvent(msg.sender, name, avatarUrl);
    } */
    
    modifier onlyMember() {
        require(members[msg.sender].isMember == true, "You are not the owner");
        _;
    }
    
    function getRelationWith(address a) public view onlyMember returns (RelationshipType) {
        return relationships[msg.sender][a];
    }

}
