import { useId, useRef, useState } from "react";

// Inline confirmation avoids blocking browser dialogs and keeps errors visible.
export default function DeleteGameButton({ title, onDelete, label = "Delete", disabled = false, onPendingChange }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const inFlight = useRef(false);
  const trigger = useRef(null);
  const messageId = useId();

  const cancel = () => {
    if (inFlight.current) return;
    setConfirming(false);
    setError("");
    trigger.current?.focus();
  };
  const confirm = async () => {
    if (inFlight.current || disabled) return;
    inFlight.current = true;
    setPending(true);
    onPendingChange?.(true);
    setError("");
    try {
      await onDelete();
      setConfirming(false);
    } catch (error) {
      setError(error.message || "Unable to delete the game. Please try again.");
    } finally {
      inFlight.current = false;
      setPending(false);
      onPendingChange?.(false);
    }
  };

  return (
    <div className="delete-game-control">
      <button ref={trigger} type="button" className="delete-game-button" disabled={disabled || pending} aria-expanded={confirming} onClick={() => setConfirming(true)}>{label}</button>
      {confirming && (
        <div className="delete-confirmation" role="group" aria-labelledby={messageId} onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); cancel(); } }}>
          <p id={messageId}>Delete "{title}"? This cannot be undone.</p>
          {error && <p role="alert" className="form-error">{error}</p>}
          <button type="button" autoFocus disabled={pending || disabled} onClick={cancel}>Cancel</button>
          <button type="button" className="delete-game-button" disabled={pending || disabled} onClick={confirm}>{pending ? "Deleting..." : "Confirm Delete"}</button>
        </div>
      )}
    </div>
  );
}
