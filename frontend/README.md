# Resume Editor Frontend

Next.js React application for the Resume Editor with AI enhancement capabilities.

## Features

- **File Upload**: Drag & drop or click to upload PDF/DOCX files
- **Resume Editing**: Edit all resume sections with a user-friendly interface
- **AI Enhancement**: Enhance sections using AI suggestions
- **Save & Download**: Save to backend and download as JSON
- **Responsive Design**: Works on desktop and mobile devices
- **Server Status Monitoring**: Real-time server status with automatic wake-up functionality

## Components

### ResumeEditor
Main component that orchestrates the entire resume editing experience.

### FileUpload
Handles file upload with drag & drop support for PDF and DOCX files.

### ResumeForm
Form component for editing resume sections with AI enhancement buttons.

### ServerStatus
Displays real-time server status and automatically pings the server to keep it awake.

## Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## File Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles with Tailwind
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── ResumeEditor.tsx   # Main editor component
│   ├── FileUpload.tsx     # File upload component
│   └── ResumeForm.tsx     # Resume form component
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── tsconfig.json          # TypeScript configuration
├── next.config.js         # Next.js configuration
└── README.md             # This file
```

## Technologies Used

- **Next.js 14**: React framework with app router
- **React 18**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS framework

## API Integration

The frontend communicates with the FastAPI backend at `http://localhost:8000`:

- `POST /ai-enhance`: Enhance resume sections
- `POST /save-resume`: Save resume data

## Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

### Environment Variables

Create a `.env.local` file for environment-specific configuration:

```env
# Backend URL - replace with your actual Render backend URL
NEXT_PUBLIC_API_URL=https://your-render-backend-url.onrender.com
```

**Important**: Make sure to replace `your-render-backend-url.onrender.com` with your actual Render backend URL.

## Server Status Monitoring

The application includes a server status monitoring system that:

- Displays a status banner at the top of the page
- Shows real-time server status (Online/Offline/Checking)
- Automatically pings the server every 30 seconds to keep it awake
- Attempts to wake up sleeping servers with API calls
- Provides visual feedback about server availability

The status banner will show:
- 🟢 **Green**: Server is online and ready
- 🔴 **Red**: Server is offline or sleeping
- 🟡 **Yellow**: Checking server status

## Styling

The application uses Tailwind CSS for styling with a custom color palette:

- Primary: Blue shades (`blue-600`, `blue-700`)
- Success: Green shades (`green-600`, `green-700`)
- Warning: Purple shades (`purple-600`, `purple-700`)
- Danger: Red shades (`red-600`, `red-800`) 