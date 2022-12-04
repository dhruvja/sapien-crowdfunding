import React,{useState} from 'react'
import Navbar from './components/navbar'
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
    Card,
    Table
} from "semantic-ui-react";
import map from "../artifacts/deployments/map.json";
import { getEthereum } from "../getEthereum";
import { getWeb3 } from "../getWeb3";
import web3 from "web3";
import {Link, Redirect} from 'react-router-dom'
import Web3 from 'web3';

function Investments() {

    const [webInfo, setWebInfo] = useState({})
    const [crowd, setCrowd] = useState({})
    const [present, setPresent] = useState(false)
    const [txData, setTxData] = useState([])

    const getData = (child) =>{
        setWebInfo(child)
        loadInitialContracts(child)
    }

    const loadInitialContracts = async (data) => {
        // <=42 to exclude Kovan, <42 to include kovan
        console.log(data.chainId);

        var _chainID = 0;
        if (data.chainId === 42) {
            _chainID = 42;
        }
        if (data.chainId === 1337) {
            _chainID = "dev";
        }
        console.log(_chainID);
        const CrowdFunding = await loadContract(
            _chainID,
            "CrowdFunding"
        );
        setCrowd(CrowdFunding)

        console.log(CrowdFunding)

        if (!CrowdFunding) {
            return;
        }

        // console.log(project.project_id)
        // var id = parseInt(project.project_id)

        var am = await CrowdFunding.methods.getPreviousInvestments().call({from: data.accounts[0]})
        console.log(am)
        setTxData(am)
        setPresent(true)
    };

    const loadContract = async (chain, contractName) => {
        // Load a deployed contract instance into a web3 contract object
        // const { web3 } = this.state;

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
                `../artifacts/deployments/${chain}/${address}.json`
            );
            console.log(contractArtifact)
        } catch (e) {
            console.log(
                `Failed to load contract artifact "../artifacts/deployments/${chain}/${address}.json"`
            );
            return undefined;
        }
        const sweb3 = await getWeb3()
        return new sweb3.eth.Contract(contractArtifact.abi, address);
    };


    return (
        <div>
            <Navbar parentCallBack={getData} type="investment" />
            <div>
                <br />
                <Header as="h1">
                    Previous Investments
                </Header>
                <div className="content">
                <Segment>
                    <Header as="h3" dividing>
                        Transaction history
                    </Header>
                    <Table celled selectable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Project Id</Table.HeaderCell>
                                <Table.HeaderCell>Amount</Table.HeaderCell>
                                <Table.HeaderCell>To</Table.HeaderCell>
                                <Table.HeaderCell>View</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        {
                            present && txData.map((each) => {
                                return (
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell>{each.id}</Table.Cell>
                                            <Table.Cell>{Web3.utils.fromWei(each.amount, "ether")} Ether</Table.Cell>
                                            <Table.Cell>{each.to}</Table.Cell>
                                            <Link to={{pathname: "/payment", state: {id: each.id} }}><Table.Cell>View</Table.Cell></Link>
                                        </Table.Row>
                                    </Table.Body>
                                )
                            })
                            
                        }
                       
                    </Table>
                </Segment>
                </div>
            </div>
        </div>
    )
}

export default Investments
