# 🏛️ ASTU Smart Complaint & Issue Tracking System

A full-stack web application designed for university environments to streamline the submission, tracking, and resolution of student and staff grievances. The platform features an integrated Retrieval-Augmented Generation (RAG) AI Chatbot to provide context-aware answers to user queries based on university policies.

## ✨ Key Features

- **Role-Based Access Control**: Secure dashboards tailored for students, staff, and administrators.
- **Issue Lifecycle Management**: Interfaces to submit, categorize, attach evidence, and track complaint status in real-time.
- **Smart AI Assistant**: RAG-powered chatbot utilizing the Google Gemini API and MongoDB Vector Search.
- **Administrative Control**: Comprehensive oversight for user management, role assignment, and resolution metrics.
- **Instant Notifications**: Real-time alerts for status changes and new complaint routing.

## 🛡️ Security & Integrity

- **Role-Based Access Control (RBAC)**: Strict enforcement of privileges across student, staff, and admin roles protecting against unauthorized ticket access.
- **Secure Authentication**: Utilizes JWT-based (JSON Web Token) stateless authentication to verify identities for every API request securely.
- **Rate Limiting**: Global and auth-specific request rate limiting configured to prevent spam submissions and brute-force attacks.
- **Data Input Protection**: Implements Helmet, HPP (HTTP Parameter Pollution), and NoSQL Injection prevention via Mongoose to secure the database layer.
- **Secure File Uploads**: Validates file MIME types, limits to specified extensions (JPG, PNG, PDF, DOC), restricts payload size to 5MB, and sanitizes filenames using cryptographic random generation to prevent path traversal and malicious executable uploads.
- **Strict Data Privacy**: Complaint data and user profiles are strictly siloed; visibility is constrained only to authorized workflow participants.
- **Protected AI Pipeline**: The generative process uses only approved university documents mitigating AI hallucination and data exposure risks.
- **Immutable Audit Trails**: Maintains transparent lifecycle tracking for all submitted issues (Pending, In-Progress, Resolved).

## 🛠️ Technology Stack

- **Frontend**: React.js, React Router, Material-UI, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (Document Store & Vector Search Engine)
- **AI Integration**: Google Gemini API (Embeddings & Generation)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16.14.0 or higher)
- MongoDB Atlas Account (with Vector Search supported)
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd backend2
   ```

2. **Backend Configuration**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
   Start the backend:
   ```bash
   npm run dev
   ```

3. **Frontend Configuration**
   Open a new terminal:
   ```bash
   cd frontend
   npm install
   ```
   Start the frontend:
   ```bash
   npm start
   ```

## 🧠 RAG Architecture

The AI search workflow operates on a Retrieval-Augmented Generation architecture:
1. System administrators upload policy documents which are processed and chunked.
2. The Google Gemini embedding model converts chunks into vector representations.
3. These vector embeddings are indexed within MongoDB Atlas Vector Search.
4. User natural language queries are embedded and semantically matched against document chunks.
5. A Google Gemini generation model constructs a relevant response utilizing the retrieved context.

## 📄 License

Distributed under the MIT License.
