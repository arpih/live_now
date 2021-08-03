import React, { Component } from 'react';
// @ts-ignore
import Translate from 'react-translate-component'; // eslint-disable-line import/no-unresolved
import { ReactComponent as Photo } from './images/photo.svg';
import Header from './Header';
import PhotoShowingModal from './PhotoShowingModal';
import PhotoCapturingModal from './PhotoCapturingModal';
import { allPhotos, deletePrivatePhoto, deletePublicPhoto } from './firebase/firebase.utils';

type Props = {
  appState: any,
  setView: any,
}

type State = {
  showAllPhotos: boolean,
  showPhoto: boolean,
  imgData: string,
  imgDesc: string,
  photoCapturingModal: boolean,
}

export default class Account extends Component<Props, State> {
  private photos: any = [];

  constructor(props: Props) {
    super(props);
    this.state = {
      showAllPhotos: false,
      showPhoto: false,
      imgData: '',
      imgDesc: '',
      photoCapturingModal: false,
    };
  }

  componentDidMount() {
    allPhotos()
      .then((photos: any) => {
        this.photos.push(...photos);
      });
  }

  handleShowPhotos = () => {
    const { showAllPhotos } = this.state;
    this.setState({ showAllPhotos: !showAllPhotos });
  }

  showPhoto = (photo: any) => {
    this.setState({
      showPhoto: true,
      imgData: photo.photoData,
      imgDesc: photo.photoDesc,
    });
  }

  closeModal = () => {
    this.setState({ showPhoto: false });
  };

  deletePhoto = () => {
    const { appState } = this.props;
    const { currentUser, photos } = appState;
    const { imgData } = this.state;
    const privatePhoto = photos.find((photo: any) => photo.photoData === imgData);
    const publicPhoto = this.photos.find((photo: any) => photo.photoData === imgData);
    deletePrivatePhoto(currentUser.uid, privatePhoto);
    deletePublicPhoto(publicPhoto);
    this.closeModal();
  }

  showPhotoCapturingModal = () => {
    this.setState({ photoCapturingModal: true });
  }

  closePhotoCapturingModal = () => {
    this.photos = [];
    allPhotos()
      .then((photos: any) => {
        this.photos.push(...photos);
        this.setState({ photoCapturingModal: false });
      });
  }

  render() {
    const { setView, appState } = this.props;
    const { photos } = appState;
    const {
      showAllPhotos,
      showPhoto,
      imgData,
      imgDesc,
      photoCapturingModal,
    } = this.state;
    const partOfPhotos: string[] = photos.reverse().slice(0, 6);
    const photosNeedToShow = showAllPhotos ? photos : partOfPhotos;

    const photosHTML = photosNeedToShow
      .map((photo: any) => (
        <div
          className="photo"
          role="button"
          tabIndex={0}
          onKeyUp={() => this.showPhoto(photo)}
          onClick={() => this.showPhoto(photo)}
        >
          <img src={photo.photoData} alt="user" />
        </div>
      ));

    const links = (showAllPhotos) ? (
      <div
        className="link"
        role="button"
        tabIndex={0}
        onKeyUp={() => {}}
        onClick={() => this.handleShowPhotos()}
      >
        <Translate content="showLess" />
      </div>
    ) : (
      <div
        className="link"
        role="button"
        tabIndex={0}
        onKeyUp={() => {}}
        onClick={() => this.handleShowPhotos()}
      >
        <Translate content="showMore" />
      </div>
    );

    const userImage = this.photos.find((photo: any) => photo.photoData === imgData);

    return (
      <div className="account-component">
        <Header appState={appState} setView={setView} />
        <PhotoShowingModal
          showPhoto={showPhoto}
          imgData={imgData}
          imgDesc={imgDesc}
          userImage={userImage}
          closeModal={this.closeModal}
          deletePhoto={this.deletePhoto}
        />
        <PhotoCapturingModal
          appState={appState}
          photoCapturingModal={photoCapturingModal}
          closePhotoCapturingModal={this.closePhotoCapturingModal}
        />
        <div className="main">
          <div className="new-photo-section">
            <div
              className="new-photo-button"
              role="button"
              tabIndex={0}
              onKeyUp={() => this.showPhotoCapturingModal()}
              onClick={() => this.showPhotoCapturingModal()}
            >
              <Photo />
            </div>
            <Translate content="photoCapturingMessage" component="div" />
          </div>
          <div className="photos-section">
            {photosHTML}
          </div>
          {photos.length > 6 && links}
        </div>
      </div>
    );
  }
}
