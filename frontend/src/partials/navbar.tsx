import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

function UserNavbar() {
  return (
    <Navbar className="navbar-absolute">
      {/* <Navbar.Brand href="/">FitnessApp</Navbar.Brand> */}
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <NavDropdown title="Susana" id="basic-nav-dropdown">
            <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
            <NavDropdown.Item href="/history">History</NavDropdown.Item>
            <NavDropdown.Item href="/record-workout">Workout</NavDropdown.Item>
            <NavDropdown.Item href="#logout">Logout</NavDropdown.Item>
            
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default UserNavbar;