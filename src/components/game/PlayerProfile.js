import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import Player from '../../views/Player';
import { Spinner } from '../../views/design/Spinner';
import { Button, PlayerButton } from '../../views/design/Button';
import {Redirect, withRouter} from 'react-router-dom';

import { useEffect } from "react";
import { useLocation } from "react-router-dom";


const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const Label2 = styled.label`
  color: pink;
  margin-bottom: 10px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60%;
  height: 375px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const Users = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const PlayerContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SecondPage = props => {
  const location = useLocation();

  useEffect(() => {
    console.log(location.pathname); // result: '/secondpage'
    console.log(location.search); // result: '?query=abc'
    console.log(location.state.detail); // result: 'some_value'
  }, [location]);

};

class PlayerProfile extends React.Component {
  constructor() {
    console.log("IN PLAYERPROFILE CONSTRUCTOR")
    super();
    this.state = {
      redirect: null,
      user: null
    };
  }

  async redirects() {
    //redirects
    this.setState({ redirect: "/login" });
    console.log("REDIRECTING")
  }



  async componentDidMount() {
    try {
      console.log("IN PLAYERPROFILE COMPONENT DID MOUNT")

      const response = await api.get('/users');
      // delays continuous execution of an async operation for 1 second.
      // This is just a fake async call, so that the spinner can be displayed
      // feel free to remove it :)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get the returned users and update the state.
      this.setState({ users: response.data });

      // This is just some data for you to see what is available.
      // Feel free to remove it.
      console.log('request to:', response.request.responseURL);
      console.log('status code:', response.status);
      console.log('status text:', response.statusText);
      console.log('requested data:', response.data);

      // See here to get more data.
      console.log(response);
    } catch (error) {
      alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
    }
  }


  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    console.log("IN PLAYERPROFILE RENDER")
    this.state.user = this.props.location.state.user
    return(
        <BaseContainer>
          <FormContainer>
            <Form>
              <Label>Username</Label>
              <Label2>{this.state.user.username}</Label2>
              <Label>Online Status</Label>
              <Label2>{this.state.user.status}</Label2>
              <Label>Creation Date</Label>
              <Label2>{this.state.user.dateCreated}</Label2>
              <Label>Birth Date</Label>
              <Label2>{this.state.user.birthdate}</Label2>
            </Form>
          </FormContainer>
        </BaseContainer>
    );
  }
}

export default withRouter(PlayerProfile);
