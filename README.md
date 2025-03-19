# CityStayNL Frontend

**Live Website:** [citystaynl.com](https://citystaynl.com)

CityStayNL is a full-stack location-based real estate web application designed to address the growing need for rental and purchase properties in St. John’s, Newfoundland. With the **significant increase in immigrants, particularly international students, over the past few years**, CityStayNL aims to simplify the process of finding affordable and convenient housing for newcomers.

This repository contains the frontend code for the application, built using **React**, **React-Leaflet**, and **Material UI**.

---

## Key Features
- **Interactive Maps**: Integrated with React-Leaflet and PostGIS for geographic data handling.
- **Nearby Places**: Displays nearby amenities (e.g., schools, hospitals, grocery stores) within a **3 km radius** of a particular listing, helping users evaluate the convenience of the location.
- **User Authentication**: Secure user authentication using Djoser for managing listings, messaging, and reviews.
- **Search Functionality**: Distance-based and voice-based search for rental listings.
- **Pagination**: Efficient browsing of rental listings with pagination.
- **Media Optimization**: Reduced media file size to 35% of the original size using Python libraries, improving performance and storage efficiency.
- **Secure Deployment**: SSL certificate integration for website security .

---

## Technologies Used
### Frontend
- **React**: JavaScript library for building the user interface.
- **React-Leaflet**: For integrating interactive maps.
- **Material UI**: For designing a responsive and modern UI.

### Backend 
- **Django REST Framework (DRF)**: For building the backend API.
- **GeoDjango**: For handling geographic data.
- **PostGIS & PostgreSQL**: For spatial queries and database management.
Find the backend code here: [CityStay-Backend](https://github.com/sayyam44/CityStay-Backend)

### Deployment
- **DigitalOcean**: Hosting the application.
- **Nginx & Gunicorn**: For serving the application.
- **DigitalOcean Spaces**: Leveraging Amazon S3 for cloud storage and media management.
- **Namecheap Private Email**: For email verification during user signup.

---

## Installation
To run the frontend locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/citystaynl-frontend.git
   cd citystaynl-frontend
2. **Install dependencies**:
   ```bash
   npm install
3. **Set up environment variables**:
    Create a .env file in the root directory and add the necessary environment variables (e.g., API endpoints):
   ```bash
   REACT_APP_API_URL=https://api.citystaynl.com
4. **Run the development server**:
   ```bash
   npm start
The application will be available at http://localhost:3000.

### Deployment
The application is deployed on DigitalOcean using the following stack:
**Nginx**: As a reverse proxy server.
**Gunicorn**: For serving the Django backend.
**DigitalOcean Spaces**: Leveraging Amazon S3 for cloud storage and media management.
**SSL Certificate**: Integrated for secure HTTPS connections.

### Contributing
Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository:
    Click the "Fork" button on the top right of the repository page.
   
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   
3. Stage and commit your changes:
   ```bash
   git add .
   git commit -m "Add your meaningful commit message"

4) Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   
5) Submit a pull request
   -> Go to the original repository and click "New Pull Request".
   -> Select your branch and provide a detailed description of your changes.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Developed by Sayyam Kundra.
Live Website: citystaynl.com
Backend Repository: [CityStay-Backend](https://github.com/sayyam44/CityStay-Backend)
