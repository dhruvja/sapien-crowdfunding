from brownie import network, config, accounts

FORKED_NETWORKS = ["mainnet-fork-dev"]
LOCAL_BLOCKCHAIN_NETWORKS = ["development", "ganache-local"]


def getAccounts():
    if network.show_active() in LOCAL_BLOCKCHAIN_NETWORKS or network.show_active() in FORKED_NETWORKS:  
        return accounts[0]
    else:
        return accounts.add(config['wallets']['from_key'])