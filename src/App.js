import React from 'react'
import './App.css'
import {Switch, Route, Redirect} from 'react-router-dom'

import NavBar from './components/navBar'
import Landing from './components/Landing'
import LoginForm from './components/LoginForm'
import NewUserForm from './components/NewUserForm'
import WantHave from './components/WantHave'
import Matches from './components/Matches'
import UserDetails from './components/UserDetails'

function App() {
  return (
    <div className="App" >
      <div className="ui inverted vertical masthead center aligned segment">
        <div className="ui container">
          <NavBar/>
        </div>
      </div>
      { localStorage.jwt !== "null" ?
      <Switch>
        <Route exact path='/' render={() =>  <Landing />} />
        <Route exact path='/profile' render={() => <WantHave/>} />
        <Route exact path='/matches' render={() => <Matches/>} />
        <Route exact path='/account' render={() => <UserDetails/>} />
        <Route path='/' render={() => <Redirect to='/profile' />} />
      </Switch>
      :
      <Switch>
        <Route exact path='/' render={() =>  <Landing />} />
        <Route exact path='/signup' render={() => <NewUserForm />} />
        <Route exact path='/login' render={() => <LoginForm />} />
        <Route path='/' render={() => <Redirect to='/' />} />
      </Switch>
      }
    </div>
  );
}

export default App;
