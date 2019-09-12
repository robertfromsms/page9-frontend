import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'

const Loading = () => (
    <Dimmer active inverted>
      <Loader size='massive' />
    </Dimmer>
)

export default Loading