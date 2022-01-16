import React from "react";
import { Form, Container, Button } from "react-bootstrap";

const Rezije = () => {
  return (
    <div>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicStruja">
          <Form.Label>Unesite iznos struje:</Form.Label>
          <Form.Control type="number" placeholder="Unesite iznos rezija..." />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicInternet">
          <Form.Label>Unesite iznos interneta:</Form.Label>
          <Form.Control type="number" placeholder="Unesite iznos rezija..." />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPlin">
          <Form.Label>Unesite iznos plina:</Form.Label>
          <Form.Control type="number" placeholder="Unesite iznos rezija..." />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicVoda">
          <Form.Label>Unesite iznos vode:</Form.Label>
          <Form.Control type="number" placeholder="Unesite iznos rezija..." />
        </Form.Group>
        <Container className="d-flex justify-content-center align-items-center">
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Container>
      </Form>
    </div>
  );
};

export default Rezije;
