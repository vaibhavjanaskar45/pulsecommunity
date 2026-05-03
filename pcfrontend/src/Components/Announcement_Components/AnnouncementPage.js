import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Form, Container, Row, Col } from "react-bootstrap";

const AnnouncementPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({ id: null, title: "", message: "" });
  const [isEditing, setIsEditing] = useState(false);

  const API_URL = "http://localhost:8080/api/announcements";

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(API_URL);
      setAnnouncements(response.data);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${form.id}`, form);
      } else {
        await axios.post(API_URL, form);
      }
      fetchAnnouncements();
      resetForm();
    } catch (err) {
      console.error("Error saving announcement:", err);
    }
  };

  const handleEdit = (announcement) => {
    setForm(announcement);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchAnnouncements();
    } catch (err) {
      console.error("Error deleting announcement:", err);
    }
  };

  const resetForm = () => {
    setForm({ id: null, title: "", message: "" });
    setIsEditing(false);
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">📢 Manage Announcements</h2>

      {/* Form */}
      <Card className="shadow-sm mb-5">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter announcement title"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label>Content</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write announcement details"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={12} className="d-flex justify-content-end mt-3">
                <Button type="submit" variant="primary" className="me-2">
                  {isEditing ? "Update Announcement" : "Create Announcement"}
                </Button>
                {isEditing && (
                  <Button variant="secondary" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Announcements List */}
      <Row>
        {announcements.length === 0 ? (
          <p className="text-center text-muted">No announcements found.</p>
        ) : (
          announcements.map((ann) => (
            <Col md={6} key={ann.id} className="mb-4">
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title className="fw-bold text-primary">
                    {ann.title}
                  </Card.Title>
                  
                  <Card.Text>{ann.message}</Card.Text>
                  <div className="d-flex justify-content-end">
                    <Button
                      variant="primary"
                      className="me-2 text-white"
                      onClick={() => handleEdit(ann)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(ann.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default AnnouncementPage;
