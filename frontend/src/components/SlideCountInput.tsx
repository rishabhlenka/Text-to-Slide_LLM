// SlideCountInput Component
// This component provides an input field for the user to specify the desired number of slides.
// It accepts values between 1 and 50 and calls the onChange function with the selected value.

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
