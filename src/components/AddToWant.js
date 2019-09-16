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

const USER_CONFIG_OBJ = ABunchOfConstants.userConfigObj
let setNameOptions = ABunchOfConstants.setNameOptions
let foilNormalOptions = ABunchOfConstants.foilNormalOptions
let conditionOptions = ABunchOfConstants.conditionOptions
const jwt = localStorage.jwt

class AddToWant extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      addToWant: {},
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
        alert(message)
        if (data.data.createItem.message) {
          this.props.dispatch({
            type: 'ADD_THIS_CARD',
            card: data.data.createItem.item
          })
        }
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
  }
}

const iNeedtheFetchedInfo = (state) => {
  return state
}

const connector = connect(iNeedtheFetchedInfo)
const connectedAddToWant = connector(AddToWant)

export default connectedAddToWant