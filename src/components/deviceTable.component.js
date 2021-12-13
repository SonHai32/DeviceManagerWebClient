import React, { useState } from "react";
import {
  Form,
  Table,
  Container,
  Row,
  Col,
  Button,
  Modal,
  Spinner,
  FormControl,
  FormGroup,
  FormLabel,
} from "react-bootstrap";
import { connect } from "redux-zero/react";
import deviceAction from "../actions/device.action";
import { devConfig } from "../dev.config";
import Device from "../models/Device.model";

const mapToProp = ({ deviceList, loading, hasError, errorMessage }) => ({
  deviceList,
  loading,
  hasError,
  errorMessage,
});

export default connect(
  mapToProp,
  deviceAction
)(
  ({
    deviceList,
    loading,
    hasError,
    errorMessage,
    clearError,
    createDevice,
    createDeviceSuccess,
    createDeviceFail,
    updateDevice,
    updateDeviceSuccess,
    updateDeviceFail,
    deleteDevice,
    deleteDeviceSuccess,
    deleteDeviceFail,
  }) => {
    const [editModalShow, setEditModalShow] = useState(false);
    const [deviceId, setDeviceId] = useState("");
    const [deviceName, setDeviceName] = useState("");
    const [deviceQuantity, setDeviceQuantity] = useState("");
    const [devicePrice, setDevicePrice] = useState("");
    const [validated, setValidated] = useState(false);

    const handleEditModal = (data, state) => {
      setEditModalShow(state);

      if (data) {
        setDeviceId(data.deviceId);
        setDeviceName(data.deviceName);
        setDeviceQuantity(data.deviceQuantity);
        setDevicePrice(data.devicePrice);
      } else {
        setDeviceId("");
        setDeviceName("");
        setDeviceQuantity("");
        setDevicePrice("");
      }
    };

    const handleDelete = (id) => {
      deleteDevice();
      fetch(devConfig.API_URL + "/Delete", {
        method: "DELETE",
        body: JSON.stringify([id]),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(async (res) => {
          deleteDeviceSuccess();
        })
        .catch((err) => {
          deleteDeviceFail(err.message);
        });
    };

    const handleSubmit = (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      setValidated(true);

      const dv = new Device(deviceId, deviceName, devicePrice, deviceQuantity);
      if (dv.deviceId) {
        updateDevice();
        updateDeviceSubmit(dv)
          .then((res) => {
            updateDeviceSuccess();
          })
          .catch((err) => updateDeviceFail(err.message));
      } else {
        createDevice();
        createDeviceSubmit(dv)
          .then((res) => {
            if ((res === 200) || (res === 201)) {
              createDeviceSuccess();
            } else {
              createDeviceFail("Cant not craete new device");
            }
          })
          .catch((err) => createDeviceFail(err.message));
      }
    };

    const updateDeviceSubmit = (dv) => {
      return new Promise((reslove, reject) => {
        fetch(devConfig.API_URL + "/Update", {
          method: "PUT",
          body: JSON.stringify(dv),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then(async (res) => reslove(await res.text()))
          .catch((err) => reject(err));
      });
    };

    const createDeviceSubmit = (dv) => {
      return new Promise((reslove, reject) => {
        fetch(devConfig.API_URL + "/AddNew", {
          method: "POST",
          body: JSON.stringify({
            deviceName: dv.deviceName,
            deviceQuantity: dv.deviceQuantity,
            devicePrice: dv.devicePrice,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => {
            console.log(res);
            reslove(res.status);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    };

    const itemRender = (item, key, index) => {
      return (
        <tr key={key}>
          <th scope="row">{index + 1}</th>
          <td>{item.deviceId}</td>
          <td>{item.deviceName}</td>
          <td>{item.deviceAmount}</td>
          <td>
            <div className="d-flex align-items-center w-100 justify-content-center">
              <Button
                onClick={() => handleEditModal(item, true)}
                variant="warning"
                className="mx-1"
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(item.deviceId)}
                variant="danger"
                className="mx-1"
              >
                Delete
              </Button>
            </div>
          </td>
        </tr>
      );
    };

    return (
      <div className="App py-4">
        <Container fluid className="mt-5">
          <Row className="justify-content-center align-items-center h-100">
            <Col xl={8} lg={10} md={11}>
              <h2 className="text-info"> DEVICE LIST </h2>
            </Col>
            <Col
              xl={8}
              lg={10}
              md={11}
              className="d-flex justify-content-end py-2"
            >
              <Button
                variant="primary"
                onClick={() => handleEditModal(null, true)}
              >
                ADD NEW DEVICE
              </Button>
            </Col>
            <Col xl={8} lg={10} md={11} className="py-3">
              {loading ? (
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              ) : (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Device ID</th>
                      <th scope="col">Device Name</th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deviceList ? (
                      Object.keys(deviceList).map((key, index) => {
                        const dv = deviceList[key];
                        return itemRender(dv, key, index);
                      })
                    ) : (
                      <tr></tr>
                    )}
                  </tbody>
                </Table>
              )}
            </Col>
          </Row>
        </Container>

        <Modal show={editModalShow} onHide={() => handleEditModal(null, false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Device</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row>
                <FormGroup as={Col} xl={12}>
                  <FormLabel>ID</FormLabel>
                  <FormControl
                    value={deviceId}
                    placeholder="DeviceID"
                    aria-label="id"
                    readOnly
                    aria-describedby="basic-addon1"
                  />
                </FormGroup>
                <FormGroup as={Col} xl={12}>
                  <FormLabel>Name</FormLabel>
                  <FormControl
                    value={deviceName}
                    placeholder="Input Device Name"
                    aria-label="id"
                    required
                    onChange={(event) => setDeviceName(event.target.value)}
                    aria-describedby="basic-addon1"
                  />
                </FormGroup>
                <FormGroup as={Col} xl={12}>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl
                    value={deviceQuantity}
                    placeholder="Input Device Quantity"
                    onChange={(event) => setDeviceQuantity(event.target.value)}
                    aria-label="id"
                    required
                    aria-describedby="basic-addon1"
                  />
                </FormGroup>
                <FormGroup as={Col} xl={12}>
                  <FormLabel>Price</FormLabel>
                  <FormControl
                    value={devicePrice}
                    placeholder="Input Device Price"
                    onChange={(event) => setDevicePrice(event.target.value)}
                    aria-label="id"
                    required
                    aria-describedby="basic-addon1"
                  />
                </FormGroup>
              </Row>
              <Row className="py-3">
                <Col className="d-flex justify-content-center">
                  <Button
                    onClick={() => handleEditModal(null, false)}
                    className="mx-1"
                    variant="secondary"
                    type="reset"
                  >
                    Close
                  </Button>
                  <Button type="submit" className="mx-1" variant="primary">
                    {deviceId ? "Save Changes" : "Create"}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal show={hasError}>
          <Modal.Header closeButton>
            <Modal.Title>Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>{errorMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={clearError}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
);
