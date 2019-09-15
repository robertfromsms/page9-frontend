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

const USER_CONFIG_OBJ = ABunchOfConstants.userConfigObj
let setNameOptions = ABunchOfConstants.setNameOptions
let foilNormalOptions = ABunchOfConstants.foilNormalOptions
let conditionOptions = ABunchOfConstants.conditionOptions
const jwt = localStorage.jwt

class AddToHave extends React.Component {
  constructor() {
    super()
    this.state = {
      addToHave: {}
    }
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
        this.props.dispatch({type: 'STOP_LOADING'})
      })
      this.props.dispatch({type: 'LOADING'})
    }
    else {
      alert("You must fill out all fields.")
    }
  }

  render() {
    return (
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
  }
}

const iNeedtheFetchedInfo = (state) => {
  return state
}

const connector = connect(iNeedtheFetchedInfo)
const connectedAddToHave = connector(AddToHave)

export default connectedAddToHave