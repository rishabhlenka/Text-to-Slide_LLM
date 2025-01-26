import { useState } from "react";
import MarkdownInput from "../components/MarkdownInput";
import SlideCountInput from "../components/SlideCountInput";
import SubmitButton from "../components/SubmitButton";
import SlideCard from "../components/SlideCard";
import { splitDocument } from "../api/SplitDocument";

const HomePage = () => {
  const [markdown, setMarkdown] = useState("");
  const [slideCount, setSlideCount] = useState(10);
  const [result, setResult] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!markdown.trim()) {
      alert("Please enter markdown content.");
      return;
    }

    if (slideCount < 1 || slideCount > 50) {
      alert("Please enter a valid slide count (1-50).");
      return;
    }

    setLoading(true);
    try {
      const response = await splitDocument(markdown, slideCount);
      const cleanedSlides = response.sections.map((slide: string) =>
        slide.replace(/\\n/g, "\n")
      );
      setResult(cleanedSlides.slice(0, slideCount));
    } catch (error) {
      alert("Error processing document");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container">
      <h1>Markdown to Slides</h1>

      <div className="input-group">
        <MarkdownInput onChange={setMarkdown} />
        <SlideCountInput onChange={setSlideCount} />
        <SubmitButton onSubmit={handleSubmit} />
      </div>

      {loading && <p>Processing...</p>}

      {result.length > 0 && (
        <div className="results">
          <h2>Generated Slides:</h2>
          <div className="slides-container">
            {result.map((slide, index) => (
              <SlideCard key={index} slide={slide} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
