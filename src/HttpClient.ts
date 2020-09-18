/**
 * HTTP service - wrapper around axios.
 *
 * The goal of this service:
 *   - make any http process easy to cancel;
 *   - simplify uploading files operation.
 *
 * To make cancel operation possible we create CustomAxiosPromise.
 * The goal of CustomAxiosPromise object is to extend AxiosPromise interface with additional "cancel" method.
 *
 */
import { AxiosInstance, AxiosPromise } from "axios";

interface HttpClientInterface {
  read: (path: string) => Promise<any>;
  create: (path: string, data: any) => Promise<any>;
  update: (path: string, data: any) => Promise<any>;
  delete: (path: string) => Promise<any>;
  upload: (path: string, data: any) => Promise<any>;
}

const makeCancellable = <T>(
  request: AxiosPromise<T>
): CustomAxiosPromise<T> => {
  const cancellableRequest = {
    ...request,
    cancel: () => {}
  };

  return cancellableRequest;
};

interface CustomAxiosPromise<T> extends AxiosPromise<T> {
  cancel: () => void;
}

export class HttpClient implements HttpClientInterface {
  constructor(private axios: AxiosInstance) {}

  public read<T>(path: string): CustomAxiosPromise<T> {
    const request = this.axios.get<T>(path);

    return makeCancellable<T>(request);
  }

  public create<T>(path: string, data: any): CustomAxiosPromise<T> {
    const request = this.axios.post<T>(path, data);

    return makeCancellable<T>(request);
  }

  public update<T>(path: string, data: any): CustomAxiosPromise<T> {
    const request = this.axios.put<T>(path, data);

    return makeCancellable<T>(request);
  }

  public delete<T>(path: string): CustomAxiosPromise<T> {
    const request = this.axios.put<T>(path);

    return makeCancellable<T>(request);
  }

  public upload<T>(path: string, files: File[]): CustomAxiosPromise<T> {
    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    const request = this.axios.post<T>(path, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    return makeCancellable<T>(request);
  }
}
