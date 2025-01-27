// MarkdownPreview Component
// This component takes a markdown string as input and renders it as formatted content.
// It displays the first line of the markdown in bold to serve as a title/header.
// Subsequent lines are processed and displayed as either paragraphs or list items,
// depending on whether they start with a bullet point (e.g., "- " or "* ").
// Empty lines are rendered as line breaks to preserve spacing in the content.

const MarkdownPreview = ({ markdown }: { markdown: string }) => {
  return (
    <div className="slide-card">
      <div className="slide-content">
        <strong>{markdown.split("\n")[0]}</strong>

        <div>
          {markdown
            .split("\n")
            .slice(1)
            .map((line, idx) =>
              line.trim() ? (
                <p key={idx}>
                  {line.startsWith("- ") || line.startsWith("* ") ? (
                    <li>{line.substring(2)}</li>
                  ) : (
                    line
                  )}
                </p>
              ) : (
                <br key={idx} />
              )
            )}
        </div>
      </div>
    </div>
  );
};

export default MarkdownPreview;
