import React, { useState, useEffect } from "react";
import {
    Header,
    Segment,
    Input,
    Button,
    Form,
    Card,
    Icon,
    Image,
    Statistic,
    Pagination,
    Grid,
    Menu,
    Sidebar,
    Divider,
} from "semantic-ui-react";
import { Redirect } from "react-router-dom";
import Navbar from './components/navbar'
import { getWeb3 } from "../getWeb3";
import map from "../artifacts/deployments/map.json";
import Web3 from 'web3'


function Payment(props) {

    const [webInfo, setWebInfo] = useState({})
    const [project, setProject] = useState({})
    const [amountFunded, setAmountFunded] = useState(-1)
    const [amount, setAmount] = useState(0);
    const [present, setPresent] = useState(false)
    const [crowd,setCrowd] = useState({})


    const getData = (data) => {
        setWebInfo(data)
        loadInitialContracts(data)
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

        console.log(project.project_id)
        var id = parseInt(project.project_id)

        var am = await CrowdFunding.methods.getProjectAmount(id, data.accounts[0]).call()
        console.log(am)
        setAmountFunded(Web3.utils.fromWei(am,"ether"))
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


    const pay = async() => {
        var id = parseInt(project.project_id)
        const CrowdFunding = crowd;
        const accounts = webInfo.accounts[0]
        console.log(amount)
        await CrowdFunding.methods.pay(project.project_id, accounts).send({from: accounts, value: Web3.utils.toWei(amount,"ether")}).on('receipt', async () => {
            var am = await CrowdFunding.methods.getProjectAmount(project.project_id, accounts).call()
            console.log(am)
            setAmountFunded(Web3.utils.fromWei(am,"ether"))
        })
    }

    const handleChange = (e) =>{
        setAmount(e.target.value)
    }

    useEffect(() => {
        var id = "10";
        var id = props.location.state.id
        console.log(id)
        var url = "http://localhost:5000/api/getproject/" + id;
        try {
            fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            setProject(data.rows)
            setPresent(true)
        })
        } catch (error) {
            console.log(error)
        }
        
    },[])

    return (
        <div>
            {present &&
            <div>
            <Navbar parentCallBack={getData}/>

            
                <div>
                    <Header as="h1">Products</Header>
                    <div class="content">
                        <Segment padded>
                            <Header as="h3" dividing>
                                Product
                            </Header>
                            <Form>
                                <Form.Field>
                                    <Input
                                        action={{ icon: "search" }}
                                        placeholder="Search..."
                                        // value={search}
                                        // onChange={(e) =>
                                        //     setSearch(e.target.value)
                                        // }
                                        fluid
                                    />
                                </Form.Field>
                            </Form>
                            <br />
                                <div>
                                    <Grid stackable columns={2}>
                                        <Grid.Column>
                                            <Image
                                                src={
                                                    "http://localhost:5000/api/uploads/" +
                                                    project.image
                                                }
                                                size="big"
                                                bordered
                                            />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Header as="h1">
                                                {project.project_name}
                                            </Header>
                                            <Header as="h3">
                                                Date: 27-12-2019
                                            </Header>
                                            <br />
                                            <b>{amountFunded} Ether Funded</b>
                                            <br />
                                            <br />
                                            <Form>
                                                <Form.Group inline>
                                                    <Form.Field>
                                                        <label>Amount</label>
                                                        <input
                                                            placeholder="0"
                                                            type="number"
                                                            onChange={
                                                                handleChange
                                                            }
                                                            value={amount}
                                                            required
                                                        />
                                                    </Form.Field>
                                                </Form.Group>
                                            </Form>
                                            <br />
                                            <Button
                                                fluid
                                                color="brown"
                                                onClick={pay}
                                            >
                                                Pay
                                            </Button>
                                        </Grid.Column>
                                    </Grid>
                                    <Header as="h3" fluid>
                                        Product Specifications
                                    </Header>
                                    <Grid stackable columns={2}>
                                        <Grid.Column>
                                            {project.descriptions}
                                        </Grid.Column>
                                    </Grid>
                                </div>
                        </Segment>
                        <br />
                        <br />
                        <br />
                        <br />
                    </div>
                </div>
            </div>
            }
        </div>
    );
}

export default Payment;