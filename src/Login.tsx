import React, { Component } from 'react';
// @ts-ignore
import Translate from 'react-translate-component';
import { ReactComponent as Like } from './images/like.svg';
import { ReactComponent as ActiveLike } from './images/active-like.svg';
import { ReactComponent as Dislike } from './images/dislike.svg';
import { ReactComponent as ActiveDislike } from './images/active-dislike.svg';
import { allPhotos, deletePublicPhoto, addReaction } from './firebase/firebase.utils';
import Header from './Header';

type Props = {
  appState: any,
  setView: any,
}

type State = {
  isReady: boolean,
  loading: boolean,
}

/* eslint-disable no-unused-vars */

enum Views {
  account = 'ACCOUNT'
}

/* eslint-enable no-unused-vars */

export default class Login extends Component<Props, State> {
  private photos: any = [];

  constructor(props: Props) {
    super(props);
    this.state = {
      isReady: false,
      loading: false, // eslint-disable-line react/no-unused-state
    };
  }

  componentDidMount() {
    allPhotos()
      .then((photos: any) => {
        const n = 5;
        const firstPhotos = photos.reverse().slice(0, n);
        this.photos.push(...firstPhotos);
      })
      .then(() => this.setState({ isReady: true }));
  }

  handleUserReaction = (reaction: string, photo: any) => {
    const { appState } = this.props;
    const { currentUser } = appState;

    if (!currentUser) return;

    this.setState({ loading: true }); // eslint-disable-line react/no-unused-state

    deletePublicPhoto(photo);

    const { reactions } = photo;
    let existingUser: any = {};
    let arr = [];
    if (reactions) existingUser = reactions.find((user: any) => user.uid === currentUser.uid);
    if (reactions) arr = reactions.filter((user: any) => user.uid !== currentUser.uid);
    if (existingUser) {
      if (reaction === 'like') {
        if (existingUser.like === 1) {
          existingUser.like = 0;
        } else {
          existingUser.like = 1;
        }
        existingUser.dislike = 0;
      } else {
        if (existingUser.dislike === 1) {
          existingUser.dislike = 0;
        } else {
          existingUser.dislike = 1;
        }
        existingUser.like = 0;
      }
      arr.push(existingUser);
    } else {
      const user:any = {
        uid: currentUser.uid,
        like: reaction === 'like' ? 1 : 0,
        dislike: reaction === 'dislike' ? 1 : 0,
      };
      reactions.push(user);
    }
    addReaction(photo);
    this.setState({ loading: false }); // eslint-disable-line react/no-unused-state
  }

  render() {
    const { appState, setView } = this.props;
    const { currentUser } = appState;
    const { isReady } = this.state;

    const userReactions = (reactions: any, reaction: string): number => {
      let like = 0;
      let dislike = 0;
      reactions.forEach((el: any) => {
        like += el.like;
        dislike += el.dislike;
      });
      const count = (reaction === 'like') ? like : dislike;

      return count;
    };

    const activeReaction = (photo: any, reaction: string): boolean => {
      if (!currentUser) return false;

      const { reactions } = photo;
      let existingUser: any = {};

      if (reactions) existingUser = reactions.find((user: any) => user.uid === currentUser.uid);

      if (!existingUser) return false;

      const isActive = (reaction === 'like') ? existingUser.like : existingUser.dislike;

      return isActive;
    };

    const photosHTML = this.photos
      .map((photo: any) => (
        <div className="photo">
          <div className="photo-info" style={{ backgroundImage: `url(${photo.photoData})` }}>
            <div className="photo-desc">{photo.photoDesc}</div>
            <div className="photo-user">{photo.userName}</div>
          </div>
          <div className="reactions">
            <div
              className="reaction-button"
              role="button"
              tabIndex={0}
              onKeyUp={() => this.handleUserReaction('like', photo)}
              onClick={() => this.handleUserReaction('like', photo)}
            >
              <div className="count">
                {photo.reactions ? `${userReactions(photo.reactions, 'like') ? userReactions(photo.reactions, 'like') : ''}` : ''}
              </div>
              {activeReaction(photo, 'like') ? <ActiveLike /> : <Like />}
            </div>
            <div
              className="reaction-button"
              role="button"
              tabIndex={0}
              onKeyUp={() => this.handleUserReaction('dislike', photo)}
              onClick={() => this.handleUserReaction('dislike', photo)}
            >
              <div className="count">
                {photo.reactions ? `${userReactions(photo.reactions, 'dislike') ? userReactions(photo.reactions, 'dislike') : ''}` : ''}
              </div>
              {activeReaction(photo, 'dislike') ? <ActiveDislike /> : <Dislike />}
            </div>
          </div>
        </div>
      ));

    return (
      <div className="login-component">
        <Header appState={appState} setView={setView} />
        <Translate content="loginWelcome" component="h2" />
        <div className="main">
          <div className="photos-section">
            {isReady && photosHTML}
          </div>
        </div>
      </div>
    );
  }
}
