import React from 'react'
import {
  Grid,
  Header,
  Segment,
} from 'semantic-ui-react'


const PastExchanges = () => {
	return (
		<Segment style={{ padding: '0em' }} vertical>
			<Grid>
			  <Grid.Row textAlign='center'>
			    <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
			      <Header as='h3' style={{ fontSize: '2em' }}>
			        Past Exchanges
			      </Header>
			      <p style={{ fontSize: '1.33em' }}>That is what they all say about us</p>
			    </Grid.Column>
			  </Grid.Row>
			</Grid>
		</Segment>
	)
}

export default PastExchanges