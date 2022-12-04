import React, { useState , useEffect} from "react";
import Navbar from "./components/navbar";
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
import map from "../artifacts/deployments/map.json";
import { getEthereum } from "../getEthereum";
import { getWeb3 } from "../getWeb3";
import web3 from "web3";




function HostProject() {
    const [webInfo, setWebInfo] = useState({});
    const [hosted, setHosted] = useState(false)
    const [amount, setAmount] = useState(0)
    const [crowd,setCrowd] = useState({})
    const [fund, setFund] = useState(false)
    const [loading, setLoading] = useState(false)
    const [details, setDetails] = useState({
        project_name: "",
        description: "",
        image: null
    })
    const [image, setImage] = useState(null)

    const getData = (data) => {
        setWebInfo(data)
        console.log(data)
        loadInitialContracts(data)
    };

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

        // await CrowdFunding.methods.hostProject(1).send({from: data.accounts[0]}).on('receipt', async () => {
        //     setHosted(true)
        // })
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

    const handleChange = (e) => {
        setDetails({
            ...details,
            [e.target.name]: e.target.value
        })
    }

    const submit = async() => {  
        setLoading(true)
        const formData = new FormData()
        console.log(details.image)
        formData.append("image", details.image)
        formData.append("project_name", details.project_name)
        formData.append("description",details.description)
        formData.append("address",webInfo.accounts[0])
        console.log(formData)
        fetch('http://localhost:5000/api/hostproject',{
            method: 'POST',
            body: formData
        }).then(res => res.json())
        .then(data => {
            if(data.success){
                var id = parseInt(data.id)
                var data = webInfo
                const CrowdFunding = crowd;
                fundSolidity(id)
            }
        })
    }

    const imageInput = (e) => {
        setDetails({
            ...details,
            image: e.target.files[0]
        })
    }

    const fundSolidity = async (id) => {
        id = parseInt(id)
        const CrowdFunding = crowd;
        const accounts = webInfo.accounts[0]
        await CrowdFunding.methods.hostProject(id).send({from: accounts}).on('receipt', async () => {
            setHosted(true)
            setLoading(false)
        })
    };


    return (
        <div>
            <Navbar parentCallBack={getData} type="host" />
            <Header as="h1">Host Your Project</Header>
            <div className="content">
                <Segment>
                    <Header as="h3" dividing>
                        Enter the details
                    </Header>
                    <Form>
                        <Form.Input
                            fluid
                            label="Project Name"
                            placeholder="Project Name ..."
                            name="project_name"
                            onChange={handleChange}
                        />
                        <Form.TextArea
                            label="Description"
                            placeholder="Tell us more about the project..."
                            name="description"
                            onChange={handleChange}
                        />
                        <Button as="label" htmlFor="file" type="button" primary icon labelPosition='right'>
                            Upload Image
                            <Icon name='upload' />
                        </Button>
                        <input type="file" id="file" hidden onChange={imageInput}  /><br /><br />
                        { loading ? <Button secondary onClick={submit} loading>Host Project</Button>  :<Button secondary onClick={submit}>Host Project</Button>  }  
                        {hosted ? "Project Hosted successfully" : "Project has not been hosted"}                
                    </Form>             
                </Segment>
            </div>
        </div>
    );
}

export default HostProject;
