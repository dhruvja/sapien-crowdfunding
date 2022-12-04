import React, { Component } from "react";
import "./App.css";
import { getWeb3 } from "./getWeb3";
import map from "./artifacts/deployments/map.json";
import { getEthereum } from "./getEthereum";
import { Button } from "semantic-ui-react";
import Login from "./pages/login";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Projects from './pages/projects';
import HostProject from './pages/hostproject'
import Payment from './pages/paymentpage'
import Investments from './pages/investments'
import Register from './pages/register'

class App extends Component {
    state = {
        web3: null,
        accounts: null,
        chainid: null,
        solidityStorage: null,
        solidityValue: 0,
        solidityInput: 0,
    };

    connectToWeb3 = async () => {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Try and enable accounts (connect metamask)
        try {
            const ethereum = await getEthereum();
            ethereum.enable();
        } catch (e) {
            console.log(`Could not enable accounts. Interaction with contracts not available.
            Use a modern browser with a Web3 plugin to fix this issue.`);
            console.log(e);
        }

        // Use web3 to get the user's accounts
        const accounts = await web3.eth.getAccounts();
        console.log(accounts[0]);

        // Get the current chain id
        const chainid = parseInt(await web3.eth.getChainId());

        this.setState(
            {
                web3,
                accounts,
                chainid,
            },
            await this.loadInitialContracts
        );
    };

    loadInitialContracts = async () => {
        // <=42 to exclude Kovan, <42 to include kovan
        console.log(this.state.chainid);

        var _chainID = 0;
        if (this.state.chainid === 42) {
            _chainID = 42;
        }
        if (this.state.chainid === 1337) {
            _chainID = "dev";
        }
        console.log(_chainID);
        const solidityStorage = await this.loadContract(
            _chainID,
            "SolidityStorage"
        );

        if (!solidityStorage) {
            return;
        }

        const solidityValue = await solidityStorage.methods.get().call();

        this.setState({
            solidityStorage,
            solidityValue,
        });
    };

    loadContract = async (chain, contractName) => {
        // Load a deployed contract instance into a web3 contract object
        const { web3 } = this.state;

        // Get the address of the most recent deployment from the deployment map
        let address;
        try {
            address = map[chain][contractName][0];
        } catch (e) {
            console.log(
                `Couldn't find any deployed contract "${contractName}" on the chain "${chain}".`
            );
            return undefined;
        }

        // Load the artifact with the specified address
        let contractArtifact;
        try {
            contractArtifact = await import(
                `./artifacts/deployments/${chain}/${address}.json`
            );
        } catch (e) {
            console.log(
                `Failed to load contract artifact "./artifacts/deployments/${chain}/${address}.json"`
            );
            return undefined;
        }

        return new web3.eth.Contract(contractArtifact.abi, address);
    };

    

    changeSolidity = async (e) => {
        const { accounts, solidityStorage, solidityInput } = this.state;
        e.preventDefault();
        const value = parseInt(solidityInput);
        if (isNaN(value)) {
            alert("invalid value");
            return;
        }
        await solidityStorage.methods
            .set(value)
            .send({ from: accounts[0] })
            .on("receipt", async () => {
                this.setState({
                    solidityValue: await solidityStorage.methods.get().call(),
                });
            });
    };

    render() {
        const {
            web3,
            accounts,
            chainid,
            solidityStorage,
            solidityValue,
            solidityInput,
        } = this.state;

        // if (!web3) {
        //     return <div>Loading Web3, accounts, and contracts...</div>;
        // }

        // // <=42 to exclude Kovan, <42 to include Kovan
        // if (isNaN(chainid)) {
        //     return (
        //         <div>
        //             Wrong Network! Switch to your local RPC "Localhost: 8545" in
        //             your Web3 provider (e.g. Metamask)
        //         </div>
        //     );
        // }

        // if (!solidityStorage) {
        //     return (
        //         <div>
        //             Could not find a deployed contract. Check console for
        //             details.
        //         </div>
        //     );
        // }

        // const isAccountsUnlocked = accounts ? accounts.length > 0 : false;

        return (
            <div className="App">
                <Router>
                    <Switch>
                        <Route path="/investments" component={Investments} />
                        <Route path="/payment" component={Payment} />
                        <Route path="/login" component={Login} />
                        <Route path="/projects" component={Projects} />
                        <Route path="/hostproject" component={HostProject} />
                        <Route path="/" component={Register} />
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;
