import React from 'react'
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import fetchFun from '../services/ourBackend'

class LoginForm extends React.Component {
  constructor(){
    super()
    this.state = {
      user: {
        user_name: "",
        password: ""
      }
    }
  }

  userLogin = (event) => {
    const loginConfigObj = {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        "user": {
          "user_name": this.state.user.user_name,
          "password": this.state.user.password
        }
      })
    }

    fetchFun.genericNonGetFetch("login", loginConfigObj)
    .then(data => {
      console.log(data)
      return data
    })
    .then(data => {
      if (data.jwt) {
        const jwt = data.jwt
        localStorage.setItem("jwt", jwt)
        window.location.href = "/profile"
      }
      else {
        alert(data.error)
        window.location.href = "/login"
      }
    })
  }

  render() {
    return (

      <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle' id="showcase">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' color='blue' textAlign='center'>
            Log in to your account
          </Header>
          <Form size='large'>
            <Segment stacked>
              <Form.Input onChange={(event) => {
                this.setState({user: {...this.state.user, user_name: event.target.value}})
              }} fluid icon='user' iconPosition='left' placeholder='Username' name='user_name' />
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
    
              <Button onClick={this.userLogin}color='blue' fluid size='large'>
                Login
              </Button>
            </Segment>
          </Form>
          <Link to='/signup'>
            <button 
              type="button"
              className="link-button" 
              >Don't have an account? Click here to sign up
            </button>
          </Link>
        </Grid.Column>
      </Grid>

    )
  }
}

export default LoginForm