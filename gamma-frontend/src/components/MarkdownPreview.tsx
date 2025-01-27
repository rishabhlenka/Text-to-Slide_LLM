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
