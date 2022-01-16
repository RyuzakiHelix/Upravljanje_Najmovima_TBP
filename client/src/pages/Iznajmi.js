import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  FormGroup,
  FormLabel as Label,
  FormControl as Input,
  Alert,
  Card,
  Container,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

function Iznajmi() {
  const [adresa, setAdresa] = useState("");
  const [postanski_broj, setPostanski_broj] = useState("");
  const [vrsta_objekta, setVrsta_objekta] = useState("");
  const [cijena, setCijena] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const cookies = new Cookies();

  const postData = () => {
    console.log(adresa);
    console.log(postanski_broj);
    console.log(vrsta_objekta);
  };

  const spremiPodatke = async (event) => {
    event.preventDefault();
    const serverResponse = await fetch("http://localhost:3001/objekt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        access_token: cookies.get("access_token"),
      },
      mode: "cors",
      body: JSON.stringify({
        adresa,
        postanski_broj,
        vrsta_objekta,
        cijena,
      }),
    });

    if (serverResponse.status === 200) {
      navigate("../profil", { replace: true });
      return;
    }
    if (serverResponse.status === 401) {
      setError("Korisničke oznake su pogrešne! Molim pokušajte ponovno");
      return;
    }
    if (serverResponse.status === 500) {
      setError("Greška servera!");
      return;
    } else {
      setError("Nepoznata greška!");
      return;
    }
  };

  return (
    <div>
      <Card style={{ width: "40rem" }}>
        <Card.Header style={{ backgroundColor: "black", color: "white" }}>
          <Card.Text>IZNAJMITE POSJED</Card.Text>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={spremiPodatke}>
            <FormGroup className="mb-3">
              <Label>Adresa</Label>
              <Input
                type="text"
                name="adresa"
                id="adresa"
                onChange={(e) => setAdresa(e.target.value)}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Label>Postanski Broj</Label>
              <Input
                type="text"
                name="postanski_broj"
                id="postanski_broj"
                onChange={(e) => setPostanski_broj(e.target.value)}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Label>Cijena</Label>
              <Input
                type="text"
                name="cijena"
                id="cijena"
                onChange={(e) => setCijena(e.target.value)}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Label>Vrsta Objekta</Label>
              <Form.Select
                aria-label="Default select example"
                name="vrsta_objekta"
                id="vrsta_objekta"
                onChange={(e) => setVrsta_objekta(e.target.value)}
              >
                <option>Vrsta Objekta</option>
                <option value="1">Stan</option>
                <option value="2">Kuća</option>
                <option value="3">Apartman</option>
                <option value="4">Soba</option>
              </Form.Select>
            </FormGroup>

            <Container className="d-flex justify-content-center align-items-center">
              <Button variant="dark" type="submit">
                Objaviti
              </Button>
            </Container>

            {error !== "" ? (
              <Alert variant="danger">{error}</Alert>
            ) : (
              <div></div>
            )}
          </Form>
        </Card.Body>
        {error !== "" ? <Alert variant="danger">{error}</Alert> : <></>}
      </Card>
    </div>
  );
}

export default Iznajmi;
