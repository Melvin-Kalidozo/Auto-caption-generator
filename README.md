
# Next.js Project

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

---

## Table of Contents
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
  - [Install FFmpeg](#1-install-ffmpeg)
  - [AssemblyAI Credentials](#2-assemblyai-credentials)
- [Project Features](#project-features)
- [Learn More](#learn-more)
- [Deploy on Vercel](#deploy-on-vercel)
- [Additional Notes](#additional-notes)

---

## Getting Started

### Run the Development Server

After setting up the prerequisites, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

---

## Prerequisites

### 1. Install FFmpeg

This project uses [FFmpeg](https://ffmpeg.org/) for video processing. Ensure FFmpeg is installed on your system and accessible via the command line.

**Installation Steps:**

#### Windows
1. Download the latest FFmpeg build from [FFmpeg.org](https://ffmpeg.org/download.html).
2. Extract the downloaded zip file.
3. Add the `bin` folder from the extracted files to your system's PATH environment variable.

#### macOS
1. Install FFmpeg using Homebrew:
   ```bash
   brew install ffmpeg
   ```

#### Linux
1. Install FFmpeg using your package manager:
   ```bash
   sudo apt update
   sudo apt install ffmpeg
   ```

Verify the installation:
```bash
ffmpeg -version
```

### 2. AssemblyAI Credentials

This project uses [AssemblyAI](https://www.assemblyai.com/) for transcription services. You must have an AssemblyAI account and API key to use this feature.

**Steps to Get Started:**
1. Sign up or log in to [AssemblyAI](https://www.assemblyai.com/).
2. Navigate to your dashboard and copy your API key.
3. Add the API key to your environment variables in the `.env.local` file:
   ```env
   ASSEMBLYAI_API_KEY=your_api_key_here
   ```

---

## Project Features

- **Video Processing**: Utilizes FFmpeg for advanced video processing tasks.
- **Transcription**: Uses AssemblyAI to transcribe audio from videos.
- **Next.js Optimizations**: Includes auto-updating and font optimization with [`next/font`](https://nextjs.org/docs/basic-features/font-optimization).

---

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Next.js GitHub Repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

---

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

---

## Additional Notes

- Ensure you have the required environment variables configured in your `.env.local` file.
- If FFmpeg or AssemblyAI integration is not working, double-check the installation and API key setup.
- Contributions and feedback are always welcome. Feel free to open a pull request or create an issue.

---

### License

This project is licensed under the [MIT License](LICENSE).
