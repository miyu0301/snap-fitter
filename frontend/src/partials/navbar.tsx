import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../auth/AuthProvider';
import { FaUserCircle } from "react-icons/fa";
import { FaRunning } from "react-icons/fa";
import { BsGraphUp } from "react-icons/bs";
import { RiLogoutCircleLine } from "react-icons/ri";
import { FaUser } from "react-icons/fa6";
import { IoChatbubbleEllipsesSharp } from 'react-icons/io5';

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
          <NavDropdown className="" title={<><FaUserCircle size="2.5em" /> {props.username}</>} id="basic-nav-dropdown">
            <NavDropdown.Item href="/profile"><FaUser size="1em" /> Profile</NavDropdown.Item>
            <NavDropdown.Item href="/history"><BsGraphUp size="1em" /> History</NavDropdown.Item>
            <NavDropdown.Item href="/record-workout"><FaRunning size="1em" /> Workout</NavDropdown.Item>
            <NavDropdown.Item href="/chat"><IoChatbubbleEllipsesSharp size="1rem" /> Chat</NavDropdown.Item>
            <NavDropdown.Item onClick={handleLogout}><RiLogoutCircleLine /> Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default UserNavbar;
