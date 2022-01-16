import React, { useState, useEffect } from "react";
import {
  Card,
  Nav,
  Container,
  Table,
  Button,
  Modal,
  Form,
  FormLabel,
} from "react-bootstrap";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import "./Profil.css";

function Profil() {
  const [odabir, setOdabir] = useState(0);
  const [podaci, setPodaci] = useState();
  const [loading, isLoading] = useState(true);
  const [dugovanja, setDugovanja] = useState();
  const [najmovi, setNajmovi] = useState();
  const [isModalOpened, setIsModalOpened] = useState(false);

  const handleNew = async (e) => {
    e.preventDefault();

    const podaci = await fetch("http://localhost:3001/rezije", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        access_token: cookies.get("access_token"),
      },
      body: {
        rezije: {
          // Trebat će dodavat nova polja na modal.
        },
        vertrag: {
          // Trebat će hvatat UUID za odabrani ugovor.
          // E da, vertrag znači ugovor. Ni ja nisam znao -_o_-
          // E da, ovo gore, ovaj abomination, to je onaj lik s ramenima
        },
      },
    });
  };

  const navigate = useNavigate();
  const cookies = new Cookies();

  async function dohvatiPodatke() {
    const podaci = await fetch("http://localhost:3001/korisnik", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        access_token: cookies.get("access_token"),
      },
    });
    const podaci2 = await fetch("http://localhost:3001/ugovori/dugovanja", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        access_token: cookies.get("access_token"),
      },
    });
    const podaci3 = await fetch("http://localhost:3001/ugovori/najmovi", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        access_token: cookies.get("access_token"),
      },
    });
    switch (podaci3.status) {
      case 200:
        const response = await podaci.json();
        const response2 = await podaci2.json();
        const response3 = await podaci3.json();
        response.ime = response.ime_prezime.split("_")[0].toUpperCase();
        response.prezime = response.ime_prezime.split("_")[1].toUpperCase();
        response.datum = response.datum_rodenja.split("T")[0];
        setPodaci(response);
        setDugovanja(response2);
        setNajmovi(response3);
        isLoading(false);
        break;
      default:
        navigate("../prijava", { replace: true });
        break;
    }
  }
  const ProfilComponent = () => {
    return (
      <Card>
        <Card.Header style={{ backgroundColor: "black", color: "white" }}>
          <Card.Text>MOJ PROFIL</Card.Text>
        </Card.Header>
        <Card.Body>
          <Card.Title>Ime: {podaci.ime}</Card.Title>
          <Card.Title>Prezime: {podaci.prezime}</Card.Title>
          <Card.Text>Datum Rođenja: {podaci.datum}</Card.Text>
          <Card.Text>Mobitel: {podaci.mobitel}</Card.Text>
          <Card.Text>Email: {podaci.email}</Card.Text>
        </Card.Body>
      </Card>
    );
  };

  const DugovanjaComponent = () => {
    return (
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>#</th>
            <th>Adresa objekta</th>
            <th>Postanski broj</th>
            <th>Vrsta objekta</th>
            <th>Vlasnik</th>
            <th>Kontakt vlasnika</th>
            <th>Cijena najma</th>
          </tr>
        </thead>
        <tbody>
          {dugovanja.map((dug, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{dug.adresa}</td>
                <td>{dug.postanski_broj}</td>
                <td>{dug.naziv}</td>
                <td>
                  {dug.ime_prezime.split("_")[0].toUpperCase() +
                    " " +
                    dug.ime_prezime.split("_")[1].toUpperCase()}
                </td>
                <td>{dug.email}</td>
                <td>{dug.cijena}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  };

  const IzdaniUgovoriComponent = () => {
    return (
      <>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>#</th>
              <th>Adresa objekta</th>
              <th>Postanski broj</th>
              <th>Vrsta objekta</th>
              <th>Vlasnik</th>
              <th>Kontakt vlasnika</th>
              <th>Cijena najma</th>
              <th>Unos režija</th>
            </tr>
          </thead>
          <tbody>
            {najmovi.map((dug, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{dug.adresa}</td>
                  <td>{dug.postanski_broj}</td>
                  <td>{dug.naziv}</td>
                  <td>
                    {dug.ime_prezime.split("_")[0].toUpperCase() +
                      " " +
                      dug.ime_prezime.split("_")[1].toUpperCase()}
                  </td>
                  <td>{dug.email}</td>
                  <td>{dug.cijena}</td>
                  <td>
                    <Button onClick={() => setIsModalOpened((value) => !value)}>
                      Unos režija
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <Modal
          show={isModalOpened}
          onHide={() => setIsModalOpened((value) => !value)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Unos režija</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form onSubmit={handleNew}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Unos iznosa:</Form.Label>
                <Form.Control type="number" placeholder="3123" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary">Save changes</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  useEffect(() => {
    dohvatiPodatke();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading === false ? (
        <Container>
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link
                style={{ color: odabir === 0 ? "blue" : "black" }}
                onClick={() => setOdabir(0)}
              >
                Moji podaci
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                style={{ color: odabir === 1 ? "blue" : "black" }}
                onClick={() => setOdabir(1)}
              >
                Moja dugovanja
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                style={{ color: odabir === 2 ? "blue" : "black" }}
                onClick={() => setOdabir(2)}
              >
                Moji objekti
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Container>
            {odabir === 0 ? (
              <ProfilComponent />
            ) : odabir === 1 ? (
              <DugovanjaComponent />
            ) : (
              <IzdaniUgovoriComponent />
            )}
          </Container>
        </Container>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}

export default Profil;
