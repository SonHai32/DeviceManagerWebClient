import createStore from "redux-zero";
import { deviceState } from "../states/device.state";

import { applyMiddleware } from "redux-zero/middleware";
import { connect } from "redux-zero/devtools";

const middlewares = connect ? applyMiddleware(connect(deviceState)) : [];
const store = createStore(deviceState, middlewares);

export default store;
