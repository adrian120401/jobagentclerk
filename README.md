# Job Agent: AI-Powered Job Search Assistant

Job Agent is a modern, AI-driven platform designed to help users find, analyze, and prepare for tech job opportunities. It leverages advanced language models to provide personalized job recommendations, resume advice, job analysis, and interview simulations—all through a conversational interface.

Demo: https://jobagentclerk.vercel.app

Repo: https://github.com/adrian120401/jobagentclerk

Author: @adrian120401 - LinkedIn: https://www.linkedin.com/in/adriandelosreyess

---

## Application Highlights

### Job Matching
![Job Matching](./short1.gif)
**Intelligent job matching based on user profile and job descriptions.** The agent analyzes user information and available job postings to recommend the most relevant opportunities, ensuring a personalized and effective job search experience.

### Smart Resume Editing
![Smart Resume Editing](./short2.gif)
**Automated resume optimization tailored to job requirements.** The agent reviews and edits the user's resume, enhancing it to better align with targeted job positions and increase the chances of success.

### Interview Mode
![Interview Mode](./short3.gif)
**Simulated technical interviews with real-time feedback and scoring.** The agent conducts mock interviews, provides instant feedback, assigns a performance score, and saves sessions so users can track their progress and improvement over time.

---

## Clerk Authentication Integration

This application uses Clerk to provide secure and modern authentication for users. Clerk enables both email/password and Google-based sign-in and sign-up flows, streamlining user onboarding and access management. By leveraging Clerk's authentication platform, the app benefits from robust user management, improved security, and a seamless login experience.

On the frontend, Clerk's React SDK is integrated to handle authentication flows, user sessions, and UI components such as sign-in and user profile management. The authentication state is synchronized with the application's backend: after a user signs in with Clerk, a Clerk-issued JWT is sent with each API request.

On the backend, the Java SDK and the Nimbus JOSE + JWT library are used to validate Clerk's JWTs. This ensures that only authenticated users can access protected endpoints. The backend extracts the Clerk user ID from the validated token and uses it to manage and synchronize user records in the application's database, providing a secure and scalable approach to user data management.

---

## Technologies Used

**Frontend:**
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Radix UI

**Backend:**
- Java 21
- Spring Boot 3
- Spring Data MongoDB
- Spring Security
- Azure OpenAI (GPT-4o)
- Cloudinary (for media)

**Database:**
- MongoDB

**Auth:**
- Clerk


---

## Project Architecture & Flow

The system is composed of:
- **User Interface (Frontend):** Modern, responsive chat and job browsing experience.
- **API Gateway (Backend Controller Layer):** Receives and routes user requests.
- **Intent Detection:** Classifies user messages to determine their intent (job search, resume advice, etc.).
- **AI Services:** Specialized services for job matching, resume analysis, job detail analysis, general Q&A, and interview simulation.
- **Database:** Stores user profiles, job data, and interview sessions.
- **External LLM Provider:** Azure OpenAI (GPT-4o) powers the agent's intelligence.

**See the editable architecture diagram:** [`jobagent-ai-architecture.drawio`](./jobagent-ai-architecture.drawio) (open with [draw.io](https://app.diagrams.net/) or compatible tools).

---

## Architecture (High Level)

Below is a high-level overview of the Job Agent system architecture:

![Job Agent Architecture](./jobagent-ai-architecture.png)

This diagram illustrates the core components and their interactions within the system, showing how user requests flow through the application from the frontend interface to backend services and external APIs.

---

## Features
- Conversational job search and recommendations
- Resume/CV analysis and personalized advice
- Job detail analysis and suitability feedback
- Technical interview simulation with feedback and scoring
- User authentication and profile management
- Clean, modern, and responsive UI

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Java 21
- MongoDB instance (local or remote)
- Docker and Docker Compose (optional, for containerized deployment)

### 1. Backend (Spring Boot API)

#### Option A: Running directly with Gradle

```bash
cd job-agent-api
./gradlew build
./gradlew bootRun
```

- The backend will start on [http://localhost:8080](http://localhost:8080) by default.
- Configure your MongoDB and Azure OpenAI credentials in the appropriate config files or environment variables (see .env.example for reference).

#### Option B: Running with Docker Compose

```bash
cd job-agent-api

cp .env.example .env

nano .env 
docker-compose up -d
```

- This will start the Spring Boot application along with MongoDB instances.
- The backend will be available at [http://localhost:8080](http://localhost:8080).
- All required services will be containerized and networked together.

### 2. Frontend (React App)

```bash
cd jobagent
npm install
npm run dev
```

- The frontend will start on [http://localhost:5173](http://localhost:5173) by default.
- Make sure the backend is running for full functionality.

---

## Editing the Architecture Diagram
- Open `jobagent-ai-architecture.drawio` in [draw.io](https://app.diagrams.net/) or any compatible diagram editor.
- You can update, export, or share the diagram as needed.

---

## Contributing
- Pull requests and issues are welcome!
- Please follow best practices for code style and commit messages.
- For major changes, open an issue first to discuss what you would like to change.

---

## License
This project is licensed under the MIT License.
