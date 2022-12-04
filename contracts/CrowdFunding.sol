// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract CrowdFunding{

    AggregatorV3Interface public priceFeed;
    event errorLog(string error);

    constructor(address _priceFeed) {
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    struct INVESTMENTS{
        uint256 amount;
        uint256 id;
        address to;
    }

    struct INVESTOR{
        address myAddress;
        string name;
    }

    uint256[] totalProjectAmount;

    struct FUNDRAISER{
        address myAddress;
        string name;
    }

    mapping(address => INVESTOR) public investorConnection;
    mapping(address => FUNDRAISER) public fundraiserConnection;
    mapping(address => INVESTMENTS[]) public previous;
    mapping(uint256 => INVESTMENTS[]) public projectInvestments;
    mapping(address => mapping(uint256 => uint256)) public projects;

    function getMinimumFund() public view returns(uint256){
        uint256 minAmount = 1 * 10**18;
        uint256 price = getPrice();
        uint256 precision = 1 * 10**18;
        return (minAmount * precision)/price;
    }

    function getPrice() public view returns (uint256) {
        (, int256 answer, , , ) = priceFeed.latestRoundData();
        return uint256(answer * 10000000000);
    }

    function getConversionRate(uint256 eth) public view returns (uint256) {
        uint256 price = getPrice();
        uint256 ethAmountInUSD = (price * eth) / 1000000000000000000;
        return ethAmountInUSD;
    }

    function hostProject(uint256 id) public{
        projects[msg.sender][id] = 0;
    }

    function pay(uint256 id, address _to) payable public{
        if(getConversionRate(msg.value) < getMinimumFund()){
            emit errorLog("You have to spend alteast 1 dollar");
            require(false,"You have to spend alteast 1 dollar");
        }
        uint256 total;
        total = projects[_to][id];
        total += msg.value;
        payable(_to).transfer(msg.value);
        previous[msg.sender].push(INVESTMENTS(msg.value,id,_to));
        projectInvestments[id].push(INVESTMENTS(msg.value,id,_to));
        projects[_to][id] = total;
    }

    function getProjectAmount(uint256 id, address fundraiser) public view returns(uint256){
        return projects[fundraiser][id];
    }

    function getPreviousInvestments() public view returns(INVESTMENTS[] memory){
        return previous[msg.sender];
    }

    function getAllProjectInvestments(uint256 id) public view returns(INVESTMENTS[] memory){
        return projectInvestments[id];
    }

}