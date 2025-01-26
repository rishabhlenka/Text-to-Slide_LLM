const SubmitButton = ({ onSubmit }: { onSubmit: () => void }) => {
  return (
    <button
      onClick={onSubmit}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Generate Slides
    </button>
  );
};

export default SubmitButton;
