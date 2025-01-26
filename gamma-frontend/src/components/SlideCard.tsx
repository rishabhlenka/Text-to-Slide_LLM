const SlideCard = ({ slide, index }: { slide: string; index: number }) => {
  return (
    <div className="slide-card">
      <div className="slide-number">{index + 1}</div>
      <div className="slide-content">
        <strong>{slide.split("\n")[0]}</strong>
        <p>
          {slide
            .split("\n")
            .slice(1)
            .map((line, idx) => (
              <span key={idx}>
                {line}
                <br />
              </span>
            ))}
        </p>
      </div>
    </div>
  );
};

export default SlideCard;
