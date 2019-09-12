import React from 'react'
import {connect} from 'react-redux'
import {
  Grid,
  Header,
  Segment,
} from 'semantic-ui-react'

import ResponsiveContainer from './ResponsiveContainer'
import Loading from './Loading'
import ExchangesInitiatedByOthers from './ExchangesInitiatedByOthers'
import CurrentExchangesAsBuyer from './CurrentExchangesAsBuyer'
import PastExchanges from './PastExchanges'
import fetchFun from '../services/ourBackend'
import ABunchOfConstants from './ABunchOfConstants'

let USER_EXCHANGES_QUERY = ABunchOfConstants.userExchangesQuery

const jwt = localStorage.jwt

const userConfigObj = {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${jwt}`
  },
  body: JSON.stringify(USER_EXCHANGES_QUERY)
}

class UserProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      buyerExchange: [],
      buyerPage: 0,
      pastExchange: [],
      pastPage: 0,
      loading: true
    }
  }

  componentDidMount() {
    fetchFun.genericNonGetFetch("graphql", userConfigObj)
    .then((jso) => {
        this.props.dispatch({
          type: 'FETCH_EXCHANGES_DATA',
          exchangesData: jso.data
        })
        this.setState({loading: false})
      }
    )
  }

  render() {
    return (
      !this.state.loading ?
        <ResponsiveContainer>
          <Segment style={{ padding: '0em' }} vertical>
            <Grid>
              <Grid.Row textAlign='center'>
                <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                  <Header as='h1' style={{ fontSize: '2em' }}>
                    Greetings, {this.props.fetchedInfo.exchangesData.users[0].fullName}! <br/>
                    You can view your current and past exchanges here.
                  </Header>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
          <ExchangesInitiatedByOthers/>
          <CurrentExchangesAsBuyer/>
          <PastExchanges/>
        </ResponsiveContainer>
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
const connectedUserProfile = connector(UserProfile)

export default connectedUserProfile