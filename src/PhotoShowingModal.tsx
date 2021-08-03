import React, { Component } from 'react';
import Modal from 'react-modal'; // eslint-disable-line import/no-unresolved
// @ts-ignore
import Translate from 'react-translate-component';
import { ReactComponent as Close } from './images/fail.svg';
import { ReactComponent as Like } from './images/like.svg';
import { ReactComponent as Dislike } from './images/dislike.svg';

type Props = {
  showPhoto: boolean,
  imgData: string,
  imgDesc: string,
  userImage: any,
  closeModal: any,
  deletePhoto: any,
}

export default class PhotoShowingModal extends Component<Props> {
  render() {
    const {
      showPhoto,
      imgData,
      imgDesc,
      userImage,
      closeModal,
      deletePhoto,
    } = this.props;

    const userReactions = (reaction: string): number => {
      let like = 0;
      let dislike = 0;
      userImage.reactions.forEach((el: any) => {
        like += el.like;
        dislike += el.dislike;
      });
      const count = (reaction === 'like') ? like : dislike;

      return count;
    };

    return (
      <div>
        <Modal isOpen={showPhoto} onRequestClose={closeModal}>
          <div
            className="close-button"
            role="button"
            tabIndex={0}
            onKeyUp={() => closeModal()}
            onClick={() => closeModal()}
          >
            <Close />
          </div>
          <div className="image-section">
            <div className="image-desc">{imgDesc}</div>
            <img src={imgData} alt="user" />
            {userImage && userImage.reactions && (
              <div className="reactions">
                <div className="reaction-button">
                  <div className="count">
                    {`${userReactions('like') ? userReactions('like') : ''}`}
                  </div>
                  <Like />
                </div>
                <div className="reaction-button">
                  <div className="count">
                    {`${userReactions('dislike') ? userReactions('dislike') : ''}`}
                  </div>
                  <Dislike />
                </div>
              </div>
            )}
            <div
              className="link"
              role="button"
              tabIndex={0}
              onKeyUp={() => deletePhoto()}
              onClick={() => deletePhoto()}
            >
              <Translate content="deletePhoto" />
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
