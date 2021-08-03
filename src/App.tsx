import React from 'react';
import './styles/App.scss';
import counterpart from 'counterpart';

import ViewController from './ViewController';
import { auth, createUserProfileDocument } from './firebase/firebase.utils';

import en from './lang/en';
import am from './lang/hy';

counterpart.registerTranslations('en', en);
counterpart.registerTranslations('am', am);
counterpart.setLocale('en');

type State = {
  view?: Views,
  photos?: any,
  currentUser?: any,
  lang: any,
}

/* eslint-disable no-unused-vars */

enum Views {
  login = 'LOGIN'
  , account = 'ACCOUNT'
}

/* eslint-enable no-unused-vars */

class App extends React.Component<{}, State> {
  private unsubscriveFromAuth: any = null;

  constructor(props: any) {
    super(props);
    this.state = {
      view: Views.login, // eslint-disable-line react/no-unused-state
      photos: [], // eslint-disable-line react/no-unused-state
      currentUser: null, // eslint-disable-line react/no-unused-state
      lang: 'en',
    };
  }

  componentDidMount() {
    this.unsubscriveFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        createUserProfileDocument(userAuth)
          .then((userRef: any) => {
            userRef.onSnapshot((snapShot: any) => {
              this.setState({
                id: snapShot.id, // eslint-disable-line react/no-unused-state
                ...snapShot.data(),
              }, () => {
                // this.setView(Views.account);
              });
            });
          });
      }
      this.setState({ currentUser: userAuth }); // eslint-disable-line react/no-unused-state
    });
  }

  componentWillUnmount() {
    this.unsubscriveFromAuth();
  }

  setView(view: Views) {
    this.setState({ view }, () => {}); // eslint-disable-line react/no-unused-state
  }

  setLang = (lang: any) => {
    this.setState({ lang: lang.target.value });
    counterpart.setLocale(lang.target.value);
  }

  render() {
    const { lang } = this.state;
    return (
      <>
        <div className="language-section">
          <select value={lang} onChange={(e) => this.setLang(e)}>
            <option value="en">EN</option>
            <option value="am">AM</option>
          </select>
        </div>
        <ViewController
          appState={this.state}
          setView={(view: Views) => {
            this.setView(view);
          }}
        />
      </>
    );
  }
}

export default App;
