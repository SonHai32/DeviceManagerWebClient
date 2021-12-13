import "./App.css";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useState, useEffect } from "react";
import { bindActions } from "redux-zero/utils";
import { Provider } from "redux-zero/react";
import deviceStore from "./stores/device.store";
import deviceAction from "./actions/device.action";
import DeviceTable from "./components/deviceTable.component";
import { devConfig } from "./dev.config";
import { Spinner } from "react-bootstrap";
import { Alert } from "bootstrap";

const { API_URL, HUB_URL } = devConfig;
const boundActions = bindActions(deviceAction, deviceStore);

function App() {
  const [connection, setConnection] = useState();
  const [hubStatus, setHubStatus] = useState("Disconnected");

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(HUB_URL)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      const initHubConnection = () => {
        connection
          .start()
          .then((result) => {
            setHubStatus("Connected");
            boundActions.getDeviceList();
            getDeviceList()
              .then((data) => boundActions.getDeviceListSuccess(data))
              .catch((err) => {
                boundActions.getDeviceListFail(err.message);
              });

            connection.on("DEVICE_CHANGED", async (message) => {
              boundActions.getDeviceList();
              try {
                const data = await getDeviceList();
                boundActions.getDeviceListSuccess(data);
              } catch (err) {
                console.log(err);
              }
            });

            connection.onclose((error) => {
              setHubStatus("Disconnected");
              console.log(error);
            });
            connection.onreconnecting((error) => {
              setHubStatus("Disconnected");
              console.log(error);
            });
            connection.onreconnected((id) => {
              setHubStatus("Connected");
            });
          })
          .catch((err) => {
            setHubStatus("Disconnected");
            setTimeout(() => initHubConnection(), 4000);
          });
      };
      initHubConnection();
    }
  }, [connection]);

  const getDeviceList = () => {
    return new Promise((reslove, reject) => {
      fetch(API_URL + "/Get")
        .then(async (res) => {
          reslove(await res.json());
        })
        .catch((err) => reject(err));
    });
  };

  return (
    <Provider store={deviceStore}>
      {hubStatus === "Connected" ? (
        <DeviceTable />
      ) : (
        <div className="w-100 vh-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" role="status"></Spinner>
          <span> &emsp; Connecting to hub ...</span>
        </div>
      )}
    </Provider>
  );
}

export default App;
