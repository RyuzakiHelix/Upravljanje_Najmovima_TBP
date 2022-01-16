import React, { useState, useEffect } from "react";
import {
  Card,
  Nav,
  Container,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  ListGroup,
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
  const [currentObject, setCurrentObject] = useState();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

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
  const openUnosRezije = (id_objekt) => {
    handleShow();
    setCurrentObject(id_objekt);
  };

  const AddRezije = () => {
    const [struja, setStruja] = useState();
    const [plin, setPlin] = useState();
    const [voda, setVoda] = useState();
    const [internet, setInternet] = useState();

    const [error, setError] = useState("");

    const submitRezije = async () => {
      if (
        struja !== undefined &&
        plin !== undefined &&
        voda !== undefined &&
        internet !== undefined
      ) {
        const serverResponse = await fetch("http://localhost:3001/rezije", {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            access_token: cookies.get("access_token"),
          },
          body: JSON.stringify({
            idObjekta: currentObject,
            rezije: {
              struja,
              plin,
              voda,
              internet,
            },
          }),
        });
        switch (serverResponse.status) {
          case 200:
            handleClose();
            setStruja(0);
            setPlin(0);
            setInternet(0);
            setVoda(0);
            setError("");
            break;
          default:
            setError("Greska servera!");
            break;
        }
      } else {
        setError("Molim Vas unesite sve podatke!");
      }
    };
    return (
      <Form>
        {error !== "" ? <Alert variant="danger">{error}</Alert> : <></>}
        <Form.Group className="mb-3" controlId="formBasicStruja">
          <Form.Label>Unesite iznos struje:</Form.Label>
          <Form.Control
            onChange={(e) => setStruja(e.target.value)}
            type="number"
            placeholder="Unesite iznos rezija..."
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicInternet">
          <Form.Label>Unesite iznos interneta:</Form.Label>
          <Form.Control
            onChange={(e) => setInternet(e.target.value)}
            type="number"
            placeholder="Unesite iznos rezija..."
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPlin">
          <Form.Label>Unesite iznos plina:</Form.Label>
          <Form.Control
            onChange={(e) => setPlin(e.target.value)}
            type="number"
            placeholder="Unesite iznos rezija..."
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicVoda">
          <Form.Label>Unesite iznos vode:</Form.Label>
          <Form.Control
            onChange={(e) => setVoda(e.target.value)}
            type="number"
            placeholder="Unesite iznos rezija..."
          />
        </Form.Group>
        <Container className="d-flex justify-content-start align-items-center">
          <Button variant="primary" onClick={() => submitRezije()}>
            Submit
          </Button>
        </Container>
      </Form>
    );
  };
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

  const PrikazRezija = () => {
    const [allRezije, setAllRezije] = useState([]);
    const getRezijeForObject = async () => {
      const serverResponse = await fetch(
        "http://localhost:3001/dohvati/rezije",
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            access_token: cookies.get("access_token"),
          },
          body: JSON.stringify({
            id_ugovor: currentObject,
          }),
        }
      );
      switch (serverResponse.status) {
        case 200:
          const allRezije2 = await serverResponse.json();
          setAllRezije(allRezije2);
          break;
        default:
          break;
      }
    };

    useEffect(() => {
      getRezijeForObject();
    }, []);

    return (
      <>
        {allRezije.length !== 0 ? (
          allRezije.map((rezija, index) => {
            return (
              <>
                <Card key={index} style={{ width: "18rem" }}>
                  <Card.Header>{rezija.podaci.datum}</Card.Header>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      {"Struja iznosi: " + rezija.podaci.rezije.struja + " HRK"}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      {"Internet iznosi: " +
                        rezija.podaci.rezije.internet +
                        " HRK"}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      {"Voda iznosi: " + rezija.podaci.rezije.voda + " HRK"}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      {"Plin iznosi: " + rezija.podaci.rezije.plin + " HRK"}
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
                <hr></hr>
              </>
            );
          })
        ) : (
          <Alert variant="success">Ne postoje dugovanja za ovaj objekt!</Alert>
        )}
      </>
    );
  };

  const openRezije = (id_objekt) => {
    setCurrentObject(id_objekt);
    handleShow2();
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
              <tr key={index} onClick={() => openRezije(dug.id_ugovor)}>
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
                    <Button onClick={() => openUnosRezije(dug.id_ugovor)}>
                      Unos režija
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
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
              <>
                <IzdaniUgovoriComponent />
              </>
            )}
          </Container>
        </Container>
      ) : (
        <div>Loading...</div>
      )}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Unos rezija: </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddRezije />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Odustani
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>Prikaz rezija </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PrikazRezija />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Odustani
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Profil;
