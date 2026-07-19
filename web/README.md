# Social Media Video Downloader

A modern web application built with Next.js that allows you to download videos from various social media platforms in different qualities. This is the frontend client that works in conjunction with the [Social Media Video Downloader API](https://github.com/fabwaseem/social-media-video-downloader-api).

## Features

- 📱 Support for multiple platforms:
  - YouTube
  - Facebook
  - Instagram
  - TikTok
  - Twitter
- 🎥 Download videos in various qualities
- 🎵 Audio-only download option
- 🚀 Real-time download progress
- 💫 Modern and responsive UI
- ⚡ Fast and efficient downloads

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn or pnpm
- Git

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. Set up the backend API:

   - Clone and set up the [backend API](https://github.com/fabwaseem/social-media-video-downloader-api) following its README instructions
   - Ensure the API is running on the port specified in your environment variables

5. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application

## Project Structure

```
client/
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   └── pages/           # App pages
├── components/          # React components
│   ├── common/         # Common components
│   ├── layout/         # Layout components
│   ├── pages/          # Page-specific components
│   └── ui/             # UI components
├── config/             # Configuration files
├── lib/                # Utility functions and API client
└── public/             # Static assets
```

## Usage

1. Visit the homepage
2. Select the platform you want to download from
3. Paste the video URL
4. Select your preferred quality and format
5. Click download and wait for the process to complete

## Development

- The project uses TypeScript for type safety
- Styling is done using Tailwind CSS
- State management is handled through React hooks
- API interactions are managed through the custom API client in `lib/api.ts`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Backend API

This frontend client works with the [Social Media Video Downloader API](https://github.com/fabwaseem/social-media-video-downloader-api). Make sure to set up both the frontend and backend for full functionality.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
