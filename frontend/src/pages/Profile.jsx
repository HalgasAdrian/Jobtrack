import { useEffect, useState } from "react";
import { Card, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { FiSave, FiLock } from "react-icons/fi";
import PropTypes from "prop-types";
import { api } from "../api.js";

export default function Profile({ token }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await api.me(token);
        setProfileForm({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          username: user.username || "",
          email: user.email || "",
        });
      } catch (err) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [token]);

  function updateProfileField(key, value) {
    setProfileForm((f) => ({ ...f, [key]: value }));
  }

  function updatePasswordField(key, value) {
    setPasswordForm((f) => ({ ...f, [key]: value }));
  }

  async function handleProfileUpdate(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await api.profile.update(token, profileForm);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordUpdate(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    setSaving(true);

    try {
      await api.profile.updatePassword(token, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setSuccess("Password updated successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="container py-5 text-center text-secondary">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="container py-4 py-md-5">
      <div className="mb-4">
        <h1 className="h4 mb-1">Profile Settings</h1>
        <div className="text-secondary small">
          Manage your account information and password
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Profile Information Card */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <h2 className="h5 mb-3">Personal Information</h2>
          <Form onSubmit={handleProfileUpdate}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    value={profileForm.firstName}
                    onChange={(e) =>
                      updateProfileField("firstName", e.target.value)
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    value={profileForm.lastName}
                    onChange={(e) =>
                      updateProfileField("lastName", e.target.value)
                    }
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="g-3 mt-2">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    value={profileForm.username}
                    onChange={(e) =>
                      updateProfileField("username", e.target.value)
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={profileForm.email}
                    onChange={(e) =>
                      updateProfileField("email", e.target.value)
                    }
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="mt-4">
              <Button
                type="submit"
                disabled={saving}
                className="d-inline-flex align-items-center gap-2"
              >
                <FiSave /> {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Password Change Card */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <h2 className="h5 mb-3">Change Password</h2>
          <Form onSubmit={handlePasswordUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  updatePasswordField("currentPassword", e.target.value)
                }
                required
              />
            </Form.Group>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      updatePasswordField("newPassword", e.target.value)
                    }
                    required
                    minLength={6}
                  />
                  <Form.Text className="text-muted">
                    At least 6 characters
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      updatePasswordField("confirmPassword", e.target.value)
                    }
                    required
                    minLength={6}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="mt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={saving}
                className="d-inline-flex align-items-center gap-2"
              >
                <FiLock /> {saving ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

Profile.propTypes = {
  token: PropTypes.string.isRequired,
};
