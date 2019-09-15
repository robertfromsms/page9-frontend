import React from 'react'
import {connect} from 'react-redux'
import { Button, Form, Grid, Header, Label, Select, Tab, Table } from 'semantic-ui-react'

import fetchFun from '../services/ourBackend'
import ResponsiveContainer from './ResponsiveContainer'
import Loading from './Loading'
import ModalModal from './Modal'
import ABunchOfConstants from './ABunchOfConstants'

const USER_CONFIG_OBJ = ABunchOfConstants.userConfigObj
let setNameOptions = ABunchOfConstants.setNameOptions
let foilNormalOptions = ABunchOfConstants.foilNormalOptions
let conditionOptions = ABunchOfConstants.conditionOptions
const jwt = localStorage.jwt

class WantListTableRow extends React.Component {
  constructor(props) {
    super(props)
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

  cleanUpInfo = (info) => {
    let infoArray = info ? info.split(" ") : []
    let fON = infoArray.length === 0 ? "" : infoArray[0][0].toUpperCase() + infoArray[0].slice(1)
    let condition = infoArray.length === 0 ? "Blank" : infoArray[1][0].toUpperCase() + infoArray[1].slice(1)
    return fON + " " + condition
  }

  render() {
    return (
      <Table.Row>
        <Table.Cell>
          <Label ribbon>{this.props.item.productName}</Label>
        </Table.Cell>
        <Table.Cell>{this.cleanUpInfo(this.props.item.additionalInfo)}</Table.Cell>
        <Table.Cell>
          <ModalModal image={this.props.item.productImagePath}/>
        </Table.Cell>
        <Table.Cell>
          <Button onClick={(event) => {this.removeItem(event, this.props.item)}}>Remove this Card</Button>
        </Table.Cell>
      </Table.Row>
    )
  }
}

const iNeedtheFetchedInfo = (state) => {
  return state
}

const connector = connect(iNeedtheFetchedInfo)
const connectedWantListTableRow = connector(WantListTableRow)

export default connectedWantListTableRow