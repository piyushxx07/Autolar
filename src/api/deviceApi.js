import axiosClient from './axiosClient';

const deviceApi = {
  getLatestTelemetry: (deviceId) => {
    return axiosClient.get(`/devices/${deviceId}/latest`);
  },
  getTelemetryHistory: (deviceId, start, end) => {
    // We'll need to format the dates as ISO strings? The backend expects Instant, which is ISO string.
    // We'll pass the start and end as query parameters.
    return axiosClient.get(`/devices/${deviceId}/telemetry`, {
      params: {
        start: start.toISOString(),
        end: end.toISOString(),
      }
    });
  },
  getRecommendation: (deviceId) => {
    return axiosClient.get(`/devices/${deviceId}/recommendation`);
  },
  setMode: (deviceId, mode) => axiosClient.post(`/devices/${deviceId}/mode`, {
    mode: mode === 'TRACKING' ? 'TRACK' : mode,
  }),
};

export default deviceApi;
