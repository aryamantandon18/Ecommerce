import React from 'react';
import { Modal, ModalHeader, ModalBody, Button, Container, Col, Row,ModalFooter } from "reactstrap";

const EditSampleModal = ({ toggleEditModal, isOpen, rowData }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggleEditModal} size="lg">
      <ModalHeader toggle={toggleEditModal}>{rowData?.Title}</ModalHeader>
      <ModalBody>
        {rowData && (
          <Container fluid>
            <Row className="mb-3">
              <Col md="2">
                <h5>Title:</h5>
              </Col>
              <Col md="10">
                <p>{rowData.Title}</p>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md="2">
                <h5>Price:</h5>
              </Col>
              <Col md="10">
                <p>{rowData.Price}</p>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md="2">
                <h5>Description:</h5>
              </Col>
              <Col md="10">
                <p>{rowData.Description}</p>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md="2">
                <h5>Images:</h5>
              </Col>
              <Col md="10">
                <div>
                  {rowData.Images && rowData.Images.map((image, index) => (
                    <img key={index} src={image.src} alt={`image-${index}`} style={{ width: "100px", marginRight: "10px" }} />
                  ))}
                </div>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md="2">
                <h5>Videos:</h5>
              </Col>
              <Col md="10">
                <div>
                  {rowData.Videos && rowData.Videos.map((video, index) => (
                    <div key={index} style={{ marginBottom: "10px" }}>
                      <video width="100%" height="auto" controls>
                        <source src={video.src} type="video/mp4" />
                      </video>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          </Container>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggleEditModal}>Close</Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditSampleModal;
