import React from 'react'
import {connect} from 'react-redux'
import { Button, Grid, Label, Table } from 'semantic-ui-react'

import ModalModal from './Modal'

class WantListMatches extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			page: 0
		}
	}

	handleNextPage = (event) => {
    	let nextPageCount = (this.state.page+1)*20 > this.props.fetchedInfo.haveMatchData[this.props.userIndex].matches.length ? 0 : this.state.page+1
    	this.setState({page: nextPageCount})
  	}

  	cleanUpInfo = (info) => {
		let infoArray = info ? info.split(" ") : []
		let fON = infoArray.length === 0 ? "" : infoArray[0][0].toUpperCase() + infoArray[0].slice(1)
		let condition = infoArray.length === 0 ? "Blank" : infoArray[1][0].toUpperCase() + infoArray[1].slice(1)
		return fON + " " + condition
	}

	render() {
		const wantListMatches = this.props.fetchedInfo.wantMatchData ? this.props.fetchedInfo.wantMatchData[this.props.userIndex].matches : []
	    let currentStarting = this.state.page*20
	    let wantListMatchesSubset = wantListMatches.slice(currentStarting, currentStarting + 20)
	    let wantListMatchComponents = (
			<React.Fragment>
				<Grid.Column style={{ paddingBottom: '2em'}}>
				  <Table celled textAlign='center'>
				    <Table.Header>
				      <Table.Row>
				        <Table.HeaderCell>Card Name</Table.HeaderCell>
				        <Table.HeaderCell>Item Info</Table.HeaderCell>
				        <Table.HeaderCell>Listing Price</Table.HeaderCell>
				        <Table.HeaderCell>Detail Button</Table.HeaderCell>
				      </Table.Row>
				    </Table.Header>
				    <Table.Body>
				      {wantListMatchesSubset.map( (item) => {
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
				          </Table.Row>
				        )})
				      }
				    </Table.Body>
				  </Table>
				</Grid.Column>
				<Grid.Row>
				  <Grid.Column>
				    <Button onClick={this.handleNextPage}>More Matches From This User</Button>
				  </Grid.Column>
				</Grid.Row>
			</React.Fragment>
	    )
	    return wantListMatchComponents
	}
}

const iNeedtheFetchedInfo = (state) => {
  return state
}

const connector = connect(iNeedtheFetchedInfo)
const connectedWantListMatches = connector(WantListMatches)

export default connectedWantListMatches