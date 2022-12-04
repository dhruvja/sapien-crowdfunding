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

function Navbar(props) {

    const[connection, setConnection] = useState(false)
    const [username, setUsername] = useState("")
    const [present, setPresent] = useState(false)

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
        var name="account"
        let token = document.cookie.match(`(?:(?:^|.*; *)${name} *= *([^;]*).*$)|^.*$`)[1]
        if(token == null || token != accounts[0]){
            console.log("fetching")
            var url = "http://localhost:5000/api/fetchDetails/" + accounts[0]
            fetch(url)
            .then(res => res.json())
            .then(data => {
                document.cookie = "account=" + accounts[0]
                document.cookie = "id=" + data.id
                document.cookie = "username=" + data.username 
                setUsername(data.username)
                setUsername(username)

            })
        }
        else{
            console.log("fetched")
            name = "username"
            let username = document.cookie.match(`(?:(?:^|.*; *)${name} *= *([^;]*).*$)|^.*$`)[1]
            setUsername(username)
            setPresent(true)
        }
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
                    <Link to="/hostproject">
                        <Menu.Item
                            name="Host"
                            active={props.type === "host"}
                            onClick={handleItemClick}
                        />
                    </Link>
                        <Link to="/projects">
                        <Menu.Item
                            name="Projects"
                            active={props.type === "projects"}
                            onClick={handleItemClick}
                        />
                        </Link>
                        <Link to="/investments">
                        <Menu.Item
                            name="Previous Investments"
                            active={props.type === "investment"}
                            onClick={handleItemClick}
                        />
                        </Link>
                    <Menu.Menu position="right">
                        <Menu.Item
                            name="video camera"
                        >
                           {connection ? <Icon name="circle" color="green" onClick={connectToWeb3} /> : <Icon name="circle" color="red" onClick={connectToWeb3} />} 
                           { connection ? "Connected" : "Not Connected" }
                        </Menu.Item>
                        <Menu.Item
                            name="video camera"
                        >
                           { present ? username : "XYZ" }
                        </Menu.Item>
                    </Menu.Menu>
                    {/* </Link> */}
                </Menu>
            </Segment>
        </div>
    );
}

export default Navbar;