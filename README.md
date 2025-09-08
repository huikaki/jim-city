# Maid Agency Content Management System

A full-stack web application for managing a maid agency with both customer-facing and administrative features.

## Features

### Customer Features
- **Company Information**: View agency background, services, and contact details
- **Maid Search**: Browse available maids with advanced filtering options
- **Filter Options**: Search by skills, availability, and hourly rate range
- **PDF Download**: Download detailed maid profiles as PDF documents

### Admin Features
- **Authentication**: Secure login system for admin access
- **Maid Management**: Full CRUD operations for maid profiles with comprehensive data fields
- **Photo Upload**: Upload and manage maid photos
- **Company Management**: Edit company information and services
- **Real-time Updates**: Changes reflect immediately across the application
- **Advanced Data Structure**: Support for languages, skills, previous employment history

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **PDFKit** for PDF generation
- **CORS** for cross-origin requests

### Frontend
- **React** with functional components and hooks
- **React Router** for navigation
- **Axios** for API calls
- **CSS Grid** and **Flexbox** for responsive design

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd maid-agency-cms
   ```

2. **Install MongoDB**
   - Install MongoDB locally or use MongoDB Atlas (cloud)
   - Make sure MongoDB is running on `mongodb://localhost:27017`

3. **Install all dependencies**
   ```bash
   npm run install-all
   ```

4. **Seed the database with sample data**
   ```bash
   cd server
   npm run seed
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5001`
   - Frontend development server on `http://localhost:3000`

## Admin Access

- **URL**: `http://localhost:3000/login`
- **Username**: `admin`
- **Password**: `admin123`

The admin panel is protected and only accessible after login.

## Manual Installation

If you prefer to install dependencies manually:

1. **Install root dependencies**
   ```bash
   npm install
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Start backend server**
   ```bash
   cd server
   npm run dev
   ```

5. **Start frontend server** (in a new terminal)
   ```bash
   cd client
   npm start
   ```

## API Endpoints

### Company Information
- `GET /api/company` - Get company information
- `PUT /api/company` - Update company information

### Maids Management
- `GET /api/maids` - Get all maids (with optional filters)
- `GET /api/maids/:id` - Get specific maid
- `POST /api/maids` - Create new maid
- `PUT /api/maids/:id` - Update maid
- `DELETE /api/maids/:id` - Delete maid
- `GET /api/maids/:id/pdf` - Download maid profile as PDF

### Query Parameters for Filtering
- `skills` - Filter by skills (comma-separated)
- `availability` - Filter by availability (Full-time/Part-time)
- `minRate` - Minimum hourly rate
- `maxRate` - Maximum hourly rate

## Usage

### For Customers
1. Visit the homepage to learn about the company
2. Navigate to "Find a Maid" to browse available staff
3. Use filters to narrow down your search
4. Click "Download Profile PDF" to get detailed information

### For Administrators
1. Navigate to "Admin Panel"
2. Add new maids using the "Add New Maid" button
3. Edit existing maid profiles by clicking "Edit"
4. Update company information using "Edit Company Info"
5. Delete maids when necessary

## File Structure

```
maid-agency-cms/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js         # Main app component
│   │   ├── index.js       # Entry point
│   │   └── index.css      # Global styles
│   └── package.json
├── server/                 # Node.js backend
│   ├── uploads/           # Uploaded files (created automatically)
│   ├── index.js          # Server entry point
│   └── package.json
├── package.json          # Root package.json
└── README.md
```

## Database Schema

### Maid Model
- **id**: Auto-generated MongoDB ObjectId
- **maidId**: Auto-generated format (AA1234)
- **name**: Full name
- **gender**: Male/Female
- **educationLevel**: Education background
- **nationality**: Country of origin
- **maritalStatus**: Single/Married/Divorced/Widowed
- **height**: Height in cm
- **weight**: Weight in kg
- **chineseZodiac**: Chinese zodiac sign
- **religion**: Religious affiliation
- **horoscope**: Western horoscope sign
- **workExperience**: Years of experience
- **languages**: Array of {language, level}
- **skills**: Array of {skill, value}
- **previousEmployment**: Array of employment history
- **profilePhoto**: Photo file path
- **status**: available/pending/not available
- **createdAt/updatedAt**: Timestamps

## Production Deployment

1. **Build the frontend**
   ```bash
   cd client
   npm run build
   ```

2. **Serve static files from Express**
   Add to your server/index.js:
   ```javascript
   app.use(express.static(path.join(__dirname, '../client/build')));
   ```

3. **Deploy to your preferred platform**
   - Heroku
   - Vercel
   - AWS
   - DigitalOcean

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.