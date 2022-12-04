import React, { useEffect, useState } from "react";
import {
    Segment,
    Menu,
    Icon,
    Header,
    Sidebar,
    Divider,
    Button,
    Grid,
    Image,
    Form,
} from "semantic-ui-react";
import { getEthereum } from "../../getEthereum";
import { getWeb3 } from "../../getWeb3";
import {Link} from 'react-router-dom';

// import { Link, Redirect } from "react-router-dom";

function Startbar(props) {

    const[connection, setConnection] = useState(false)

    useEffect(() => {

        connectToWeb3()

    },[])
    
    const connectToWeb3 = async() => {
        const web3 = await getWeb3();

        // Try and enable accounts (connect metamask)
        try {
            const ethereum = await getEthereum();
            ethereum.enable();
            setConnection(true)
        } catch (e) {
            console.log(`Could not enable accounts. Interaction with contracts not available.
            Use a modern browser with a Web3 plugin to fix this issue.`);
            console.log(e);
        }

        // Use web3 to get the user's accounts
        const accounts = await web3.eth.getAccounts();
        console.log(accounts[0])

        // Get the current chain id
        const chainid = parseInt(await web3.eth.getChainId());
        props.parentCallBack({accounts: accounts, chainId: chainid})
    }


    const handleItemClick = () => {
        console.log("Item logged");
    };


    return (
        <div>
            <Segment inverted>
                <Menu inverted pointing secondary stackable>
                    <Menu.Item header>Crowd Funding Platform</Menu.Item>
                    <Menu.Menu position="right">
                        <Menu.Item
                            name="video camera"
                        >
                           {connection ? <Icon name="circle" color="green" onClick={connectToWeb3} /> : <Icon name="circle" color="red" onClick={connectToWeb3} />} 
                           { connection ? "Connected" : "Not Connected" }
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
            </Segment>
        </div>
    );
}

export default Startbar;