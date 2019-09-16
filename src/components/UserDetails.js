import React from 'react'
import {connect} from 'react-redux'
import { Button, Card, Form, Grid, Header, Image, Segment, Tab } from 'semantic-ui-react'

import fetchFun from '../services/ourBackend'
import ABunchOfConstants from './ABunchOfConstants'
import ResponsiveContainer from './ResponsiveContainer'
import Loading from './Loading'

const USER_DETAILS_CONFIG_OBJ = ABunchOfConstants.userDetailsConfigObj


// local state for submitting forms
class UserDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {
        full_name: null,
        password: null,
        password_confirmation: null,
        address: null,
        email: null

      }
    }
  }

  componentDidMount() {
    fetchFun.genericNonGetFetch("graphql", USER_DETAILS_CONFIG_OBJ)
    .then((data) => {
        this.props.dispatch({
          type: 'FETCH_USER_DETAILS_DATA',
          userDetailsData: data.data
        })
        this.props.dispatch({type: 'STOP_LOADING'})
      }
    )
    this.props.dispatch({type: 'LOADING'})
  }

  userUpdate = (event) => {
    const user = this.state.user
    const jwt = localStorage.jwt

    const userUpdateConfigObj = {
      method: 'PATCH',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json',
        'Authorization': `"Bearer ${jwt}"`
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

    if (( !user.password && !user.password_confirmation) || user.password === user.password_confirmation) {
      fetchFun.genericNonGetFetch("userupdate", userUpdateConfigObj)
      .then(data => {
        if (data.jwt) {
          alert("Update successfully. Logging you out")
          localStorage.removeItem("jwt")
          window.location.href = "/"
        }
        else {
          alert(data.error)
          window.location.href = "/account"
        }
      })
    }
    else {
      alert("Your second password entry must match the first.")
      window.location.href = "/account"
    }
    
  }

  render() {
    const userDetailsData = this.props.fetchedInfo.userDetailsData
    const accountDetailsComp = (
      <Grid.Row >
        <Card>
          <Card.Content>
            <Card.Header>{userDetailsData ? userDetailsData.users[0].fullName : null}</Card.Header>
            <Card.Meta>Username: {userDetailsData ? userDetailsData.users[0].userName: null}</Card.Meta>
            <br/>
            <Card.Description>
              Email: {userDetailsData ? userDetailsData.users[0].email : null}
            </Card.Description>
            <br/>
            <Card.Description>
              Address: {userDetailsData ? userDetailsData.users[0].address : null}
            </Card.Description>
          </Card.Content>
        </Card>
      </Grid.Row>
    )
    // we check whether if the update fields are empty strings, if they are, they are set to null
    const editUserDetailFormComp = (
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' color='blue' textAlign='center'>
            <Image src='' /> Edit your account information
          </Header>
          <Form size='large'>
            <Segment stacked>
              <Form.Input onChange={(event) => {
                let fullName = event.target.value === "" ? null : event.target.value
                this.setState({user: {...this.state.user, full_name: fullName}})
              }} 
                fluid 
                icon='user plus' 
                iconPosition='left' 
                placeholder='Full Name' 
                name='full_name' 
              />
              <Form.Input onChange={(event) => {
                let password = event.target.value === "" ? null : event.target.value
                this.setState({user: {...this.state.user, password: password}})
              }} 
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                type='password'
                name='password'
              />
              <Form.Input onChange={(event) => {
                let password_con = event.target.value === "" ? null : event.target.value
                this.setState({user: {...this.state.user, password_confirmation: password_con}})
              }} 
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Enter your password again'
                type='password'
                name='password_confirmation'
              />
              <Form.Input onChange={(event) => {
                let address = event.target.value === "" ? null : event.target.value
                this.setState({user: {...this.state.user, address: address}})
              }} 
                fluid
                icon='address book'
                iconPosition='left'
                placeholder='Address'
                name='address'
              />
              <Form.Input onChange={(event) => {
                let email = event.target.value === "" ? null : event.target.value
                this.setState({user: {...this.state.user, email: email}})
              }} 
                fluid
                icon='envelope'
                iconPosition='left'
                placeholder='Email'
                name='email'
              />
    
              <Button onClick={this.userUpdate}color='blue' fluid size='large'>
                Submit Update
              </Button>
            </Segment>
          </Form>
        </Grid.Column>
    )
    const userDetailsPanes = [
      { menuItem: 'Your Account Info', render: () => <Tab.Pane>{accountDetailsComp}</Tab.Pane> },
      { menuItem: 'Edit Account Info', render: () => <Tab.Pane>{editUserDetailFormComp}</Tab.Pane> }
    ]
    return (
      this.props.appcentricState.loading ?
        <ResponsiveContainer verticalAlign='middle' centered>
          <Loading />
        </ResponsiveContainer>
      :
        <Grid style={{ height: '200vh', padding: '3em'}} verticalAlign='middle' stackable centered id="showcase">
            <Tab menu={{ borderless: true, attached: false, tabular: false }} panes={userDetailsPanes} />
        </Grid>
    )
  }
}

const iNeedtheFetchedInfo = (state) => {
  return state
}

const connector = connect(iNeedtheFetchedInfo)
const connectedUserDetails = connector(UserDetails)

export default connectedUserDetails