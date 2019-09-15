import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  Button,
  Card,
  Grid,
  Header,
  Image,
  Label,
  Segment,
  Table,
} from 'semantic-ui-react'

class ExchangesInitiatedByOthers extends Component {
	constructor(props) {
		super(props)
		this.state = {
			cardCard: null,
    		page: 0
		}
	}

	handleCardPreview = (event, exchangeItem) => {
		this.setState({cardCard: exchangeItem})
	}

	handleNextPage = (event) => {
		let newPage = (this.state.page + 1) % this.props.fetchedInfo.data.users[0].initiatedByOthers.length
		this.setState({page: newPage})
	}

	handleConfirm = (event, exchange) => {
		debugger
	}

	render() {
		const exchangesInitiatedByOthers = this.props.fetchedInfo.exchangesData.users[0].initiatedByOthers
		let exchangesInitiatedByOthersSubset = exchangesInitiatedByOthers.slice(this.state.page, this.state.page + 1)
		let exchangesInitiatedByOthersComponents = exchangesInitiatedByOthersSubset.map( (exchange) => {
			return (
			    <Segment style={{ padding: '0em' }} vertical>
			      <Grid celled='internally' columns='equal' stackable>
			        <Grid.Row textAlign='center'>
			          <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
			            <Header as='h5' style={{ fontSize: '2em' }}>
							Buyer: {exchange.buyer.userName} <br/>
							Seller: {exchange.seller.userName} <br/>
							{exchange.exchangeStatus}
							<Button onClick={(event) => this.handleConfirm(event,exchange)}>Click to Confirm</Button>
						</Header>
					  	<Table celled>
						    <Table.Header>
						      <Table.Row>
						        <Table.HeaderCell>Card Name</Table.HeaderCell>
						        <Table.HeaderCell>Item Info</Table.HeaderCell>
						        <Table.HeaderCell>Item Status</Table.HeaderCell>
						        <Table.HeaderCell>Price</Table.HeaderCell>
						        <Table.HeaderCell>Detail Button</Table.HeaderCell>
						      </Table.Row>
						    </Table.Header>

						    <Table.Body>
						      {exchange.exchangeItems.map((exchangeItem) => {
						      		return (
						      		  <Table.Row>
								        <Table.Cell>
								          <Label ribbon>{exchangeItem.item.productName}</Label>
								        </Table.Cell>
								        <Table.Cell>{exchangeItem.item.additionalInfo}</Table.Cell>
								        <Table.Cell>{exchangeItem.item.wantHaveRemoved}</Table.Cell>
								        <Table.Cell>{exchangeItem.item.listingPrice}</Table.Cell>
								        <Table.Cell>
								        	<Button onClick={(event) => this.handleCardPreview(event,exchangeItem)}>Click to Expand</Button>
								        </Table.Cell>
								      </Table.Row>
						      		)
						      	})
						  	  }
						    </Table.Body>
					  	</Table>
			          </Grid.Column>
			          <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
			            {this.state.cardCard ?
	                    <Card className="centered">
	                      <Image src={this.state.cardCard.item.productImagePath} wrapped ui={false} />
	                      <Card.Content>
	                        <Card.Header>{this.state.cardCard.item.productName}</Card.Header>
	                        <Card.Meta>
	                          <span className='date'>Price: {this.state.cardCard.item.listingPrice}</span>
	                        </Card.Meta>
	                        <Card.Description>
	                          {this.state.cardCard.item.additionalInfo}
	                        </Card.Description>
	                      </Card.Content>
	                    </Card>
	                    :
	                    null}
			          </Grid.Column>
			        </Grid.Row>
			      </Grid>
			    </Segment>
			)
		})
		exchangesInitiatedByOthersComponents.push(<Button onClick={this.handleNextPage}>Click to See the Next Exchange</Button>)

		return (
			<Segment style={{ padding: '0em' }} vertical>
				<Grid>
				  <Grid.Row textAlign='center'>
				    <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
				      <Header as='h3' style={{ fontSize: '2em' }}>
				        Exchanges Awaiting Your Confirmation
				      </Header>
				      {exchangesInitiatedByOthers.length ? 
				      exchangesInitiatedByOthersComponents
				      : 
				      "No exchanges yet, start exchanging cards with other users!"}
				    </Grid.Column>
				  </Grid.Row>
				</Grid>
			</Segment>
		)
	}
}

const iNeedtheFetchedInfo = (state) => {
  return state
}

const connector = connect(iNeedtheFetchedInfo)
const connectedExchangesInitiatedByOthers = connector(ExchangesInitiatedByOthers)

export default connectedExchangesInitiatedByOthers