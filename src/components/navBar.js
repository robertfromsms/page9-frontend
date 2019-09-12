import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import { Menu } from 'semantic-ui-react'

export default class NavBar extends Component {
  constructor() {
    super()
    this.state = {activeItem: null}
  }

  handleItemClick = (event, { name }) => 
    this.setState({ activeItem: name })


  logout = (event) => {
    localStorage.setItem("jwt", null)
    window.location.href = "/"
  }

  render() {
    const { activeItem } = this.state
    let loggedInNavBarItems = [
      <Menu.Item
            name="Want/Have Lists"
            key="want/have lists"
            active={activeItem === "Want/Have Lists"}
            as={Link}
            to='/profile'
            onClick={
              this.handleItemClick
            }
          >
            Want/Have Lists
      </Menu.Item>,
      <Menu.Item
            name="Matches"
            key="matches"
            active={activeItem === "Matches"}
            as={Link}
            to='/matches'
            onClick={
              this.handleItemClick
            }
          >
            Matches
      </Menu.Item>,
      <Menu.Item
            position='right'
            name="Logout"
            key="logout"
            active={activeItem === "Logout"}
            onClick={
                this.logout
            }
          >
            Logout
      </Menu.Item>,
      <Menu.Item
            name="Edit Account Details"
            key="edit account details"
            active={activeItem === "Edit Account Details"}
            as={Link}
            to='/account'
            onClick={
              this.handleItemClick
            }
          >
            Edit Account Details
      </Menu.Item>
    ]
    let notLoggedInNavBarItems = [
      <Menu.Item
            position='right'
            name="Login"
            key="login"
            as={Link}
            to='/login'
            active={activeItem === "Login"}
            onClick={
              this.handleItemClick
            }
          >
            Login
      </Menu.Item>,
      <Menu.Item
            name="Signup"
            key="signup"
            as={Link}
            to='/signup'
            active={activeItem === "Signup"}
            onClick={
              this.handleItemClick
            }
          >
            Sign Up
      </Menu.Item>
    ]

    return (
      <Menu>
        {localStorage.jwt !== "null" ? loggedInNavBarItems : notLoggedInNavBarItems}
      </Menu>
    )
  }
}