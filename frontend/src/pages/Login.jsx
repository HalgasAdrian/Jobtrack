// src/components/Login.jsx
import { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiBriefcase } from "react-icons/fi";
import PropTypes from "prop-types";
import { api } from "../api.js";
import "../css/Login.css";

export default function Login({ onLogin }) {
    const navigate = useNavigate();
    const [identifer, setIdentifer] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await api.login({ identifer, password });
            const token = res.token;
            if (!token) {
                setError("No token returned from server");
                setLoading(false);
                return;
            }

            // inform app about token
            onLogin(token);

            // fetch user profile to save email locally (used for ownership checks)
            try {
                const user = await api.me(token);
                if (user && user.email) {
                    localStorage.setItem("userEmail", user.email);
                }
            } catch (meErr) {
                console.warn("Could not fetch 'me' after login:", meErr);
            }

            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="text-center mb-4">
                        <div className="login-hero">
                            <FiBriefcase />
                        </div>
                        <h1 className="login-title">Welcome back</h1>
                        <p className="login-subtitle">
                            Sign in to continue tracking your applications
                        </p>
                    </div>

                    <Card className="card-modern">
                        <Card.Body className="p-4">
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit} className="form-modern">
                                <Form.Group className="mb-3">
                                    <Form.Label>Email or Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={identifer}
                                        onChange={(e) => setIdentifer(e.target.value)}
                                        placeholder="e.g. jdoe or jdoe@example.com"
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Button
                                    type="submit"
                                    className="btn-modern btn-primary-modern w-100"
                                    disabled={loading}
                                >
                                    {loading ? "Signing in…" : "Sign in"}
                                </Button>
                            </Form>
                            <p className="text-center mt-3 mb-0">
                                New here? <Link to="/register">Create an account</Link>
                            </p>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    );
}

Login.propTypes = {
    onLogin: PropTypes.func.isRequired,
};
