import React, {useContext, useState} from 'react';
import UserContext from "../../context/user-context";
import {Button, Card, Form, Container, Alert} from "react-bootstrap";
import Cookies from 'universal-cookie';
import {useNavigate} from 'react-router-dom';


const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const {setUser} = useContext(UserContext);
    const handleLogin = async (event) => {
        event.preventDefault();
        const serverResponse = await fetch("http://localhost:3001/login", {
            method: "POST",
            headers: {"Content-Type":"application/json", 
                      'Accept': 'application/json'},
            mode: "cors",
            body: JSON.stringify({
                email: username,
                password: password
            })
        });

        switch(serverResponse.status){
            case 200:
                const serverJSON = await serverResponse.json();
                const cookies = new Cookies();
                cookies.set('access_token', serverJSON.token, {path: '/'});
                setUser(serverJSON.user.split('_')[0]);
                navigate("../profil", {replace: true});
                break;
            case 401:
                setError("Korisničke oznake su pogrešne! Molim pokušajte ponovno");
                break;
            case 500:
                setError("Greška servera!");
                break;
            default: 
                setError("Nepoznata greška!");
                break;

        }
    }
    return (
        <div>
            <Card style={{width: "40rem"}}>
                <Card.Header style={{backgroundColor: "black", color: "white"}}>
                    <Card.Text>PRIJAVA U APLIKACIJU</Card.Text>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email adresa: </Form.Label>
                            <Form.Control type="email" placeholder="Unesite email adresu" onChange={(e) => {
                                setUsername(e.target.value);
                            }} />
                            <Form.Text className="text-muted">
                                Vašu email adresu nikada nećemo podijeliti sa ostalim web stranicama.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Lozinka: </Form.Label>
                            <Form.Control type="password" placeholder="Unesite lozinku" onChange={(e) => {
                                setPassword(e.target.value);
                            }}/>
                        </Form.Group>

                        <Container className="d-flex justify-content-center align-items-center">
                            <Button variant="dark" type="submit">
                                Prijava
                            </Button>
                        </Container>

                        {error !== "" ? (<Alert variant="danger">{error}</Alert>) : (<div></div>)}
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Login
