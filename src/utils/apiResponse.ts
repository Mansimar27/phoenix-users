export class ApiResponse {
  static success(res: any, message: string, data?: any) {
    return res.status(200).json({
      success: true,
      message,
      ...(data && { data }),
    });
  }
}
