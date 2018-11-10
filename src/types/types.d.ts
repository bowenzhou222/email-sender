export interface ICustomFailedResponse {
  status_code: number;
  error: string;
  message: string;
  meta: {
    api_version: string;
    trace_id: string;
  };
}
