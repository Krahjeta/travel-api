import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { Container, Table, Button, Form, Row, Col , Modal} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
    const [destinacionet, setDestinacioni] = useState([]);
    const [form, setForm] = useState({ emri: '', pershkrimi: '', qmimi: ''});
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        loadDestinacioni();
    }, []);

    const loadDestinacioni = async () => {
        const res = await axios.get('http://localhost:3306/destinacioni');
        setDestinacioni(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:3306/destinacioni', form);
        loadDestinacioni();
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:3306/destinacioni/${id}`);
        loadDestinacionet();
      };

    const handleEdit = (dest) => {
        setEditId(dest.id);
        setForm({emri: dest.emri, pershkrimi: dest.pershkrimi, qmimi: dest.qmimi});
        setShowModal(true);
    };

    const handleUpdate = async () => {
        await axios.put(`http://localhost:3306/destinacioni/${editId}`, form);
        setShowModal(false);
        setEditId(null);
        loadDestinacioni();
    };

    return (
        <Container className="mt-5">
        <h2 className="text-center mb-4">Dashboard i Adminëve</h2>
  
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col><Form.Control placeholder="Emri" name="emri" value={form.emri} onChange={handleChange} /></Col>
            <Col><Form.Control placeholder="Pershkrimi" name="pershkrimi" value={form.pershkrimi} onChange={handleChange} /></Col>
            <Col><Form.Control type="number" placeholder="Qmimi" name="qmimi" value={form.qmimi} onChange={handleChange} /></Col>
            <Col><Button type="submit">Shto Destinacion</Button></Col>
          </Row>
        </Form>
  
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Emri</th>
              <th>Pershkrimi</th>
              <th>Qmimi</th>
              <th>Veprime</th>
            </tr>
          </thead>
          <tbody>
            {destinacionet.map(dest => (
              <tr key={dest.id}>
                <td>{dest.id}</td>
                <td>{dest.emri}</td>
                <td>{dest.pershkrimi}</td>
                <td>{dest.qmimi}€</td>
                <td>
                  <Button variant="warning" size="sm" onClick={() => handleEdit(dest)}>Edito</Button>{' '}
                  <Button variant="danger" size="sm" onClick={() => handleDelete(dest.id)}>Fshij</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
  
        {/* Modal për Edit */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edito Destinacionin</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Emri</Form.Label>
                <Form.Control name="emri" value={form.emri} onChange={handleChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Pershkrimi</Form.Label>
                <Form.Control name="pershkrimi" value={form.pershkrimi} onChange={handleChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Qmimi</Form.Label>
                <Form.Control type="number" name="qmimi" value={form.qmimi} onChange={handleChange} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Anulo</Button>
            <Button variant="primary" onClick={handleUpdate}>Ruaj Ndryshimet</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
};

export default AdminDashboard;