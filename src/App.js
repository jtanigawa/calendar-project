import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import './App.css';

import Header from './components/header/header'
import Calendar from './pages/calendar/calendar';
import SigninSignup from './pages/signin-signup/signin-signup';
import Event from './pages/event/event';

import { auth, createUserProfileDocument } from './firebase/utils';

class App extends React.Component {

  constructor() {
    super();

    this.state = {
      currentUser: null
    }
  }

  unsubscribeFromAuth = null

  componentDidMount() {
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {

      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        userRef.onSnapshot((snapShot) => {
          this.setState({
            currentUser: {
              id: snapShot.id,
              ...snapShot.data()
            }
          });
          //console.log(this.state);
        });
      }else {
        this.setState({
          currentUser: userAuth
        });
      }

    });
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route
            exact
            path='/'
            render={() => <Calendar currentUser={this.state.currentUser} />}
          />  
          <Route
            exact
            path='/signin'
            render={() => this.state.currentUser ? 
            <Redirect to='/' />:<SigninSignup />} 
          />
          <Route path='/newevent' component={Event} />
          <Route path='/viewevent' component={Event} />
        </Switch>
      </div>
    );
  }
}

export default App;
