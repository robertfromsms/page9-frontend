import React from 'react'
import {connect} from 'react-redux'
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react'

import fetchFun from '../services/ourBackend'
import ResponsiveContainer from './ResponsiveContainer'
import Loading from './Loading'

class NewUserForm extends React.Component {
  
  // local state for submitting forms
  constructor(){
    super()
    this.state = {
      user: {
        user_name: null,
        full_name: null,
        password: null,
        password_confirmation: null,
        address: null,
        email: null

      }
    }
  }

  componentDidMount() {
    this.props.dispatch({type: 'STOP_LOADING'})
  }

  userSignup = (event) => {
    let user = this.state.user

    const signupConfigObj = {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        "user": {
         "user_name": user.user_name,
         "full_name": user.full_name,
         "password": user.password,
         "password_confirmation": user.password_confirmation,
         "address": user.address,
         "email": user.email
        }
      })
    }

    if (!user.user_name || !user.full_name || !user.password || !user.password_confirmation || !user.address || !user.email) {
      alert("You must fill out all the fields")
      return
    }

    if (user.password === user.password_confirmation) {
      fetchFun.genericNonGetFetch("users", signupConfigObj)
      .then(data => {
        if (data.jwt) {
          const jwt = data.jwt
          localStorage.setItem("jwt", jwt)
          window.location.href = "/profile"
        }
        else {
          alert(data.error)
          window.location.href = "/signup"
        }
      })

      this.props.dispatch({type: 'LOADING'})
    }
    else {
      alert("Your second password entry must match the first.")
      window.location.href = "/signup"
    }  
  }

  render() {
    return (
      this.props.appcentricState.loading ?
        <ResponsiveContainer verticalAlign='middle' centered>
          <Loading />
        </ResponsiveContainer>
      :
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle' id="showcase">
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' color='blue' textAlign='center'>
              Create a new account
            </Header>
            <Form size='large'>
              <Segment stacked>
                <Form.Input onChange={(event) => {
                  this.setState({user: {...this.state.user, user_name: event.target.value}})
                }} 
                  fluid 
                  icon='user' 
                  iconPosition='left' 
                  placeholder='Username' 
                  name='user_name' 
                />
                <Form.Input onChange={(event) => {
                  this.setState({user: {...this.state.user, full_name: event.target.value}})
                }} 
                  fluid 
                  icon='user plus' 
                  iconPosition='left' 
                  placeholder='Full Name' 
                  name='full_name' 
                />
                <Form.Input onChange={(event) => {
                  this.setState({user: {...this.state.user, password: event.target.value}})
                }} 
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  type='password'
                  name='password'
                />
                <Form.Input onChange={(event) => {
                  this.setState({user: {...this.state.user, password_confirmation: event.target.value}})
                }} 
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Enter your password again'
                  type='password'
                  name='password_confirmation'
                />
                <Form.Input onChange={(event) => {
                  this.setState({user: {...this.state.user, address: event.target.value}})
                }} 
                  fluid
                  icon='address book'
                  iconPosition='left'
                  placeholder='Address'
                  name='address'
                />
                <Form.Input onChange={(event) => {
                  this.setState({user: {...this.state.user, email: event.target.value}})
                }} 
                  fluid
                  icon='envelope'
                  iconPosition='left'
                  placeholder='Email'
                  name='email'
                />
      
                <Button onClick={this.userSignup}color='blue' fluid size='large'>
                  Create New User
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
    )
  }
}

const iNeedtheFetchedInfo = (state) => {
  return state
}

const connector = connect(iNeedtheFetchedInfo)
const connectedNewUserForm = connector(NewUserForm)

export default connectedNewUserForm