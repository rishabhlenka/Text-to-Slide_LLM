const SlideCountInput = ({
  onChange,
}: {
  onChange: (value: number) => void;
}) => {
  return (
    <input
      type="number"
      min="1"
      max="50"
      placeholder="Enter number of slides"
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full p-2 border border-gray-300 rounded"
    />
  );
};

export default SlideCountInput;
