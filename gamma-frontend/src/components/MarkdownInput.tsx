import { useState } from "react";

const MarkdownInput = ({ onChange }: { onChange: (value: string) => void }) => {
  const [markdown, setMarkdown] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
    onChange(e.target.value);
  };

  return (
    <textarea
      placeholder="Enter your markdown document..."
      value={markdown}
      onChange={handleChange}
    />
  );
};

export default MarkdownInput;
