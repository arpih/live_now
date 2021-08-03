# Architecture and Developer Guide

LiveNow is a responsive web application, which works on mobile and desktop in a browser,
and which performs take a picture and share with people. This application is available on the following URL's:
- https://arpih.github.io/live-now/

This repository includes two major parts of the application: frontend and firestore database.

Frontend is built using **React.js** and **Typescript**.

## Clone, Build and Run

1. Clone this repository
2. `cd ./live-now/frontend`
3. Install and build frontend: `npm install && npm run build`

## Coding Conventions

I use Airbnb JS coding style guide: [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

## Test and Lint Setup

### Lint

1. Install ESLint and React plugin:

`$ npm install -g eslint eslint-plugin-react`

2. Lint

You can use any of the two commands that work both for backend and frontend:

`$ npm run eslint`

### Test

No special setup is required to make tests work, just run the following commands:

`$ npm run test`
