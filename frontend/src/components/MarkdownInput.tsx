// MarkdownInput Component
// This component provides a textarea input for users to enter markdown content.
// It maintains local state for the input value and notifies the parent component
// whenever the input changes through the provided `onChange` callback.

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
