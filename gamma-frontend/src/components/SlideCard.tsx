const SlideCard = ({ slide, index }: { slide: string; index: number }) => {
  const formattedSlide = slide.replace(/(#+\s*)([^\n])/g, "$1 $2\n");

  return (
    <div className="slide-card">
      <div className="slide-number">{index + 1}</div>
      <div className="slide-content">
        {formattedSlide.split("\n").map((line, idx) =>
          line.trim() ? (
            line.startsWith("#") ? (
              <h3 key={idx}>{line.replace(/^#+\s*/, "")}</h3>
            ) : line.startsWith("- ") || line.startsWith("* ") ? (
              <ul key={idx}>
                <li>{line.substring(2)}</li>
              </ul>
            ) : (
              <p key={idx}>{line}</p>
            )
          ) : (
            <br key={idx} />
          )
        )}
      </div>
    </div>
  );
};

export default SlideCard;
