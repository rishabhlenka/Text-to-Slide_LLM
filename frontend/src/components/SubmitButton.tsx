// SubmitButton Component
// This component renders a button to trigger the document submission process.
// It accepts three props:
// - onSubmit: A function to be executed when the button is clicked.
// - disabled: A boolean to disable the button when necessary.
// - loading: A boolean to show a loading state during processing.

interface SubmitButtonProps {
  onSubmit: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  onSubmit,
  disabled,
  loading,
}) => {
  return (
    <button
      onClick={onSubmit}
      disabled={disabled || loading}
      className={`submit-button ${disabled || loading ? "disabled" : ""}`}
    >
      {loading ? "Processing..." : "Submit"}
    </button>
  );
};

export default SubmitButton;
