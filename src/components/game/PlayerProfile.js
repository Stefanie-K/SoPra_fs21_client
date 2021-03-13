import React from 'react';
import styled from 'styled-components';
import {BaseContainer, DESKTOP_WIDTH} from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import Player from '../../views/Player';
import { Spinner } from '../../views/design/Spinner';
import { Button, PlayerButton } from '../../views/design/Button';
import {Redirect, withRouter} from 'react-router-dom';

import { useEffect } from "react";
import { useLocation } from "react-router-dom";


export const ButtonBack = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  justifyContent: 'center',
  alignSelf: 'center',
  padding: 60px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 13px;
  text-align: center;
  color: rgba(233, 255, 255, 1);
  width: ${props => props.width || null};
  height: 35px;
  border: none;
  border-radius: 20px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: rgb(16, 89, 255);
  transition: all 0.3s ease;
`;

export const ButtonEdit = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  justifyContent: 'right',
  alignSelf: 'right',
  padding: 60px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 13px;
  text-align: center;
  color: rgba(245,245,245, 1);
  width: ${props => props.width || null};
  height: 35px;
  border: none;
  border-radius: 20px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: rgb(169,169,169);
  transition: all 0.3s ease;
  margin-bottom: 10px;
  float: right;
  position: right: 0;
  `;


const Label = styled.label`
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const FormContainer = styled.div`
  margin-top: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100px;
  justify-content: center;
`;

const Column = styled.div`
  margin-top: 1em;
  display: flex;
  flex-direction: column;
  min-height: 5px;
`;

const FormContainerButton = styled.div`
  margin-top: 8em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const InputField = styled.input`
  &::placeholder {
    color: rgba(255, 255, 255, 1.0);
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  width: 50%;
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
  height: 450px;
  font-size: 16px;
  font-weight: 300;
  padding-top: 37px;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

class PlayerProfile extends React.Component {
  constructor() {
    console.log("IN PLAYERPROFILE CONSTRUCTOR")
    super();
    this.state = {
      redirect: null,
      user: null,
      userID: null,
      editMode: null,
      value: null,
      changedUsername: null,
      loading: true
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this)
    this.handleUsernameChange = this.handleUsernameChange.bind(this)
  }

  handleInputChange(event) {
      this.setState({value: event.target.value});
      console.log("value: "+ event.target.value)
      //DOES THIS CALL COMPONENT DID MOUNT / UDATE?
  }

  handleUsernameChange(event) {
    this.setState({changedUsername: event.target.value});
    console.log("changedUsername: "+ event.target.value)
    //DOES THIS CALL COMPONENT DID MOUNT / UDATE?
  }

  handleOnClick(event) {
    if (this.state.editMode == true && this.state.value != null){
      this.state.user.birthdate = this.state.value
      console.log("handle on click username: "+ this.state.changedUsername)
      if (this.state.changedUsername != null){
        this.state.user.username = this.state.changedUsername
      }
      console.log("in on click: set value "+ this.state.value, this.state.changedUsername)
      console.log("in on click: get birthdate / username value "+ this.state.user.birthdate, this.state.changedUsername)
      this.updateUser()
      this.setState({})
    }
    this.setState({
        editMode: !this.state.editMode
      })
  }

  async redirects() {
    //redirects
    this.setState({ redirect: "/game" });
    console.log("REDIRECTING") //test for heroku
  }

  async updateUser() {
    try {
      console.log("tries to update User");
      console.log("in update user get birthdate value: "+ this.state.user.birthdate);
      console.log("in update user get username value: "+ this.state.user.username);
      console.log("in update user get id value: "+ this.state.user.id);
      const requestBody = JSON.stringify({ //Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
        userID: this.state.user.id,
        username: this.state.user.username,
        birthdate: this.state.user.birthdate
      });
      console.log("before PUT");
      const response = await api.put('/user', requestBody);
      console.log("after PUT of user "+ requestBody);
      this.setState({})

    } catch (error) {
      //var uID = this.user.userID
      alert(`Something went wrong in component did update: '\n${handleError(error)}`);
    }
  }


  async componentDidMount() {
    try {
      console.log("IN PLAYERPROFILE COMPONENT DID MOUNT")

      var a = this.state.userID
      const response = await api.get('/users/'+ a);


      // Get the returned users and update the state.
      this.setState({
        user: response.data,
        loading: false
      });

      // This is just some data for you to see what is available.
      // Feel free to remove it.
      console.log('request to:', response.request.responseURL);
      console.log('status code:', response.status);
      console.log('status text:', response.statusText);
      console.log('requested data:', response.data);

      // See here to get more data.
      console.log(response);
    } catch (error) {
      //var uID = this.user.userID
      alert(`Something went wrong while fetching the users with userID X: \n${handleError(error)}`);
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    //setting the user data
    //this.state.user = this.props.location.state.user;//this.props.user
    console.log("Render")
    this.state.userID = this.props.location.state.userID;

    if (this.state.loading == true) {
      return(<Label></Label>)
    } else {
      //birthDateField
      let birthDateField;
      let changeUsernameField;
      if (this.state.editMode) {
        birthDateField = <InputField
            type="text"
            value={this.state.value} onChange={this.handleInputChange}
            placeholder="dd.mm.yyyy"/>
        changeUsernameField= <InputField
            type="text"
            value={this.state.changedUsername} onChange={this.handleUsernameChange}
            placeholder={this.state.user.username}/>
      } else {
        birthDateField = <Label2>{this.state.user.birthdate}</Label2>
        changeUsernameField = <Label2>{this.state.user.username}</Label2>
      }
      //if user is looking at his own profile
      if (localStorage.getItem('token') == (this.state.user.token)) {
        //if user has not set birthdate yet
        //if (this.state.user.birthdate == null) {
          return (
              <BaseContainer>
                <FormContainer>
                  <Form>
                    <Column>
                    <Label>Username</Label>
                    {changeUsernameField}
                    <Label>Online Status</Label>
                    <Label2>{this.state.user.status}</Label2>
                    <Label>Creation Date</Label>
                    <Label2>{this.state.user.dateCreated}</Label2>
                    <Label>Birth Date</Label>
                    {birthDateField}
                    </Column>
                    <Column style={{ justifyContent: 'center', alignItems: 'right', flexDirection: 'row', flex: 1}}>
                      <ButtonEdit
                          class="right"
                          width="25%"
                          onClick={this.handleOnClick}
                      >{this.state.editMode ? 'Submit' : 'EDIT'}</ButtonEdit>
                    </Column>
                  </Form>
                </FormContainer>
                <FormContainerButton>
                  <ButtonBack
                    width="25%"
                    onClick={() => {
                    this.redirects();
                  }}
                >GO BACK</ButtonBack>
                </FormContainerButton>
              </BaseContainer>
          );
        }
      //if user is looking at somebody else's profile
      return (
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
            <FormContainerButton>
              <ButtonBack
                  width="25%"
                  onClick={() => {
                    this.redirects();
                  }}
              >GO BACK</ButtonBack>
            </FormContainerButton>
          </BaseContainer>
      );
    }
  }
}
//add comment for testing git

export default withRouter(PlayerProfile);
