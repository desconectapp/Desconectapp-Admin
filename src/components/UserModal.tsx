import { useState } from "react";
import { useNotify, useRefresh } from "react-admin";

const BASE_URL = "http://localhost:8080/admin";

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  email_validated: boolean;
  city: string;
}

interface UserModalProps {
  user: User;
  open: boolean;
  onClose: () => void;
}

export const UserModal = ({ user, open, onClose }: UserModalProps) => {
  const notify = useNotify();
  const refresh = useRefresh();
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  // admin.GET("/users/:id/password/reset", router.authController.ForgotPassword)
  // admin.GET("/users/:id/email/verify", router.authController.ValidateEmail)

  const handleAction = async (action: string) => {
    setLoading(true);

    switch (action) {
      case "validate":
        fetch(`${BASE_URL}/users/email/verify?user_id=${user.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          }
        }).then((response) => {
          if (response.ok) {
            notify(`Email validation sent to ${user.email}`, { type: "success" });
          }
        })
          .catch(() => {
            notify("Error sending email validation", { type: "error" });
          });

        break;
      case "suspend":
        notify(`User ${user.name} suspended`, { type: "warning" });
        break;
      case "delete":
        notify(`User ${user.name} deleted`, { type: "info" });
        break;
      case "reset":

        fetch(`${BASE_URL}/users/password/reset`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email }),
        }).then((response) => {
          if (response.ok) {
            notify(`Password reset sent to ${user.email}`, { type: "success" });
          }
        })
          .catch(() => {
            notify("Error sending password reset", { type: "error" });
          });

        break;
    }

    setLoading(false);
    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white border border-border rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-card-foreground">
            User Actions
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6 p-4 bg-muted rounded-lg">
          <h3 className="font-medium text-muted-foreground mb-2">
            User Details
          </h3>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-medium">Name:</span> {user.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-medium">Age:</span> {user.age}
            </p>
            <p>
              <span className="font-medium">City:</span> {user.city}
            </p>
            <p>
              <span className="font-medium">Email Validated:</span>{" "}
              <span
                className={
                  user.email_validated ? "text-green-600" : "text-red-600"
                }
              >
                {user.email_validated ? "Yes" : "No"}
              </span>
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {!user.email_validated && (
            <button
              onClick={() => handleAction("validate")}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md disabled:opacity-50 transition-colors"
            >
              {loading ? "Processing..." : "Validate Email"}
            </button>
          )}

          <button
            onClick={() => handleAction("reset")}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:opacity-50 transition-colors"
          >
            {loading ? "Processing..." : "Send Password Reset"}
          </button>

          <button
            onClick={() => handleAction("suspend")}
            disabled={loading}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md disabled:opacity-50 transition-colors"
          >
            {loading ? "Processing..." : "Suspend User"}
          </button>

          <button
            onClick={() => handleAction("delete")}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md disabled:opacity-50 transition-colors"
          >
            {loading ? "Processing..." : "Delete User"}
          </button>
        </div>
      </div>
    </div>
  );
};
