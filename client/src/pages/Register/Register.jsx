import React, {useState} from 'react';
import {Container, Form, Button, Card, Alert} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import DatePicker from 'react-date-picker';

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [date, setDate] = useState(new Date());
    const [mobitel, setMobitel] = useState("");
    const [email, setEmail] = useState("");
    const [email2, setEmail2] = useState("");
    const [lozinka, setLozinka] = useState("");
    const [lozinka2, setLozinka2] = useState("");

    const [error, setError] = useState("");

    const handleRegister = async (event) => {
        event.preventDefault();
        if(email !== email2 || lozinka !== lozinka2 || lozinka.length < 8 ){
            setError("Provjerite unesene podatke! Lozinka mora sadržavati minimalno 8 znakova!");
            return;
        }
        else{
            const serverResponse = await fetch("http://localhost:3001/register", {
                method: "POST",
                mode: "cors",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    ime_prezime: name.toLowerCase() + "_" + surname.toLowerCase(),
                    datum_rodenja: date,
                    mobitel: mobitel,
                    email: email,
                    lozinka: lozinka
                })
            })
    
            if(serverResponse.status === 200){
                setError("");
                navigate("../prijava", {replace: true});
            }
            else{
                console.log("FAILED TO REGISTER")
            }
        }
    }
    return (
        <div>
            <Card style={{width: "40rem"}}>
                <Card.Header style={{backgroundColor: "black", color: "white"}}>
                    <Card.Text>REGISTRACIJA U APLIKACIJU</Card.Text>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleRegister}>
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Ime: </Form.Label>
                            <Form.Control type="text" placeholder="Unesite Vaše ime:" onChange={(e) => {
                                setName(e.target.value);
                            }} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicSurname">
                            <Form.Label>Prezime: </Form.Label>
                            <Form.Control type="text" placeholder="Unesite Vaše prezime:" onChange={(e) => {
                                setSurname(e.target.value);
                            }} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicSurname">
                            <Form.Label className="me-2">Vaš datum rođenja:   </Form.Label>
                            <DatePicker onChange={setDate} value={date} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email adresa: </Form.Label>
                            <Form.Control type="email" placeholder="Unesite Vašu email adresu:" onChange={(e) => {
                                setEmail(e.target.value);
                            }} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail2">
                            <Form.Label>Ponovite vašu email adresu: </Form.Label>
                            <Form.Control type="email" placeholder="Ponovite vašu email adresu:" onChange={(e) => {
                                setEmail2(e.target.value);
                            }} />
                        </Form.Group>

                        {email !== email2 ? (<Form.Group className="mb-3" controlId="formBasicEmail2">
                            <Alert variant='danger'>Email adrese se ne podudaraju!</Alert>
                        </Form.Group>) : <></>}

                        <Form.Group className="mb-3" controlId="formBasicPhone">
                            <Form.Label>Mobitel: </Form.Label>
                            <Form.Control type="text" placeholder="Unesite broj mobitela" onChange={(e) => {
                                setMobitel(e.target.value);
                            }}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Lozinka: </Form.Label>
                            <Form.Control type="password" placeholder="Unesite lozinku" onChange={(e) => {
                                setLozinka(e.target.value);
                            }}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword2">
                            <Form.Label>Ponovite Vašu lozinku: </Form.Label>
                            <Form.Control type="password" placeholder="Ponovite vašu lozinku" onChange={(e) => {
                                setLozinka2(e.target.value);
                            }}/>
                        </Form.Group>

                        {lozinka !== lozinka2 ? (<Form.Group className="mb-3" controlId="formBasicEmail2">
                            <Alert variant='danger'>Lozinke se ne podudaraju!</Alert>
                        </Form.Group>) : <></>}

                        <Container className="d-flex justify-content-center align-items-center">
                            <Button variant="dark" type="submit">
                                Registracija
                            </Button>
                        </Container>
                    </Form>
                </Card.Body>
                {error !== "" ? (<Alert variant="danger">{error}</Alert>): (<></>)}
            </Card>
        </div>
    )
}

export default Register
