interface HttpClientInterface {
  read: (path: string) => Promise<any>;
  create: (path: string, data: any) => Promise<any>;
  update: (path: string, data: any) => Promise<any>;
  delete: (path: string) => Promise<any>;
  upload: (path: string, data: any) => Promise<any>;
}

class HttpClient implements HttpClientInterface {
  public read() {

  }

  public create() {

  }

  public update() {

  }

  public delete() {

  }

  public upload(path, files) {
    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file)
    }); 

    return axios.post(
      path,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    );
  }
}
