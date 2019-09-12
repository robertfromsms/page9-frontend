import React from 'react'
import {connect} from 'react-redux'
import { Button, Form, Grid, Header, Label, Select, Tab, Table } from 'semantic-ui-react'

import fetchFun from '../services/ourBackend'
import ResponsiveContainer from './ResponsiveContainer'
import Loading from './Loading'
import ModalModal from './Modal'
import ABunchOfConstants from './ABunchOfConstants'

const USER_WANTHAVE_QUERY = ABunchOfConstants.userWantHaveQuery

const jwt = localStorage.jwt

const userConfigObj = {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `"Bearer ${jwt}"`
  },
  body: JSON.stringify(USER_WANTHAVE_QUERY)
}

let setNameOptions = ABunchOfConstants.setNameOptions

let foilNormalOptions = ABunchOfConstants.foilNormalOptions

let conditionOptions = ABunchOfConstants.conditionOptions

class WantHave extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      item: null,
      wantPage: 0,
      havePage: 0,
      addToWant: {},
      addToHave: {},
      loading: true
    }
  }

  componentDidMount() {
    fetchFun.genericNonGetFetch("graphql", userConfigObj)
    .then((data) => {
        this.props.dispatch({
          type: 'FETCH_WANTHAVE_DATA',
          wantHaveData: data.data
        })
        this.setState({loading:false})
      }
    )
  }

  sellItemCreate = (event) => {
    let cardToAdd = this.state.addToHave
    if (!Number.isInteger(cardToAdd.number) || cardToAdd.number < 0) {
      alert("The set number must be a positive whole number")
    }
    else if (cardToAdd.set && cardToAdd.number && cardToAdd.price && cardToAdd.fON && cardToAdd.condition) {
      const SELL_ITEM_MUTATION = {
        query: `mutation {
          createItem(input: {
            setAndNumber: "${cardToAdd.set} ${cardToAdd.number}",
            wantHaveRemoved: "sell",
            listingPrice: ${this.state.addToHave.price},
            additionalInfo: "${cardToAdd.fON} ${cardToAdd.condition}"
          }) {
            item {
              id
              productName
              productImagePath
              listingPrice
              additionalInfo
              wantHaveRemoved
            }
            message
            errors
          }
        }`
      }

      const createItemConfigObj = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `"Bearer ${jwt}"`
        },
        body: JSON.stringify(SELL_ITEM_MUTATION)
      }

      fetchFun.genericNonGetFetch("graphql", createItemConfigObj)
      .then((data) => {
        let message = data.data.createItem.message === "" ? data.data.createItem.errors : data.data.createItem.message
        this.props.dispatch({
          type: 'ADD_THIS_CARD',
          card: data.data.createItem.item
        })
        alert(message)
        this.setState({loading: false})
      })
      this.setState({loading: true})
    }
    else {
      alert("You must fill out all fields.")
    }
  }

  buyItemCreate = (event) => {
    let cardToAdd = this.state.addToWant
    if (!Number.isInteger(cardToAdd.number) || cardToAdd.number < 0) {
      alert("The set number must be a positive whole number")
    }
    else if (cardToAdd.set && cardToAdd.number && cardToAdd.fON && cardToAdd.condition) {
      const BUY_ITEM_MUTATION = {
        query: `mutation {
          createItem(input: {
            setAndNumber: "${cardToAdd.set} ${cardToAdd.number}",
            wantHaveRemoved: "buy",
            additionalInfo: "${cardToAdd.fON} ${cardToAdd.condition}"
          }) {
            item {
              id
              productName
              productImagePath
              additionalInfo
              wantHaveRemoved
            }
            message
            errors
          }
        }`
      }

      const createItemConfigObj = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify(BUY_ITEM_MUTATION)
      }
      fetchFun.genericNonGetFetch("graphql", createItemConfigObj)
      .then((data) => {
        let message = data.data.createItem.message === "" ? data.data.createItem.errors : data.data.createItem.message
        this.props.dispatch({
          type: 'ADD_THIS_CARD',
          card: data.data.createItem.item
        })
        alert(message)
        this.setState({loading: false})
      })
      this.setState({loading: true})
    }
    else {
      alert("You must fill out all fields.")
    }
  }

  removeItem = (event, card) => {
    const REMOVE_ITEM_MUTATION = {
      query: `mutation {
        updateItemInfo(input: {
          id: ${card.id},
          wantHaveRemoved: "removed",
        }) {
          item {
            id
            productName
            productImagePath
            listingPrice
            additionalInfo
            wantHaveRemoved
          }
          message
          errors
        }
      }`
    }

    const removeItemConfigObj = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify(REMOVE_ITEM_MUTATION)
    }

    fetchFun.genericNonGetFetch("graphql", removeItemConfigObj)
    .then((data) => {
      let card = data.data.updateItemInfo.item
      let message = data.data.updateItemInfo.message === "" ? data.data.updateItemInfo.errors : data.data.updateItemInfo.message
      alert(message)
      this.props.dispatch({
        type: 'DELETE_THIS_CARD',
        card: card
      })
    })
  }

  handleNextWantPage = (event) => {
    let nextWantPageCount = (this.state.wantPage+1)*20 > this.props.fetchedInfo.wantHaveData.users[0].wantList.length ? 0 : this.state.wantPage+1
    this.setState({wantPage: nextWantPageCount})
  }

  handleNextHavePage = (event) => {
    let nextHavePageCount = (this.state.havePage+1)*20 > this.props.fetchedInfo.wantHaveData.users[0].haveList.length ? 0 : this.state.havePage+1
    this.setState({havePage: nextHavePageCount})
  }

  cleanUpInfo = (info) => {
    let infoArray = info ? info.split(" ") : []
    let fON = infoArray.length === 0 ? "" : infoArray[0][0].toUpperCase() + infoArray[0].slice(1)
    let condition = infoArray.length === 0 ? "Blank" : infoArray[1][0].toUpperCase() + infoArray[1].slice(1)
    return fON + " " + condition
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
              {wantListSubset.map( (item) => {
                return (
                  <Table.Row key={item.id}>
                    <Table.Cell>
                      <Label ribbon>{item.productName}</Label>
                    </Table.Cell>
                    <Table.Cell>{this.cleanUpInfo(item.additionalInfo)}</Table.Cell>
                    <Table.Cell>
                      <ModalModal image={item.productImagePath}/>
                    </Table.Cell>
                    <Table.Cell>
                      <Button onClick={(event) => {this.removeItem(event, item)}}>Remove this Card</Button>
                    </Table.Cell>
                  </Table.Row>
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
              {haveListSubset.map( (item) => {
                return (
                  <Table.Row key={item.id}>
                  <Table.Cell>
                    <Label ribbon>{item.productName}</Label>
                  </Table.Cell>
                  <Table.Cell>{this.cleanUpInfo(item.additionalInfo)}</Table.Cell>
                  <Table.Cell>${item.listingPrice}</Table.Cell>
                  <Table.Cell>
                    <ModalModal image={item.productImagePath}/>
                  </Table.Cell>
                  <Table.Cell>
                    <Button onClick={(event) => {this.removeItem(event, item)}}>Remove this Card</Button>
                  </Table.Cell>
                  </Table.Row>
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
    const addToHaveComponent = (
      <Grid.Column >          
        <Header as='h2' color='blue' textAlign='center'>
          Add a Card to your Have List
        </Header>
        <Form>
          <Form.Group widths='equal'>
            <Form.Field
              control={Select}
              label='Set Name'
              options={setNameOptions}
              placeholder='Set Name'
              name='setName'
              onChange={(event, {value}) => this.setState({addToHave:{...this.state.addToHave, set: value}})}
            />
            <Form.Field
              control='input'
              type='number'
              min="0" 
              step="1"
              label='Card Number'
              placeholder='Card Number'
              name='cardNumber'
              onChange={(event) => this.setState({addToHave:{...this.state.addToHave, number: parseInt(event.target.value)}})}
            />
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.Field
              control='input'
              type='number'
              label='Listing Price'
              placeholder='Input for only have list items'
              name='price'
              onChange={(event) => this.setState({addToHave:{...this.state.addToHave, price: parseFloat(event.target.value)}})}
            />
            <Form.Field
              control={Select}
              label='Foil or Normal Printing'
              options={foilNormalOptions}
              placeholder='Foil or Normal'
              name='foilNormal'
              onChange={(event, {value}) => this.setState({addToHave:{...this.state.addToHave, fON: value}})}
            />
            <Form.Field
              control={Select}
              label='Condition'
              options={conditionOptions}
              placeholder='Condition'
              name='condition'
              onChange={(event, {value}) => this.setState({addToHave:{...this.state.addToHave, condition: value}})}
            />
          </Form.Group>
          <Form.Field control={Button} onClick={this.sellItemCreate}>Submit</Form.Field>
        </Form>
      </Grid.Column>
    )

    const addToWantComponent = (
      <Grid.Column >
        <Header as='h2' color='blue' textAlign='center'>
          Add a Card to your Want List
        </Header>
        <Form>
          <Form.Group widths='equal'>
            <Form.Field
              control={Select}
              label='Set Name'
              options={setNameOptions}
              placeholder='Set Name'
              name='setName'
              onChange={(event, {value}) => this.setState({addToWant:{...this.state.addToWant, set: value}})}
            />
            <Form.Field
              control='input'
              type='number'
              min="0" 
              step="1"
              label='Card Number'
              placeholder='Card Number'
              name='cardNumber'
              onChange={(event) => this.setState({addToWant:{...this.state.addToWant, number: parseInt(event.target.value)}})}
            />
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.Field
              control={Select}
              label='Foil or Normal Printing'
              options={foilNormalOptions}
              placeholder='Foil or Normal'
              name='foilNormal'
              onChange={(event, {value}) => this.setState({addToWant:{...this.state.addToWant, fON: value}})}
            />
            <Form.Field
              control={Select}
              label='Condition'
              options={conditionOptions}
              placeholder='Condition'
              name='condition'
              onChange={(event, {value}) => this.setState({addToWant:{...this.state.addToWant, condition: value}})}
            />
          </Form.Group>
          <Form.Field control={Button} onClick={this.buyItemCreate}>Submit</Form.Field>
        </Form>
      </Grid.Column>
    )

    const wantHavePanes = [
      { menuItem: 'Want List', render: () => <Tab.Pane>{wantListComponents}</Tab.Pane> },
      { menuItem: 'Have List', render: () => <Tab.Pane>{haveListComponents}</Tab.Pane> },
      { menuItem: 'Add a Card to Your Want List', render: () => <Tab.Pane>{addToWantComponent}</Tab.Pane> },
      { menuItem: 'Add a Card to Your Have List', render: () => <Tab.Pane>{addToHaveComponent}</Tab.Pane> }
    ]

    return (
      !this.state.loading ?
        <Grid textAlign='center' style={{ minHeight: '200vh', padding: '3em'}} verticalAlign='middle' celled='internally' stackable id="showcase">
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
const connectedWantHave = connector(WantHave)

export default connectedWantHave