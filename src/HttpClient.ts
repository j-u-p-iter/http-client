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
import { AxiosPromise, AxiosStatic } from "axios";

interface HttpClientInterface {
  read: <T>(path: string) => CustomAxiosPromise<T>;
  create: <T>(path: string, data: any) => CustomAxiosPromise<T>;
  update: <T>(path: string, data: any) => CustomAxiosPromise<T>;
  delete: <T>(path: string) => CustomAxiosPromise<T>;
  upload: <T>(path: string, data: any) => CustomAxiosPromise<T>;
}

interface CustomAxiosPromise<T> extends AxiosPromise<T> {
  cancel: () => void;
}

export class HttpClient implements HttpClientInterface {
  private makeCancellable<T>(
    request: AxiosPromise<T>,
    requestCancellator
  ): CustomAxiosPromise<T> {
    request.cancel = () => {
      requestCancellator.cancel();
    }

    return request;
  }

  call<T>(params: {
    method: string;
    path: string;
    data?: any;
    headers?: { [key: string]: any };
  }) {
    const { method, path, data, headers } = params;

    const requestCancellator = this.axios.CancelToken.source();

    const additionalParams = {
      headers,
      cancelToken: requestCancellator.token
    };

    const args = data ? [path, data, additionalParams] : [path, additionalParams]

    return this.makeCancellable<T>(
      this.axios[method]<T>(...args),
      requestCancellator
    );
  }

  constructor(private axios: AxiosStatic) {}

  public read<T>(path: string): CustomAxiosPromise<T> {
    return this.call<T>({ path, method: "get" });
  }

  public create<T>(path: string, data: any): CustomAxiosPromise<T> {
    return this.call<T>({ path, data, method: "post" });
  }

  public update<T>(path: string, data: any): CustomAxiosPromise<T> {
    return this.call<T>({ path, data, method: "put" });
  }

  public delete<T>(path: string): CustomAxiosPromise<T> {
    return this.call<T>({ path, method: "delete" });
  }

  public upload<T>(path: string, files: File[]): CustomAxiosPromise<T> {
    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    return this.call<T>({
      path,
      method: "post",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" }
    });
  }
}
