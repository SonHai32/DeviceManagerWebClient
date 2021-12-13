const deviceActions = (store) => ({
  getDeviceList: (state) => ({ ...state, loading: true }),
  getDeviceListSuccess: (state, deviceList) => ({
    ...state,
    deviceList,
    hasError: false,
    errorMessage: "",
    loading: false,
  }),
  getDeviceListFail: (state, errorMessage) => ({
    ...state,
    errorMessage,
    hasError: true,
    loading: false,
  }),

  deleteDevice: (state) => ({
    ...state,
    loading: true,
  }),

  deleteDeviceSuccess: (state) => ({
    ...state,
    loading: false,
    hasError: false,
    errorMessage: "",
  }),

  deleteDeviceFail: (state, errorMessage) => ({
    ...state,
    errorMessage,
    loading: false,
    hasError: true,
  }),

  updateDevice: (state) => ({ ...state, loading: true }),
  updateDeviceSuccess: (state) => ({
    ...state,
    loading: false,
    hasError: false,
    errorMessage: "",
  }),
  updateDeviceFail: (state, errorMessage) => ({ ...state, errorMessage }),

  createDevice: (state) => ({ ...state, loading: true }),
  createDeviceSuccess: (state) => ({
    ...state,
    loading: false,
    hasError: false,
    errorMessage: "",
  }),
  createDeviceFail: (state, errorMessage) => ({
    ...state,
    loading: false,
    hasError: true,
    errorMessage,
  }),

  clearError: (state) => ({ ...state, hasError: false, errorMessage: "" }),
});

export default deviceActions;
