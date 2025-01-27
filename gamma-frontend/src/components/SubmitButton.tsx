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
