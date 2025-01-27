# Project Overview

- The project consists of a React frontend and a Node.js backend that leverages
  LLMs to split markdown documents.

- Users provide markdown content and specify the number of slides.

- The backend processes the content and returns structured slide sections.

# Tech Stack

## Frontend:

- React (TypeScript)

- Tailwind CSS

- Fetch API for API calls

## Backend:

- Node.js (JavaScript)

- Express.js

- LLM APIs (GPT-4o-mini)

- dotenv for environment variables

# File Structure

## 3.1 Frontend

frontend/

│-- src/

│   ├── api/

│   │   ├── SplitDocument.ts

│   ├── components/

│   │   ├── MarkdownInput.tsx

│   │   ├── MarkdownPreview.tsx

│   │   ├── SlideCard.tsx

│   │   ├── SlideCountInput.tsx

│   │   ├── SubmitButton.tsx

│   ├── pages/

│   │   ├── HomePage.tsx

│   ├── App.tsx

│   ├── App.css

│   ├── index.tsx

│-- package.json

│-- tsconfig.json

│-- README.md

## 3.2 Backend

backend/

│-- src/

│   ├── controllers/

│   │   ├── documentController.js

│   ├── services/

│   │   ├── llmService.js

│   ├── routes/

│   │   ├── documentRoutes.js

│   ├── index.js

│-- .env

│-- package.json

│-- README.md

# Development Journey

### 1. Initial Approach: Programmatic Preprocessing

Tried splitting markdown using regex to detect headers, bullet lists, and
paragraphs. Simply using the LLM to supplement the programmatic approach.

Inefficient due to inconsistent markdown styles.

### 2. LLM-Based Position Calculation

Attempted splitting by character positions using LLMs.

Faced issues as LLMs are not optimized for numerical counting tasks.

### 3. Final Solution: Direct Text Extraction

Switched to returning slide content directly from the backend.

Ensured all content is included without losing structure.

---

# Key Features

## **Clean and User-Friendly UI**

- Markdown preview feature.

- Input validation with real-time feedback.

- Responsive design.

## **Robust Backend Processing**

- Batching large documents with overlap handling.

- Supports multiple LLMs for flexibility.

\*\* **Error Handling & Validation**

- Ensures slide count limits.

- Provides clear error messages for invalid input.

# Setup Instructions

## **1. Prerequisites**

- Install Node.js (v16+)

- A valid API key for OpenAI, Anthropic, or Google

## **2. Installation Steps**

1. Clone the repository:

   'git clone https://github.com/rishabhlenka/gamma.git'

   'cd gamma'

2. Backend Setup:

   'cd gamma-backend'

   'npm install'

3. Create a .env file:

   'OPENAI_API_KEY=your_api_key_here'

4. Start the backend:

   'node index.js'

5. Frontend Setup:

   'cd frontend'

   'npm install'

   'npm run dev'

6. Open the app in the browser at http://localhost:3000

# **Challenges Faced & Solutions**

## _LLM Counting Limitations_

- Issue: LLMs were unreliable for exact character position splits.

- Solution: Switched to returning text directly rather than positions.

## **Performance Bottlenecks**

- Issue: Large markdown files caused latency and API rate limits.

- Solution: Implemented batching with overlapping content.

## **Maintaining Markdown Integrity**

- Issue: Some sections were cut off in the initial versions between words.

- Solution: Improved prompt engineering to retain all content. Added JSON schema
  validation to enforce structured output.

# **Future Improvements**

## **Enhanced UI/UX**

- Add slide reordering via drag-and-drop.

- Live markdown editing within the app.

## **Performance Enhancements**

- Dynamically adjust batch sizes based on content complexity.

Implement caching to reduce redundant LLM calls.

## **Multi-LLM Support**

- Add dynamic selection between available LLMs based on performance.

# Conclusion

- This project showcases an efficient markdown-to-slide converter leveraging LLM
  capabilities. The iterative development approach allowed for refining the
  process to achieve a reliable and scalable solution.
