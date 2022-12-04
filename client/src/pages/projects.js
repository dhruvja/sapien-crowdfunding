import React,{useEffect, useState} from 'react'
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
    Card
} from "semantic-ui-react";
import map from "../artifacts/deployments/map.json";
import { getEthereum } from "../getEthereum";
import { getWeb3 } from "../getWeb3";
import web3 from "web3";
import {Link, Redirect} from 'react-router-dom'

function Projects() {

    const [webInfo, setWebInfo] = useState({})
    const [projects, setProjects] = useState([])
    const [present, setPresent] = useState(false)
    const [redirect,setRedirect] = useState(false)

    const getData = (child) => {
        setWebInfo(child)
    }

    useEffect(()=>{
        fetch('http://localhost:5000/api/getallprojects')
        .then(res => res.json())
        .then(data => {
            console.log(data)
            setProjects(data.rows)
            setPresent(true)
        })
    },[])




    return (
        <div>
        {/* {redirect && <Redirect to="/payment" ></Redirect> } */}
            <Navbar parentCallBack={getData} type="projects" />
            
            <Header as="h1">
                Projects
            </Header>
            <div className="content">
                <Segment>
                    <Header as="h3" dividing>
                        All the Projects
                    </Header>
                    <Grid columns={3}>
                    {
                        present && projects.map((project) => {
                            return (
                                
                                <Grid.Column >
                                <Link to={{
                                    pathname: "/payment",
                                    state: {id: project.project_id}
                                }} >
                                    <Card raised >
                                        <Image src={"http://localhost:5000/api/uploads/" + project.image} wrapped ui={false} />
                                        <Card.Content>
                                        <Card.Header>{project.project_name}</Card.Header>
                                        <Card.Meta>{project.created_date}</Card.Meta>
                                        <Card.Description>
                                            {project.descriptions}
                                        </Card.Description>
                                        </Card.Content>
                                        <Card.Content extra >
                                        <a>
                                            <Icon name='user' />
                                            {project.username}
                                        </a>
                                        </Card.Content>
                                    </Card>
                                    </Link>
                                </Grid.Column>
                                
                            )
                        })
                    }
                        
                    </Grid>
                </Segment>
            </div>
            
        </div>
    )
}

export default Projects
