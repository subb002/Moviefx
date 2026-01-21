
# StreamNexus OTT Platform

A full-stack, Netflix-inspired OTT platform designed for performance and aesthetics.

## Features
- **Admin Panel**: Manage users, upload large movies (up to 6GB), and toggle download/block status.
- **User Side**: Seamless streaming, category-wise rows, playback resume, and internal downloading.
- **Security**: JWT-based role access and blocked user prevention.
- **Tech Stack**: React 18, Tailwind CSS, Express, Multer, JWT.

## Setup Instructions (Replit)

1. **Clone/Import**: Import this code into a new Replit workspace.
2. **Dependencies**: Ensure your `package.json` includes:
   ```json
   {
     "dependencies": {
       "express": "^4.18.2",
       "multer": "^1.4.5-lts.1",
       "jsonwebtoken": "^9.0.2",
       "cors": "^2.8.5",
       "mongodb": "^6.3.0",
       "react": "^18.2.0",
       "react-dom": "^18.2.0",
       "react-router-dom": "^6.21.0"
     }
   }
   ```
3. **Environment Variables**: Create a `.env` file in the root:
   ```env
   PORT=3001
   JWT_SECRET=nexus_super_secret_key_123
   MONGODB_URI=your_mongodb_connection_string
   ```
4. **Running**: 
   - Start the backend: `node backend/server.ts`
   - Start the frontend: Replit will automatically detect the entry point if configured, or use `npm run dev` for Vite/standard React builds.

## Admin Credentials
- **Username**: `admin`
- **Password**: `admin123`

## User Credentials (Dummy)
- **Username**: `user`
- **Password**: `user123`

## Note on Video Files
The provided code uses sample MP4 URLs from Google's sample video bucket for demonstration. In a real environment, use the Admin Panel to upload actual `.mp4`, `.mkv`, or `.avi` files.
