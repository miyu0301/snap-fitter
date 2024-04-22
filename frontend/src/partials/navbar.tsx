import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { useAuth } from '../auth/AuthProvider';
import { FaUserCircle } from "react-icons/fa";
import { FaRunning } from "react-icons/fa";
import { BsGraphUp } from "react-icons/bs";
import { RiLogoutCircleLine } from "react-icons/ri";
import { FaUser } from "react-icons/fa6";
import { IoChatbubbleEllipsesSharp } from 'react-icons/io5';
import logo from '../assets/images/logo_v2.png';

function UserNavbar(props: any) {
  const auth = useAuth();

  const handleLogout = () => {
    auth.logout();
  };

  return (
    // <Navbar className="navbar-absolute">
    //   {/* <Navbar.Brand href="/">FitnessApp</Navbar.Brand> */}
    //   <Navbar.Toggle aria-controls="basic-navbar-nav" />
    //   <Navbar.Collapse id="basic-navbar-nav">
    //     <Nav className="ml-auto">
    //       <NavDropdown title={<><span><FaUserCircle size="2.5em" className="navIcon" /></span><span> {props.username}</span></>} id="basic-nav-dropdown">
    //         <NavDropdown.Item href="/profile"><FaUser className="navIcon" size="1.4em" /> Profile</NavDropdown.Item>
    //         <NavDropdown.Item href="/history"><BsGraphUp className="navIcon" size="1.3em" /> History</NavDropdown.Item>
    //         <NavDropdown.Item href="/record-workout"><FaRunning className="navIcon" size="1.5em" /> Workout</NavDropdown.Item>
    //         <NavDropdown.Item href="/chat"><IoChatbubbleEllipsesSharp className="navIcon" size="1.4rem" /> Chat</NavDropdown.Item>
    //         <NavDropdown.Item onClick={handleLogout}><RiLogoutCircleLine className="navIcon" size="1.4rem" /> Logout</NavDropdown.Item>
    //       </NavDropdown>
    //     </Nav>
    //   </Navbar.Collapse>
    // </Navbar>

<Navbar expand="lg" className="bg-white" sticky="top">
      <Container>
        <Navbar.Brand href="/welcome"><img src={logo} width={100} alt='Logo of the app' /></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
          <Nav>            
            <NavDropdown title={<><span><FaUserCircle size="2.5em" className="navIcon" /></span><span> {props.username}</span></>} id="basic-nav-dropdown">
            <NavDropdown.Item href="/profile"><FaUser className="navIcon" size="1.4em" /> Profile</NavDropdown.Item>
            <NavDropdown.Item href="/history"><BsGraphUp className="navIcon" size="1.3em" /> History</NavDropdown.Item>
            <NavDropdown.Item href="/record-workout"><FaRunning className="navIcon" size="1.5em" /> Workout</NavDropdown.Item>
            <NavDropdown.Item href="/chat"><IoChatbubbleEllipsesSharp className="navIcon" size="1.4rem" /> Chat</NavDropdown.Item>
            <NavDropdown.Item onClick={handleLogout}><RiLogoutCircleLine className="navIcon" size="1.4rem" /> Logout</NavDropdown.Item>
           </NavDropdown>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>    
  );
}

export default UserNavbar;
