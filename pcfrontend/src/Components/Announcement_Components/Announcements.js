import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Spinner, Container, Row, Col } from "react-bootstrap";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/announcements")
      .then((res) => setAnnouncements(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">📢 Latest Announcements</h2>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p>Loading announcements...</p>
        </div>
      ) : announcements.length === 0 ? (
        <p className="text-center text-muted">No announcements available</p>
      ) : (
        <Row>
          {announcements.map((a) => (
            <Col md={6} lg={4} key={a.id} className="mb-4">
              <Card className="shadow-sm border-0 h-100">
                <Card.Body>
                  <Card.Title className="fw-bold text-primary">
                    {a.title}
                  </Card.Title>
                  <Card.Text>{a.message || a.content}</Card.Text>
                  <Card.Footer className="bg-transparent border-0 text-muted small mt-3">
                    Updated on:{" "}
                    {new Date(a.updatedAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </Card.Footer>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Announcements;
