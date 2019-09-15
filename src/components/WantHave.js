import React from 'react'
import {connect} from 'react-redux'
import { Button, Form, Grid, Header, Label, Select, Tab, Table } from 'semantic-ui-react'

import fetchFun from '../services/ourBackend'
import ResponsiveContainer from './ResponsiveContainer'
import Loading from './Loading'
import ModalModal from './Modal'
import ABunchOfConstants from './ABunchOfConstants'
import WantListTableRow from './WantListTableRow'
import HaveListTableRow from './HaveListTableRow'
import AddToHave from './AddToHave'
import AddToWant from './AddToWant'

const USER_CONFIG_OBJ = ABunchOfConstants.userConfigObj
let setNameOptions = ABunchOfConstants.setNameOptions
let foilNormalOptions = ABunchOfConstants.foilNormalOptions
let conditionOptions = ABunchOfConstants.conditionOptions
const jwt = localStorage.jwt

class WantHave extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      wantPage: 0,
      havePage: 0
    }
  }

  componentDidMount() {
    fetchFun.genericNonGetFetch("graphql", USER_CONFIG_OBJ)
    .then((data) => {
        this.props.dispatch({
          type: 'FETCH_WANTHAVE_DATA',
          wantHaveData: data.data
        })
    this.props.dispatch({type: 'STOP_LOADING'})
      }
    )
    this.props.dispatch({type: 'LOADING'})
  }

  handleNextWantPage = (event) => {
    let nextWantPageCount = (this.state.wantPage+1)*20 > this.props.fetchedInfo.wantHaveData.users[0].wantList.length ? 0 : this.state.wantPage+1
    this.setState({wantPage: nextWantPageCount})
  }

  handleNextHavePage = (event) => {
    let nextHavePageCount = (this.state.havePage+1)*20 > this.props.fetchedInfo.wantHaveData.users[0].haveList.length ? 0 : this.state.havePage+1
    this.setState({havePage: nextHavePageCount})
  }

  render() {
    const wantList = this.props.fetchedInfo.wantHaveData ? this.props.fetchedInfo.wantHaveData.users[0].wantList : []
    let currentWantStarting = this.state.wantPage*20
    let wantListSubset = wantList.slice(currentWantStarting, currentWantStarting + 20)
    let wantListComponents = (
      <Grid textAlign='center' columns='equal'>
        <Grid.Column style={{ paddingBottom: '2em'}}>
          <Table celled textAlign='center'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell >Card Name</Table.HeaderCell>
                <Table.HeaderCell>Item Info</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {wantList.length === 0 ? "No cards yet, add some!" : wantListSubset.map( (item) => {
                return (
                  <WantListTableRow item={item} key={item.id}/>
                )})
              }
            </Table.Body>
          </Table>
        </Grid.Column>
        <Grid.Row>
          <Grid.Column>
            <Button onClick={this.handleNextWantPage}>More Want List Items</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
    const haveList = this.props.fetchedInfo.wantHaveData ? this.props.fetchedInfo.wantHaveData.users[0].haveList : []
    let currentHaveStarting = this.state.havePage*20
    let haveListSubset = haveList.slice(currentHaveStarting, currentHaveStarting + 20)
    let haveListComponents = (
      <Grid textAlign='center' columns='equal'>
        <Grid.Column style={{ paddingBottom: '2em'}}>
          <Table celled textAlign='center'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Card Name</Table.HeaderCell>
                <Table.HeaderCell>Item Info</Table.HeaderCell>
                <Table.HeaderCell>Price</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {wantList.length === 0 ? "No cards yet, add some!" : haveListSubset.map( (item) => {
                return (
                  <HaveListTableRow item={item} key={item.id}/>
                )})
              }
            </Table.Body>
          </Table>
        </Grid.Column>
        <Grid.Row>
          <Grid.Column>
            <Button onClick={this.handleNextHavePage}>More Have List Items</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
    const addToHaveComponent = <AddToHave />
    const addToWantComponent = <AddToWant />
    const wantHavePanes = [
      { menuItem: 'Want List', render: () => <Tab.Pane>{wantListComponents}</Tab.Pane> },
      { menuItem: 'Have List', render: () => <Tab.Pane>{haveListComponents}</Tab.Pane> },
      { menuItem: 'Add a Card to Your Want List', render: () => <Tab.Pane>{addToWantComponent}</Tab.Pane> },
      { menuItem: 'Add a Card to Your Have List', render: () => <Tab.Pane>{addToHaveComponent}</Tab.Pane> }
    ]

    return (
      this.props.appcentricState.loading ?
        <ResponsiveContainer verticalAlign='middle' centered>
          <Loading />
        </ResponsiveContainer>
      :
        <Grid textAlign='center' style={{ minHeight: '200vh', padding: '3em'}} verticalAlign='middle' celled='internally' stackable id="showcase">
          <Tab menu={{ borderless: true, attached: false, tabular: false }} panes={wantHavePanes} />
        </Grid>
    )
  }
}

const iNeedtheFetchedInfo = (state) => {
  return state
}

const connector = connect(iNeedtheFetchedInfo)
const connectedWantHave = connector(WantHave)

export default connectedWantHave