# Comicskaan 🎨

**Turn your wildest ideas into multi-panel comic strips instantly with the power of AI.**

Comicskaan is a web application that leverages the Google Gemini API to transform a simple text prompt into a complete, visually striking comic strip. It generates a story, writes dialogue, and creates unique, consistent artwork for each panel, offering a seamless and creative experience.

[![Deploy with Vercel](https://comicskaan.vercel.app/)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fgoogle-gemini-v2%2Fcomicskaan)

---

<img width="1916" height="968" alt="image" src="https://github.com/user-attachments/assets/41c0a2cb-9868-45dc-ba28-8c38ce60be73" />


## ✨ Core Features

*   **AI Story & Script Generation**: Provide a simple idea, and the AI generates a 4-6 panel story with a beginning, middle, and end.
*   **AI Image Generation**: Each panel's scene is rendered into a unique image with a consistent art style.
*   **Interactive Viewer**: Navigate through your generated comic strip with an intuitive carousel.
*   **Export to Image**: Download your entire comic strip as a single, high-quality PNG file to share anywhere.
*   **Dark & Light Modes**: A sleek UI with a theme toggle for your viewing preference.
*   **Responsive Design**: Enjoy a seamless experience on both desktop and mobile devices.
*   **Engaging Loaders**: Fun, animated loaders provide feedback during the generation process.

## 🚀 Tech Stack

*   **Frontend**: [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/) and [Vite](https://vitejs.dev/) for a fast development experience.
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) for rapid, utility-first UI development.
*   **Animations**: [Framer Motion](https://www.framer.com/motion/) for smooth and delightful animations.
*   **Backend**: [Vercel Serverless Functions](https://vercel.com/docs/functions) to securely handle API requests.
*   **AI Models**:
    *   **`gemini-2.5-flash`**: For generating the structured comic script (scenes, dialogue, image prompts).
    *   **`imagen-4.0-generate-001`**: For generating the comic panel images.

## ⚙️ How It Works

1.  **User Input**: You enter a story idea (e.g., "A cat astronaut discovering a planet made of yarn").
2.  **Script Generation**: The frontend sends this prompt to a secure Vercel serverless function (`/api/generate`).
3.  **Gemini Magic (Text)**: The function calls the Gemini API, providing a detailed prompt and a required JSON schema. Gemini returns a structured array of panel data, including scene descriptions, dialogue, and detailed image generation prompts.
4.  **Image Generation**: The frontend receives the script. For each panel, it makes a new request to the same `/api/generate` function, this time with the specific `image_prompt`.
5.  **Gemini Magic (Image)**: The serverless function calls the Imagen model to generate an image for the panel and returns it as a Base64 string.
6.  **Display**: As images are generated, they are displayed in the comic viewer, allowing you to see the story come to life in real-time.
7.  **Export**: The app uses `html2canvas` to render a hidden, print-quality version of the comic strip onto a canvas, which is then converted to a PNG for download.

## 📦 Getting Started & Local Development

You can run this project on your local machine for development and testing.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later recommended)
*   [Vercel CLI](https://vercel.com/docs/cli) (for the best local development experience that mimics the production environment)
*   A Google Gemini API Key. You can get one from [Google AI Studio](https://aistudio.google.com/).

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/comicskaan.git
    cd comicskaan
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a new file named `.env` in the root of your project and add your Gemini API key:
    ```
    API_KEY="YOUR_GEMINI_API_KEY"
    ```

4.  **Run the development server:**
    The best way to run this locally is with the Vercel CLI, as it will correctly handle the serverless function in the `/api` directory.

    ```bash
    vercel dev
    ```
    This will start the development server, typically at `http://localhost:3000`.

## 🌐 Deployment

This project is optimized for one-click deployment on [Vercel](https://vercel.com/).

1.  **Fork the repository** to your own GitHub account.
2.  Click the **"Deploy with Vercel"** button at the top of this README.
3.  Vercel will prompt you to connect your GitHub account and select the forked repository.
4.  **Configure Environment Variables**: During the setup process, Vercel will ask for environment variables. Add one with the name `API_KEY` and paste your Gemini API key as the value.
5.  **Deploy**: That's it! Vercel will automatically detect the Vite configuration, build your project, and deploy it.
