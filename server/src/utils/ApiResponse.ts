export class ApiResponse<T = any> {
  public success: boolean;
  public message: string;
  public data: T;
  public error: any;

  constructor(statusCode: number, data: T, message: string = "Success", error: any = null) {
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    this.error = error;
  }
}
