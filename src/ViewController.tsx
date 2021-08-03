import React, { Component } from 'react';
import Login from './Login';
import Account from './Account';

type ViewControllerProps = {
  appState: any,
  setView: any,
}

/* eslint-disable no-unused-vars */

enum Views {
  login = 'LOGIN'
  , account = 'ACCOUNT'
}

/* eslint-enable no-unused-vars */

export default class ViewController extends Component<ViewControllerProps> {
  render() {
    let viewDiv = (<div />);
    const { appState, setView } = this.props;
    const { view } = appState;

    switch (view) {
      case Views.login:
        viewDiv = (
          <Login
            setView={setView}
            appState={appState}
          />
        );
        break;

      case Views.account:
        viewDiv = (
          <Account
            setView={setView}
            appState={appState}
          />
        );
        break;

      default:
        break;
    }

    return (
      <div className="App">
        {viewDiv}
      </div>
    );
  }
}
