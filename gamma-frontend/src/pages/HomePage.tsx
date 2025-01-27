import { useState } from "react";
import MarkdownInput from "../components/MarkdownInput";
import SlideCountInput from "../components/SlideCountInput";
import SubmitButton from "../components/SubmitButton";
import SlideCard from "../components/SlideCard";
import MarkdownPreview from "../components/MarkdownPreview";
import { splitDocument } from "../api/SplitDocument";

const HomePage = () => {
  const [markdown, setMarkdown] = useState<string>("");
  const [slideCount, setSlideCount] = useState<number | null>(null);
  const [result, setResult] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    console.log("Submitting document for splitting...");
    console.log("Markdown Input:", markdown);
    console.log("Requested Slide Count:", slideCount);

    if (!markdown.trim()) {
      alert("Please enter markdown content.");
      return;
    }

    if (!slideCount || slideCount < 1 || slideCount > 50) {
      alert("Please enter a valid slide count (1-50).");
      return;
    }

    setLoading(true);
    try {
      const response = await splitDocument(markdown, slideCount);
      console.log("Raw response from API:", response);

      // Ensure response structure is correct
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

      // Ensure the correct number of slides by trimming excess
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
        <MarkdownInput onChange={setMarkdown} />
        <SlideCountInput onChange={(value) => setSlideCount(value)} />
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
            {loading ? (
              <p>Processing...</p>
            ) : result.length > 0 ? (
              <div className="slides-container">
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
