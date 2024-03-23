// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;


import "@openzeppelin/contracts/access/Ownable2Step.sol";
import {ERC721} from "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC721URIStorage} from "openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721Burnable} from "openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import {ERC721Royalty} from "openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title RegenFrogs.sol
 * @dev Contract that allows a user to self-serve mint ERC721 from a signed frog profile.
 * @author Audrey & Leeward Bound
 */
contract RegenFrogs is ERC721Enumerable, ERC721URIStorage, ERC721Burnable, Ownable2Step {
    bool public live;
    string private _baseURIString;
    address private _creator;
    uint256 private totalMintedEver;
    string _contractURI;
    address public charity;

    mapping(address => uint256) private _nonces;

    // errors
    error MintNotLive();
    error InsufficientPayment();
    error TokenDoesNotExist();

    // events
    event ContractURIUpdated();

    /**
    * @dev Checks if the contract supports a particular interfaceId
    * @param interfaceId Id of the interface to be checked
    * @return bool indicating if the interface is supported
    */
    function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(ERC721, ERC721URIStorage, ERC721Enumerable)
    returns (bool)
    {
        return ERC721.supportsInterface(interfaceId) ||
        ERC721URIStorage.supportsInterface(interfaceId) ||
        ERC721Enumerable.supportsInterface(interfaceId) ||
        interfaceId == bytes4(0x49064906) || // IERC4906
            super.supportsInterface(interfaceId);
    }

    modifier whenLive() {
        if (!live) revert MintNotLive();
        _;
    }

    /**
     * @dev Constructor
     * @param _name Name of the NFT
     * @param _ticker Ticker of the NFT
     * @param _creatorAddr Address of the creator
     */
    constructor(string memory _name, string memory _ticker, address _creatorAddr, address _charity)
    ERC721(_name, _ticker)
    Ownable(msg.sender)
    {
        _creator = _creatorAddr;
        charity = _charity;
    }

    /**
    * @dev Public function to mint new NFTs
    * @param to The address receiving the minted token
    * @param nonce A unique, user-provided number to prevent replay attacks
    * @param _uri A url containing metadata related to the NFT
    * @param price The cost of minting the token
    * @param expires An expiration time for the signature
    * @param signature A signature of the user authorizing the mint operation
    * @return The unique tokenId of the new NFT
    */
    function mint(address to, uint256 nonce, string memory _uri, uint256 price, uint256 expires, bytes memory signature) external payable whenLive returns (uint256) {
        if (msg.value < price) revert InsufficientPayment();
        require(verifyCreatorSignedMint(to, nonce, _uri, price, expires, signature), "Invalid signature");
        require(expires > block.timestamp, "Expired signature");
        require(nonce > _nonces[to], "Invalid nonce");
        (bool success,) = payable(charity).call{value: msg.value}("");
        require(success);
        totalMintedEver += 1; // This is the new token's ID
        _safeMint(to, totalMintedEver);
        _setTokenURI(totalMintedEver, _uri);
        _nonces[to] = nonce;
        return totalMintedEver;
    }

    /**
    * @dev Computes the hash of the given parameters
    * @param to The address that will receive the minted token
    * @param nonce A unique, user-provided number to prevent replay attacks
    * @param _uri A url containing metadata related to the NFT
    * @param price The cost of minting the token
    * @param expires An expiration time for the signature
    * @return The hash of the given parameters
    */
    function hashOf(address to, uint256 nonce, string memory _uri, uint256 price, uint256 expires) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(to, nonce, _uri, price, expires));
    }

    /**
    * @dev Computes the signer of the given parameters
    * @param to The address that will receive the minted token
    * @param nonce A unique, user-provided number to prevent replay attacks
    * @param _uri A url containing metadata related to the NFT
    * @param price The cost of minting the token
    * @param expires An expiration time for the signature
    * @return The signer address of the given parameters
    */
    function signerOf(address to, uint256 nonce, string memory _uri, uint256 price, uint256 expires, bytes memory signature) public pure returns (address) {
        bytes32 signedHash = MessageHashUtils.toEthSignedMessageHash(hashOf(to, nonce, _uri, price, expires));
        return ECDSA.recover(signedHash, signature);
    }

    /**
    * @dev Verifies the valid signature of a mint operation
    * @param to The address that will receive the minted token
    * @param nonce A unique, user-provided number to prevent replay attacks
    * @param _uri A url containing metadata related to the NFT
    * @param price The cost of minting the token
    * @param expires An expiration time for the signature
    * @return A boolean indicating if the signature is valid
    */
    function verifyCreatorSignedMint(address to, uint256 nonce, string memory _uri, uint256 price, uint256 expires, bytes memory signature) public view returns (bool) {
        return signerOf(to, nonce, _uri, price, expires, signature) == _creator;
    }

    /**
     * @dev Function to toggle the minting to live or not
     */
    function toggleLive() external onlyOwner {
        live = !live;
    }

    /**
     * @dev Function to set the base URI
     * @param _uri Base URI of the NFT
     */
    function setBaseUri(string calldata _uri) external onlyOwner {
        _baseURIString = _uri;
    }

    /**
     * @dev Returns the address of the contract creator
     */
    function creator() public view returns (address) {
        return _creator;
    }

    /**
     * @dev Returns the nonce of a specific account
     * @param account Ethereum address of the account
     */
    function nonceOf(address account) public view returns (uint256) {
        return _nonces[account];
    }

    /**
     * @dev Updates the creator of the contract
     * @param _creatorAddr Ethereum address of the new creator
     */
    function setCreator(address _creatorAddr) public onlyOwner {
        _creator = _creatorAddr;
    }

    /**
     * @dev Updates the charity beneficiary of the contract
     * @param _charity Ethereum address of the new charity
     */
    function setCharity(address _charity) public onlyOwner {
        charity = _charity;
    }


    /**
     * @dev Function to get the token URI
     * @param tokenId ID of the token
     * @return URI of the NFT
     */
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev Function to set the token URI
     * @param tokenId ID of the token
     * @param _uri New URI of the token
     */
    function setTokenURI(uint256 tokenId, string memory _uri) public onlyOwner {
        _setTokenURI(tokenId, _uri);
        emit MetadataUpdate(tokenId);
    }

    /**
     * @dev Function to get URI of the contract
     * @return The URI string of the contract
     */
    function contractURI() external view returns (string memory) {
        return _contractURI;
    }

    /**
     * @dev Function to set the URI of the contract
     * @param newURI The new URI of the contract
     */
    function setContractURI(string memory newURI) external onlyOwner {
        _contractURI = newURI;
        emit ContractURIUpdated();
    }

    /**
     * @dev Function to retrieve the funds stored in the contract
     */
    function withdraw() external onlyOwner {
        (bool success,) = payable(msg.sender).call{value: address(this).balance}("");
        require(success);
    }

    /**
     * @dev Function to update the owner of a specific token
     * @param to The address of the new owner
     * @param tokenId The token Id to be transferred
     * @param auth The authorization of the new owner
     * @return The address of the new owner
     */
    function _update(address to, uint256 tokenId, address auth) internal virtual override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    /**
     * @dev Function to increase the balance of a specific account
     * @param account The account to increase the balance of
     * @param value The value to increase the balance by
     */
    function _increaseBalance(address account, uint128 value) internal virtual override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    /**
     * @dev Function to burn a specific token
     * @param tokenId The token ID to burn
     */
    function burn(uint256 tokenId) public virtual override(ERC721Burnable) {
        require(ownerOf(tokenId) == msg.sender || msg.sender == owner(), "You must own the token to burn it");
        // Burn the NFT
        super.burn(tokenId);
        _setTokenURI(tokenId, "");
    }
}