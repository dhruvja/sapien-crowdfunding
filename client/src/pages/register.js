import React, { useState , useEffect} from "react";
import Startbar from "./components/startbar";
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
    Message
} from "semantic-ui-react";
import map from "../artifacts/deployments/map.json";
import { getEthereum } from "../getEthereum";
import { getWeb3 } from "../getWeb3";
import web3 from "web3";
import {Redirect} from 'react-router-dom'


function Register() {

    const [webInfo, setWebInfo] = useState({})
    const [value, setValue] = useState("")
    const [details, setDetails] = useState({
        username: "",
        account_no: "",
        type: ""
    })
    const [redirect, setRedirect] = useState(false)

    const getData = () => {

    }

    const handleRadioChange = (e,{value}) => {
        console.log(value)
        setDetails({
            ...details,
            type: value
        })
    }

    const handleSubmit = (e) => {
        setRedirect(true)
        fetch('http://localhost:5000/api/register',{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(details)
        }).then(res => res.json())
        .then(data => {
            setRedirect(true)
        })
    }

    return (
        <div>
            <Startbar parentCallBack={getData} />
            {redirect && <Redirect push to="/projects"></Redirect>}
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
    <Grid.Column style={{ maxWidth: 450 }}>
      <Header as='h1' textAlign='center'>
        Register
      </Header>
      <Form size='large'>
        <Segment stacked>
          <Form.Input fluid icon='user' iconPosition='left' placeholder='Username...' onChange={(e) => setDetails({...details, username: e.target.value})} />
          <Form.Group inline>
            <label>Type</label>
            <Form.Radio
                label='Fund Raiser'
                value='fundraiser'
                checked={value === 'fundraiser'}
                onChange={handleRadioChange}
            />
            <Form.Radio
                label='Investor'
                value='investor'
                checked={value === 'investor'}
                onChange={handleRadioChange}
            />
          </Form.Group>

          <Button color='teal' fluid size='large' onClick={handleSubmit}>
            Register
          </Button>
        </Segment>
      </Form>
    </Grid.Column>
  </Grid>
        </div>
    )
}

export default Register
