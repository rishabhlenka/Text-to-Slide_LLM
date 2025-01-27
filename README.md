# Project Overview

- This project consists of a React frontend and a Node.js backend that work
  together to convert a markdown document into structured slide sections using
  Large Language Models (LLMs).

- The user provides markdown content along with the desired number of slides.
  The backend then processes the document using an LLM and returns sections of
  text that can be directly used as slides.

- The primary goal is to ensure each section represents a discrete idea,
  preserving the integrity of the original markdown structure while making it
  presentation-ready.

# **Tech Stack**

## Frontend:

- React (TypeScript): Used for building the user interface.

- Tailwind CSS: Provides a clean and modern design with responsive styling.

- Fetch API: Handles communication with the backend API.

## Backend:

- Node.js (JavaScript): Powers the backend logic and routing.

- Express.js: Simplifies API routing and request handling.

- LLM APIs: GPT-4o-mini

- dotenv: Manages environment variables, such as API keys.

# **File Structure**

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

# **Development Journey**

### 1. Initial Approach: Programmatic Preprocessing

- Problem: The initial attempt involved programmatically splitting markdown
  using regex to identify headers (#, ##, ###), bullet points (-, \*), and
  paragraph breaks (\n\n).

- Challenge: Markdown documents often vary in structure and formatting. This
  made it difficult to create a reliable, generalized regex-based solution for
  all types of content.

- Outcome: This approach was inefficient and prone to cutting off content
  incorrectly.

### 2. LLM-Based Position Calculation

- Problem: Transitioned to leveraging LLMs for splitting documents by
  calculating character positions in the text.

- Challenge: LLMs are not inherently designed for numerical and counting tasks,
  which led to inaccurate or incomplete splits.

- Example Issue: The LLM would fail to count accurately for large documents,
  resulting in sections being cut off or skipped.

- Outcome: This approach was abandoned because it was inconsistent and prone to
  errors.

### 3. Final Solution: Direct Text Extraction

- Problem Solved: Instead of relying on positions, the backend was updated to
  process text and return discrete slide sections as plain text.

- Approach:

  - The backend sends batches of the document to the LLM and asks it to return
    sections of text for each chunk.

  - Overlap handling was added to ensure no content was missed between chunks.

  - The frontend directly renders these sections as individual slides.

- Outcome: This approach was reliable, scalable, and ensured the integrity of
  the original document.

---

# **Key Features**

## **Clean and User-Friendly UI**

- Real-time markdown preview for better user experience.

- Input validation ensures the user enters valid markdown and slide count.

- Responsive design with support for all device sizes.

## **Robust Backend Processing**

- Handles large documents by splitting them into manageable batches with
  overlapping content to avoid missed sections.

- Currently supports (GPT-4OMini), and can be modified to support more.

- Designed with clear API endpoints for easy integration.

## **Error Handling & Validation**

- Validates inputs such as slide count (ensuring it's between 1 and 50).

- Ensures all content is processed and no text is left out.

- Provides detailed error messages for invalid input or processing errors.

# **Setup Instructions**

## **1. Prerequisites**

- Install Node.js (v16+)

- A valid API key for OpenAI

## **2. Installation Steps**

1. Clone the repository:

   'git clone https://github.com/rishabhlenka/gamma.git'

   'cd gamma'

   'npm install'

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

## **LLM Counting Limitation**

- Issue: LLMs were unreliable for splitting by exact character positions.

- Solution: Switched to asking LLMs to return discrete text sections directly.

## **Performance Bottlenecks**

- Issue: Large markdown files caused latency and API rate limits.

- Solution: Batching with overlapping content ensured reliable processing while
  avoiding rate limits.

## **Maintaining Markdown Integrity**

- Issue: Some sections were cut off in the initial versions between words.

- Solution: Improved prompt engineering and validated JSON outputs for structure
  and content completeness.

# **Future Improvements**

## **Enhanced UI/UX**

- Add slide reordering via drag-and-drop.

- Live markdown editing within the app.

## **Performance Enhancements**

- Dynamically adjust batch sizes based on content complexity.

- Implement caching to reduce redundant LLM calls.

## **Multi-LLM Support**

- Add dynamic selection between available LLMs based on performance.

# **Conclusion**

- This project demonstrates an efficient and user-friendly markdown-to-slide
  converter leveraging LLM capabilities. Through iterative development and
  continuous problem-solving, it now offers a reliable and scalable solution
  that ensures all input content is included while maintaining structure and
  usability.
