pragma solidity ^0.4.4;

// Goals:
// Internal facing functionality allowing admins to create contracts adding to the blockchain, and setting prices
// External facing functionality allowing users to query coin prices, and current contracts
// Partially external facing functionality allowing Investor class users secure purchasing and exchange of coins

contract UserFunctionalities
{
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     *  System events to inform front-end of various things  *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    // An event that is called whenever a new Admin account is added
    event AddedAdmin(uint adminNum);
    // An event that is called whenever a new Investor account is added
    event AddedInvestor(uint investorNum);
	// Events allow light clients to react on changes efficiently. (From the coinage tutorial)
    event Sent(address from, address to, uint amount);


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     *  Mappings used to store various accounts and balances *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    // Think of these as a hash table, with the key as a uint and value of the struct Admin/Investor. 
	// These mappings will be used in the majority of our transactions/calls
    // This mapping holds all the user balances for access
	mapping (address => uint) public balances;
    // These mappings will hold all the admin and investor accounts respectively
    mapping (uint => Admin) admins;
    mapping (uint => Investor) investors;


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     *  User structs define different accounts and their capabilities  *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    // Describes an Admin, an account capable of creating coins and contracts, and setting coin prices
    struct Admin
	{
        bytes32 AdminID; // Name or other form of unique ID, bytes32 are basically a string
		address public adminPurse; // A balance for an Admin to store newly minted coins in, and to take payments into
		address private minter; // An address assigned to Admins for minting coins
		function mintCoins(uint numOfCoins) private; // Allows Admins to create new coins
	    function setCoinPrice(uint priceOfCoins) private; // Allows Admins to set coin prices
		function createContract(bytes32 contractID) private; // For contract creation? What does that mean in this context?
    }
    
	// Describes an Investor, an account capable of purchasing coins, querying coin prices, and querying for the current contract list
    struct Investor
	{
        bytes32 InvestorID; // Name or other form of unique ID
		address public investorPurse; // A balance for the Investor to store coins in
	    function buyCoins(uint numOfCoins, uint adminID) public; // Allows investors to buy coins from an Admin
	    function getCoinPrice() public; // Returns current coin price
		function getContracts() public; // Returns a list of current contracts
    }

    
	/* * * * * * * * * * * * * * * * * * * * * *
     * Function protoypes and state variables  *
     * * * * * * * * * * * * * * * * * * * * * */
	// Creates a new admin account
	function addAdmin(bytes32 adminID) public;
	// Creates a new investor account
	function addInvestor(bytes32 investorID) public;
  
    uint numAdmins; // Keeps track of the number of admins, also used as a way to index them
    uint numInvestors; // Keeps track of the number of investors, also used as a way to index them
	uint globalCoinPrice; // Keeps track of the price of coins, settable only by Admins
    
    /* * * * * * * * * * * * * * * *
     *  Account Creation Functions *
     * * * * * * * * * * * * * * * */
	// Creates a new admin account
    function addAdmin(bytes32 adminID) public
	{
        // adminNum is the return variable
        uint adminNum = numAdmins++;
        // Creates new Admin Struct with name and saves it to storage.
        admins[adminNum] = Admin(adminID);
		// Set this admin accounts coin minter as it's message sender
        admins[adminNum].minter = msg.sender;
		// Calls the event to inform the front-end of the new admin account creation
        AddedAdmin(adminNum);
    }

	// Creates a new investor account
	function addInvestor(bytes32 investorID) public;
	{
        // investorNum is the return variable
        uint investorNum = numInvestors++;
        // Creates new Investor Struct with name and saves it to storage.
        investors[investorNum] = Investor(investorID);
		// Calls the event to inform the front-end of the new investor account creation
        AddedInvestor(investorNum);		
	}


    /* * * * * * * * * * * * * * *
     *  Admin account functions  *
     * * * * * * * * * * * * * * */
	 // Allows Admins to create new coins
	function Admin::mintCoins(uint numOfCoins) private
	{
		if (msg.sender != minter) return;
        adminPurse += numOfCoins;
	}

	// Allows Admins to set coin prices
	function Admin::setCoinPrice(uint priceOfCoins) private
	{
		globalCoinPrice = priceOfCoins;
	}

	// For contract creation? What does that mean in this context?
	function Admin::createContract(bytes32 contractID) private
	{
		return;
	}


    /* * * * * * * * * * * * * * * *
     *  Investor account functions *
     * * * * * * * * * * * * * * * */
	// Allows investors to buy coins from an Admin
	function buyCoins(uint numOfCoins, uint adminID) public
	{
		investorPurse += numOfCoins;
		admins[adminID].adminPurse -= numOfCoins;

	}

	// Returns current coin price
    function getCoinPrice() public
	{
		// Returns globalCoinPrice
		// How do returns work in Solidity? Output this to a UI point?
	}

	// Returns a list of current contracts, still not sure what a "contract" is, if that means a Solidity contract or what
	function getContracts() public
	{
		return;
	}
}