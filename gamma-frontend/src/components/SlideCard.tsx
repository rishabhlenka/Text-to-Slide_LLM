// SlideCard Component
// This component displays an individual slide with a numbered index and formatted markdown content.
// It processes the slide text to clean up escape characters before rendering it using ReactMarkdown.

import ReactMarkdown from "react-markdown";

const SlideCard = ({ slide, index }: { slide: string; index: number }) => {
  const formattedSlide = slide
    .replace(/\\n/g, "\n") // Convert escaped newlines
    .replace(/\\\//g, "") // Remove escape slashes
    .replace(/\\\"/g, '"') // Remove escaped quotes
    .trim();

  return (
    <div className="slide-card">
      <div className="slide-number">{index + 1}</div>
      <div className="slide-content">
        <ReactMarkdown>{formattedSlide}</ReactMarkdown>
      </div>
    </div>
  );
};

export default SlideCard;
