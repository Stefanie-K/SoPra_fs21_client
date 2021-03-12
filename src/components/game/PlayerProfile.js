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

const FormContainer = styled.div`
  margin-top: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100px;
  justify-content: center;
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
      loading: true
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this)
  }

  handleInputChange(event) {
      this.setState({value: event.target.value});
      console.log("value: "+ event.target.value)
      //DOES THIS CALL COMPONENT DID MOUNT / UDATE?
  }

  handleOnClick(event) {
    if (this.state.editMode == true && this.state.value != null){
      this.state.user.birthdate = this.state.value
      console.log("in on click: set value "+ this.state.value)
      console.log("in on click: get birthdate value "+ this.state.user.birthdate)
      this.updateUser()
      this.setState({})

    } else {
      this.setState({
        editMode: true
      })
    }
  }

  async redirects() {
    //redirects
    this.setState({ redirect: "/game" });
    console.log("REDIRECTING")
  }

  async updateUser() {
    try {
      console.log("tries to update User");
      console.log("in update user get birthdate value: "+ this.state.user.birthdate);
      const requestBody = JSON.stringify({ //Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
        id: this.state.user.id, //Mabe also id
        username: this.state.user.username,
        birthdate: this.state.user.birthdate
      });
      console.log("before PUT");
      var a = this.state.userID
      const response = await api.put('/users/'+ a, requestBody);
      console.log("after PUT of user "+ a + requestBody);
      this.setState({})

    } catch (error) {
      //var uID = this.user.userID
      alert(`Something went wrong in component did update: \n${handleError(error)}`);
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
      return(<Label>...</Label>)
    } else {
      //birthDateField
      let birthDateField;
      if (this.state.editMode) {
        birthDateField = <InputField
            type="text"
            value={this.state.value} onChange={this.handleInputChange}
            placeholder="dd.mm.yyyy"/>
      } else {
        birthDateField = <Label2>{this.state.user.birthdate}</Label2>
      }
      //if user is looking at his own profile
      if (localStorage.getItem('token') == (this.state.user.token) && this.state.user.birthdate == null) {
        //if user has not set birthdate yet
        console.log("user has not set birthdate yet: "+ this.state.user.birthdate)
        if (this.state.user.birthdate == null) {
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
                    {birthDateField}
                    <Button
                        width="50%"
                        onClick={this.handleOnClick}
                    >{this.state.editMode ? 'Submit' : 'Add birth date'}</Button>
                  </Form>
                </FormContainer>
                <Label>...</Label>
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
        //if user has already set birthdate
        if (localStorage.getItem('token') == (this.state.user.token) && this.state.user.birthdate != null) {
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
                    <Button
                        width="50%"
                        //onClick={this.handleOnClick}
                    >EDIT</Button>
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
