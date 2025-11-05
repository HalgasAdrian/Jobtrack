import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FiBriefcase, FiLogOut } from "react-icons/fi";

export default function Topbar({ user, onLogout }) {
   const location = useLocation();
   const isLogin = location.pathname === "/login";
   const isRegister = location.pathname === "/register";
   return (
      <Navbar
         expand='md'
         bg='body-tertiary'
         className='border-bottom sticky-top'
      >
         <Container>
            <Navbar.Brand
               as={Link}
               to='/'
               className='d-flex align-items-center gap-2 fw-semibold'
            >
               <FiBriefcase /> JobTrack
            </Navbar.Brand>
            <Navbar.Toggle aria-controls='main-nav' />
            <Navbar.Collapse id='main-nav'>
               <Nav className='me-auto'>
                  <Nav.Link as={NavLink} to='/dashboard' end>
                     Dashboard
                  </Nav.Link>
               </Nav>
               <div className='d-flex align-items-center gap-3'>
                  {user ? (
                     <>
                        <span className='text-secondary small'>
                           {user.firstName
                              ? `${user.firstName} ${
                                   user.lastName || ""
                                }`.trim()
                              : user.username}
                        </span>
                        <Button
                           size='sm'
                           variant='outline-secondary'
                           onClick={onLogout}
                           className='d-inline-flex align-items-center gap-2'
                        >
                           <FiLogOut /> Logout
                        </Button>
                     </>
                  ) : (
                     <div className='btn-group'>
                        <Button
                           as={Link}
                           to='/login'
                           size='sm'
                           variant={isLogin ? "primary" : "outline-primary"}
                        >
                           Login
                        </Button>
                        <Button
                           as={Link}
                           to='/register'
                           size='sm'
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
