import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function UserNavbar() {
  return (
    <Navbar className="navbar-absolute">
      <Container>
       
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <a href="#login">Sara Tancred</a> | <a href="/">Home</a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default UserNavbar;