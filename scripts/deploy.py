from scripts.helpfulScripts import getAccounts, LOCAL_BLOCKCHAIN_NETWORKS
from brownie import network, CrowdFunding, config, MockV3Aggregator, accounts
from web3 import Web3

def deployCrowdFunding():
    account = getAccounts()
    if network.show_active() not in LOCAL_BLOCKCHAIN_NETWORKS:
        priceFeedAddress = config['networks'][network.show_active()]['eth-usd-price']
    else:
        if len(MockV3Aggregator) <= 0:
            priceFeedAddress = MockV3Aggregator.deploy(8, 200000000000, {"from": account})
            priceFeedAddress = priceFeedAddress.address
        else:
            priceFeedAddress = MockV3Aggregator[-1].address

    crowd_funding = CrowdFunding.deploy(priceFeedAddress, {"from": account})
    print(crowd_funding)    
    return crowd_funding

def hostProject():
    crowd_funding = CrowdFunding[-1]
    account = getAccounts()
    tx = crowd_funding.hostProject(1,{"from": account})
    tx.wait(1)
    print(tx)
    print(account.balance())

def fundProject():
    crowd_funding = CrowdFunding[-1]
    account = getAccounts()
    print("Balance before paying " + str(accounts[2].balance()))
    tx = crowd_funding.pay(10, account, {"from": accounts[2], "value": Web3.toWei(1,"ether")})
    tx.wait(1)
    print("Balance after paying " + str(accounts[2].balance()))

def details():
    crowd_funding = CrowdFunding[-1]
    account = getAccounts()
    # try:
    projectAmount = crowd_funding.getProjectAmount(10,{"from": account})
    tx = crowd_funding.getPreviousInvestments({"from": accounts[2]})
    tx2 = crowd_funding.getAllProjectInvestments(10)
    print(tx2)
    print(tx)
    print(projectAmount)


def main():
    deployCrowdFunding()
    # hostProject()
    # fundProject()
    # details()