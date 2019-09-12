import React from 'react'
import {connect} from 'react-redux'
import { Card, Divider, Grid, Tab, } from 'semantic-ui-react'

import fetchFun from '../services/ourBackend'
import ResponsiveContainer from './ResponsiveContainer'
import Loading from './Loading'
import ABunchOfConstants from './ABunchOfConstants'
import WantListMatches from './WantListMatches'
import HaveListMatches from './HaveListMatches'

const USER_HAVE_MATCHES_QUERY = ABunchOfConstants.userHaveMatchesQuery

const jwt = localStorage.jwt

const userConfigObj1 = {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `"Bearer ${jwt}"`
  },
  body: JSON.stringify(USER_HAVE_MATCHES_QUERY)
}

const USER_WANT_MATCHES_QUERY = ABunchOfConstants.userWantMatchesQuery

const userConfigObj2 = {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `"Bearer ${jwt}"`
  },
  body: JSON.stringify(USER_WANT_MATCHES_QUERY)
}

class Matches extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      wantPage: 0,
      havePage: 0,
      loading: true
    }
  }

  cleanUpData = (data) => {
    let listMatches = data.data.users[0].haveListMatches ? data.data.users[0].haveListMatches : data.data.users[0].wantListMatches
    let uniqUser = listMatches.map((match) =>  match.user).filter((obj, position, arr) => {
      return arr.map(mapObj => mapObj.id).indexOf(obj.id) === position;
    })
    let cleanUpdata = uniqUser.map((user) => 
      {return {...user, matches: listMatches.filter((match) => { return match.userId === parseInt(user.id)} )}}
    )
    cleanUpdata.sort((user1, user2) => {
      if (user1.matches.length > user2.matches.length) {
        return (-1)
      }
      else if (user1.matches.length < user2.matches.length) {
        return (1)
      }
      else {
        return (0)
      }
    })
    return cleanUpdata
  }

  componentDidMount() {
    fetchFun.genericNonGetFetch("graphql", userConfigObj1)
    .then((data) => {
        let newData = this.cleanUpData(data)
        this.props.dispatch({
          type: 'FETCH_HAVE_MATCH_DATA',
          haveMatchData: newData
        })
        this.setState({
          loading: false})
      }
    )
    fetchFun.genericNonGetFetch("graphql", userConfigObj2)
    .then((data) => {
        let newData = this.cleanUpData(data)
        this.props.dispatch({
          type: 'FETCH_WANT_MATCH_DATA',
          wantMatchData: newData
        })
      }
    )
  }

  render() {
    const haveListMatchesUsers = this.props.fetchedInfo.haveMatchData ? this.props.fetchedInfo.haveMatchData : []
    const wantListMatchesUsers = this.props.fetchedInfo.wantMatchData ? this.props.fetchedInfo.wantMatchData : []
    
    const haveListMatchesContent = haveListMatchesUsers.length === 0 ? "No matches yet." : haveListMatchesUsers.map((user, userIndex) => {
      return (
        <React.Fragment key={user.id}>
          <Grid.Row >
            <Card>
              <Card.Content>
                <Card.Header>{user.userName} wants the following cards</Card.Header>
                <Card.Meta>Email: {user.email}</Card.Meta>
              </Card.Content>
            </Card>
            <HaveListMatches userIndex={userIndex}/>
          </Grid.Row>
          <Divider
            as='h4'
            className='header'
            horizontal
            style={{ margin: '3em 0em', textTransform: 'uppercase' }}
          >
            (=ΦｴΦ=)
          </Divider>
        </React.Fragment>
      )
    })
    
    const wantListMatchesContent = wantListMatchesUsers.length === 0 ? "No matches yet." : wantListMatchesUsers.map((user, userIndex) => {
      return (
        <React.Fragment key={user.id}>
          <Grid.Row >
            <Card>
              <Card.Content>
                <Card.Header>{user.userName} has the following cards</Card.Header>
                <Card.Meta>Email: {user.email}</Card.Meta>
              </Card.Content>
            </Card>
            <WantListMatches userIndex={userIndex}/>
          </Grid.Row>
          <Divider
            as='h4'
            className='header'
            horizontal
            style={{ margin: '3em 0em', textTransform: 'uppercase' }}
          >
            (=ΦｴΦ=)
          </Divider>
        </React.Fragment>
      )
    })


    const wantHavePanes = [
      { menuItem: 'Have List Matches', render: () => <Tab.Pane>{haveListMatchesContent}</Tab.Pane> },
      { menuItem: 'Want List Matches', render: () => <Tab.Pane>{wantListMatchesContent}</Tab.Pane> }
    ]
    return (
      !this.state.loading ?
        <Grid textAlign='center' style={{ minHeight: '200vh', padding: '3em'}} verticalAlign='middle' celled='internally' columns='equal' stackable id="showcase">
          <Tab menu={{ borderless: true, attached: false, tabular: false }} panes={wantHavePanes} />
        </Grid>
      :
        <ResponsiveContainer verticalAlign='middle' centered>
          <Loading />
        </ResponsiveContainer>
    )
  }
}

const iNeedtheFetchedInfo = (state) => {
  return state
}

const connector = connect(iNeedtheFetchedInfo)
const connectedMatches = connector(Matches)

export default connectedMatches