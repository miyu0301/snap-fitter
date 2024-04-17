import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../auth/AuthProvider';
import { FaRegUser } from "react-icons/fa6";

function UserNavbar(props: any) {
  const auth = useAuth();

  const handleLogout = () => {
    auth.logout();
  };

  return (
    <Navbar className="navbar-absolute">
      {/* <Navbar.Brand href="/">FitnessApp</Navbar.Brand> */}
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <NavDropdown title={<><FaRegUser size="1.5em" /> {props.username}</>} id="basic-nav-dropdown">
            <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
            <NavDropdown.Item href="/history">History</NavDropdown.Item>
            <NavDropdown.Item href="/record-workout">Workout</NavDropdown.Item>
            <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default UserNavbar;
