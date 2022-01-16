import React, {useContext} from 'react'
import UserContext from '../../context/user-context';
import {Routes, Link, Route, useNavigate} from "react-router-dom";
import {Nav, Navbar, Container, Button} from "react-bootstrap";
import Iznajmi from "../../pages/Iznajmi";
import Profil from "../../pages/Profil";
import Login from "../../pages/Login/Login";
import RentLogo from "../../assets/images/rent_logo.png";
import "./Layout.css";
import Register from '../../pages/Register/Register';
import Objekti from '../../pages/Objekti/Objekti';
import Rezije from '../../pages/Rezije';
import Cookies from 'universal-cookie';

const Layout = () => {
    const {user, setUser} = useContext(UserContext);
    const cookies = new Cookies();
    const handleLogOut = async () => {
        setUser("");
        cookies.remove('access_token', {path: '/', domain:"localhost"});
    }
    const navigate = useNavigate();
    return (
        <>
        <div>
            {user === undefined || user === "" ? <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand>
                        <img 
                        alt="Rent-manager"
                        src={RentLogo}
                        width="70"
                        height="70"
                        className="d-inline-block align-top"/>
                    </Navbar.Brand> 
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/prijava">Prijava</Nav.Link>
                        <Nav.Link as={Link} to="/registracija">Registracija</Nav.Link>
                    </Nav>
                </Container>
            </Navbar> : <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand>
                        <img 
                        alt="Rent-manager"
                        src={RentLogo}
                        width="70"
                        height="70"
                        className="d-inline-block align-top"/>
                    </Navbar.Brand> 
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/iznajmi">Najmovi</Nav.Link>
                        <Nav.Link as={Link} to="/profil">Profil</Nav.Link>
                        <Nav.Link as={Link} to="/objekti">Objekti</Nav.Link>
                    </Nav>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            Prijavljeni ste kao: <span className="text-primary">{user}</span>
                        </Navbar.Text>
                        <Button onClick={() => {handleLogOut();  navigate("../prijava", {replace: true})}} className="m-3" variant="warning">
                            Odjavite se
                        </Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar> }
        </div>
        <div className="m-5">
            <Container>
                <Routes>
                    <Route path="/iznajmi" element={<Iznajmi />} />
                    <Route path="/profil" element={<Profil />} />
                    <Route path="/prijava" element={<Login />} />
                    <Route path="/registracija" element={<Register />} />
                    <Route path="/objekti" element={<Objekti />} />
                    <Route path="/rezije" element={<Rezije />} />
                </Routes>
            </Container>
        </div>
        <div className='Footer'>
            <Navbar bg="dark" variant="dark">
                <Container className="d-flex justify-content-center align-items-center">
                    <p>Copyright &copy;2022</p>
                </Container>
            </Navbar>
        </div>
    </>
    )
}

export default Layout

