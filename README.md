# CityStayNL Frontend

![CityStayNL](https://citystaynl.com/static/images/logo.png)  
**Live Website:** [citystaynl.com](https://citystaynl.com)

CityStayNL is a full-stack location-based real estate web application designed to help users find rental or purchase properties in St. John’s, Newfoundland, for the period of **December 2024 - March 2025**. This repository contains the frontend code for the application, built using **React**, **React-Leaflet**, and **Material UI**.

---

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- **Interactive Maps**: Integrated with React-Leaflet and PostGIS for geographic data handling.
- **User Authentication**: Secure user authentication using Djoser for managing listings, messaging, and reviews.
- **Search Functionality**: Distance-based and voice-based search for rental listings.
- **Pagination**: Efficient browsing of rental listings with pagination.
- **Media Optimization**: Reduced media file size to 35% of the original size using Python libraries, improving performance and storage efficiency.
- **Secure Deployment**: SSL certificate integration for website security and email verification during signup.

---

## Technologies Used
### Frontend
- **React**: JavaScript library for building the user interface.
- **React-Leaflet**: For integrating interactive maps.
- **Material UI**: For designing a responsive and modern UI.

### Backend (Linked Repository)
- **Django REST Framework (DRF)**: For building the backend API.
- **GeoDjango**: For handling geographic data.
- **PostGIS & PostgreSQL**: For spatial queries and database management.

### Deployment
- **DigitalOcean**: Hosting the application.
- **Nginx & Gunicorn**: For serving the application.
- **DigitalOcean Spaces**: Leveraging Amazon S3 for cloud storage and media management.
- **Namecheap Private Email**: For email verification during user signup.

---

## Installation (Getting Started with Create React App)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
