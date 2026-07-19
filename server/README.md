# Video Downloader API

A powerful and secure API service built with NestJS for downloading videos from various social media platforms including YouTube, Facebook, Instagram, TikTok, and Twitter.

## Features

- 🔐 Secure API Key Authentication
- 📊 Rate Limiting
- 🌐 IP Whitelisting
- ⏱️ Download Duration Limits
- 📝 Download History Tracking
- 🔄 Multiple Platform Support
- 📈 Usage Analytics
- 🚀 Swagger API Documentation

## Frontend Client

This API is designed to work seamlessly with the [Social Media Video Downloader](https://github.com/fabwaseem/Social-Media-Video-Downloader) frontend client.

### Frontend Features

- 🎨 Modern UI built with Next.js 14
- 🎭 Dark/Light theme support
- 📱 Fully responsive design
- ⚡ Server-side rendering
- 🔄 Real-time download progress
- 📊 Download history tracking
- 🎛️ Quality selection interface
- 🎯 Easy platform selection

### Frontend Setup

1. Clone the frontend repository:

```bash
git clone https://github.com/fabwaseem/Social-Media-Video-Downloader.git
cd Social-Media-Video-Downloader
```

2. Install dependencies:

```bash
pnpm install
```

3. Configure environment variables:
   Create a `.env.local` file with:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_KEY=your_api_key
```

4. Run the development server:

```bash
pnpm dev
```

The frontend will be available at `http://localhost:3000`

### Integration Steps

1. Ensure this backend API is running
2. Update the frontend's `.env.local` with your API key
3. Configure CORS in backend's `.env`:

```env
ALLOWED_ORIGINS="http://localhost:3000,your-production-domain.com"
```

4. For production deployment:
   - Deploy this backend API
   - Update frontend's environment variables with production API URL
   - Deploy frontend to your preferred platform (Vercel recommended)

## Supported Platforms & Features

### YouTube

- Video downloads with quality selection
- Playlist support
- Format conversion (MP4, MKV, WEBM)
- Audio extraction (MP3, M4A)
- Thumbnail downloads
- Metadata extraction

### Facebook

- Public video downloads
- Private video support (with authentication)
- HD quality support
- Story downloads

### Instagram

- Post videos
- Reels
- Stories (with authentication)
- IGTV videos

### TikTok

- Single video downloads
- Without watermark support
- Music extraction
- Metadata support

### Twitter

- Tweet videos
- Spaces recordings
- GIF downloads
- Multiple quality options

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- pnpm
- yt-dlp (auto-installed)
- ffmpeg (auto-installed if not present)

## Project Setup

1. Clone the repository:

```bash
git clone <your-repo-url>
cd <project-directory>
```

2. Install dependencies:

```bash
pnpm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the following variables:

```env
DATABASE_URL="postgresql://postgres:root@localhost:5432/downloader?schema=public"
ALLOWED_ORIGINS="your-frontend-domain.com,another-domain.com"
NODE_ENV="development"
```

4. Set up the database:

```bash
# Generate Prisma client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev
```

## Automatic Binary Management

The service automatically handles the installation and updates of required binaries:

- **yt-dlp**: Latest version auto-downloaded based on OS
- **ffmpeg**: System version used if available, otherwise downloaded
- Supported platforms: Windows (32/64-bit), macOS, Linux
- Auto-updates on application restart

## URL Validation & Processing

The service includes comprehensive URL validation for all supported platforms:

```typescript
// Example URL validation
const videoUrl = 'https://www.youtube.com/watch?v=...';
const result = await validateUrl(videoUrl, Platform.YOUTUBE);
```

Supported URL patterns:

- YouTube: Regular videos, Shorts, Playlists
- Facebook: Posts, Watch, Stories
- Instagram: Posts, Reels, IGTV
- TikTok: Regular posts, Music
- Twitter: Tweets, Spaces

## Download Options

### Basic Download

```typescript
const options = {
  quality: 'highest',
  format: 'mp4',
  output: './downloads',
};
```

### Advanced Options

```typescript
const options = {
  quality: '1080p',
  format: 'mp4',
  output: {
    outDir: './downloads',
    fileName: 'custom-name.mp4',
  },
  audioOnly: false,
  maxDuration: 1800, // 30 minutes
  convertTo: 'webm',
};
```

## Type System

The API includes comprehensive TypeScript definitions:

```typescript
// Platform Types
type Platform = 'youtube' | 'facebook' | 'instagram' | 'tiktok' | 'twitter';

// Download Options
interface DownloadOptions<T extends Platform> {
  quality?: Quality;
  format?: Format;
  output?: OutputOptions;
  // ... more options
}

// Progress Tracking
interface ProgressType {
  status: DownloadStatus;
  percentage: number;
  downloaded: number;
  total: number;
  speed: number;
  eta: number;
}
```

## Project Structure

```
src/
├── classes/
│   └── VideoDownload.ts     # Core download functionality
├── lib/
│   ├── helper.ts           # Utility functions
│   ├── config.ts          # Configuration management
│   └── utils.ts           # Common utilities
├── modules/
│   ├── auth/              # Authentication & API key management
│   ├── download/          # Download controllers & services
│   └── ytdlp/            # yt-dlp integration
├── types/
│   ├── youtube.ts        # YouTube specific types
│   ├── facebook.ts       # Facebook specific types
│   └── instagram.ts      # Instagram specific types
└── validate/
    ├── url.ts           # URL validation logic
    └── schema.ts        # Validation schemas
```

## Error Handling

The API implements comprehensive error handling:

- URL validation errors
- Download failures
- Format conversion issues
- Rate limiting errors
- Authentication failures

Example error responses:

```json
{
  "statusCode": 400,
  "message": "Invalid URL format",
  "error": "Bad Request"
}
```

## Rate Limiting

Default limits per API key:

- 100 requests per minute
- Maximum video duration: 30 minutes
- Configurable per user/key
- Headers included in response:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Running the Application

```bash
# Development mode
pnpm run start:dev

# Production mode
pnpm run build
pnpm run start:prod
```

The API will be available at `http://localhost:3001` by default.

## API Documentation

When running in development mode, Swagger documentation is available at:

```
http://localhost:3001/api
```

## Authentication

The API uses API key authentication. You can provide the API key in one of two ways:

1. Via the `X-API-Key` header:

```
X-API-Key: your-api-key
```

2. Via Bearer token in the Authorization header:

```
Authorization: Bearer your-api-key
```

## API Routes Documentation

### User Management (Admin Only)

All user management routes require admin privileges.

#### Create User

```http
POST /users
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "isAdmin": false
}
```

#### List Users

```http
GET /users?includeApiKeys=true
```

#### Get User Details

```http
GET /users/:id
```

#### Update User

```http
PUT /users/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "isBlocked": false,
  "isAdmin": false
}
```

#### Delete User

```http
DELETE /users/:id
```

### API Key Management

#### Admin Routes

##### List All API Keys

```http
GET /api-keys/all
```

##### Create New API Key

```http
POST /api-keys
Content-Type: application/json

{
  "userId": "user_id",
  "name": "API Key Name",
  "expiresAt": "2024-12-31T23:59:59Z",
  "ipWhitelist": ["192.168.1.1"],
  "rateLimit": 100,
  "maxDuration": 1800
}
```

##### Block API Key

```http
PUT /api-keys/:id/block
Content-Type: application/json

{
  "reason": "Violation of terms"
}
```

##### Unblock API Key

```http
PUT /api-keys/:id/unblock
```

##### Revoke API Key (Admin)

```http
DELETE /api-keys/:id
```

#### User Routes

##### List My API Keys

```http
GET /api-keys/my-keys
```

##### Update My API Key

```http
PUT /api-keys/my-key/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "ipWhitelist": ["192.168.1.1"],
  "maxDuration": 1800
}
```

##### Revoke My API Key

```http
DELETE /api-keys/my-key/:id
```

##### Validate API Key

```http
GET /api-keys/validate
X-API-Key: your-api-key
```

## API Key Format

API keys follow the format: `dk_<32_bytes_hex>`
Example: `dk_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`

## System Maintenance

The system includes automatic maintenance features:

### Cleanup Service

- Runs every hour
- Removes downloaded files older than 12 hours
- Updates download status to EXPIRED in the database
- Maintains disk space and system performance

## API Key Properties

Each API key includes the following configurable properties:

- `name`: Descriptive name for the key
- `expiresAt`: Optional expiration date
- `ipWhitelist`: List of allowed IP addresses
- `rateLimit`: Requests per minute (default: 100)
- `maxDuration`: Maximum media duration in seconds (default: 1800)
- `isBlocked`: Whether the key is blocked
- `blockReason`: Reason for blocking (if blocked)
- `lastUsedAt`: Timestamp of last usage

## User Properties

User accounts have the following properties:

- `email`: Unique email address
- `name`: Optional display name
- `isAdmin`: Administrative privileges
- `isBlocked`: Account status
- `createdAt`: Account creation date
- `updatedAt`: Last update timestamp
