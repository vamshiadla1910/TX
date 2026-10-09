export default function TeamsNotification({ notification }) {
  if (!notification) return null;

  return (
    <div
      style={{
        margin: "0 10px 16px",
        padding: "10px 16px",
        background: "#ecfdf5",
        border: "1px solid #a7f3d0",
        borderRadius: "8px",
        color: "#065f46",
        fontSize: "14px",
        fontWeight: 600
      }}
    >
      ✓ {notification}
    </div>
  );
}
