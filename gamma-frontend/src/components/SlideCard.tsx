const SlideCard = ({ slide, index }: { slide: string; index: number }) => {
  return (
    <div className="slide-card">
      <div className="slide-number">{index + 1}</div>
      <div className="slide-content">
        <strong>{slide.split("\n")[0]}</strong>

        <div>
          {slide
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

export default SlideCard;
