import React from 'react'
import { Button, Image, Modal } from 'semantic-ui-react'

const ModalModal = (props) => (
  <Modal dimmer='blurring' style={{'width':225}} trigger={<Button>Show Card</Button>} >
      <Image src={props.image} centered/>
  </Modal>
)

export default ModalModal