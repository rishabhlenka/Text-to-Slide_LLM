import { useState } from "react";
import MarkdownInput from "../components/MarkdownInput";
import SlideCountInput from "../components/SlideCountInput";
import SubmitButton from "../components/SubmitButton";
import SlideCard from "../components/SlideCard";
import MarkdownPreview from "../components/MarkdownPreview";
import { splitDocument } from "../api/SplitDocument";

const HomePage = () => {
  // State to manage markdown input
  const [markdown, setMarkdown] = useState<string>("");

  // State to manage slide count (nullable to handle initial empty input)
  const [slideCount, setSlideCount] = useState<number | null>(null);

  // State to store the result slides from API response
  const [result, setResult] = useState<string[]>([]);

  // State to manage loading status during API call
  const [loading, setLoading] = useState<boolean>(false);

  // Handles form submission for document processing
  const handleSubmit = async () => {
    // console.log("Submitting document for splitting...");
    // console.log("Markdown Input:", markdown);
    // console.log("Requested Slide Count:", slideCount);

    // Validate markdown input
    if (!markdown.trim()) {
      alert("Please enter markdown content.");
      return;
    }

    // Validate slide count
    if (!slideCount || slideCount < 1 || slideCount > 50) {
      alert("Please enter a valid slide count (1-50).");
      return;
    }

    setLoading(true);
    try {
      // API call to split markdown into slides
      const response = await splitDocument(markdown, slideCount);
      console.log("Raw response from API:", response);

      // Ensure response contains valid slides
      if (
        !response ||
        !response.sections ||
        !Array.isArray(response.sections.slides) ||
        response.sections.slides.length === 0
      ) {
        alert("No valid slides returned.");
        setLoading(false);
        return;
      }

      let slides = response.sections.slides;

      // Trim excess slides if more than required count
      while (slides.length > slideCount) {
        slides.pop();
      }

      console.log("Final slides after adjustment:", slides);
      setResult(slides);
    } catch (error) {
      console.error("Error processing document:", error);
      alert("Error processing document");
    } finally {
      setLoading(false);
    }
  };

  // Condition to disable submit button if fields are empty or invalid
  const isSubmitDisabled =
    !markdown.trim() || !slideCount || slideCount < 1 || slideCount > 50;

  return (
    <div className="container">
      <h1>Markdown to Slides</h1>

      <div className="input-group">
        {/* Input components for markdown and slide count */}
        <MarkdownInput onChange={setMarkdown} />
        <SlideCountInput onChange={(value) => setSlideCount(value)} />

        {/* Submit button with loading and disabled state */}
        <SubmitButton
          onSubmit={handleSubmit}
          disabled={isSubmitDisabled}
          loading={loading}
        />
      </div>

      {markdown.trim() && (
        <div className="side-by-side">
          <div className="markdown-preview">
            <h2>Markdown Preview</h2>
            <MarkdownPreview markdown={markdown} />
          </div>

          <div className="slide-preview">
            <h2>Generated Slides</h2>
            {/* Display loading indicator during API call */}
            {loading ? (
              <p>Processing...</p>
            ) : result.length > 0 ? (
              <div className="slides-container">
                {/* Render each slide as a separate card */}
                {result.map((slide, index) => (
                  <SlideCard key={index} slide={slide} index={index} />
                ))}
              </div>
            ) : (
              <p>No slides generated yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
