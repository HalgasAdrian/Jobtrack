import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FiBriefcase, FiLogOut, FiUser, FiGlobe } from "react-icons/fi";
import PropTypes from "prop-types";
import "../css/Navbar.css";

export default function Topbar({ user, onLogout }) {
    const location = useLocation();
    const isLogin = location.pathname === "/login";
    const isRegister = location.pathname === "/register";

    return (
        <Navbar expand="md" className="navbar-modern sticky-top">
            <Container>
                <Navbar.Brand as={Link} to="/" className="navbar-brand-modern">
                    <FiBriefcase className="me-2" />
                    JobTrack
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-nav" />
                <Navbar.Collapse id="main-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/dashboard" end>
                            Dashboard
                        </Nav.Link>


                        <Nav.Link as={NavLink} to="/interview-hub" end>
                            <FiGlobe className="me-1" />
                            Interview Hub
                        </Nav.Link>

                        {user && (
                            <Nav.Link as={NavLink} to="/profile" end>
                                <FiUser className="me-1" />
                                Profile
                            </Nav.Link>
                        )}
                    </Nav>

                    <div className="d-flex align-items-center gap-3">
                        {user ? (
                            <>
                <span className="text-muted">
                  Welcome,{" "}
                    {user.firstName
                        ? `${user.firstName} ${user.lastName || ""}`.trim()
                        : user.username}
                </span>
                                <Button size="sm" variant="outline-danger" onClick={onLogout}>
                                    <FiLogOut className="me-1" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <div className="d-flex gap-2">
                                <Button
                                    as={Link}
                                    to="/login"
                                    size="sm"
                                    variant={isLogin ? "primary" : "outline-primary"}
                                >
                                    Login
                                </Button>
                                <Button
                                    as={Link}
                                    to="/register"
                                    size="sm"
                                    variant={isRegister ? "primary" : "outline-primary"}
                                >
                                    Register
                                </Button>
                            </div>
                        )}
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

Topbar.propTypes = {
    user: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        username: PropTypes.string,
    }),
    onLogout: PropTypes.func.isRequired,
};
