export const successResponse = (res: any, data: any, status = 200) => {
  return res.status(status).json({
    success: true,
    status,
    data,
    timestamp: new Date().toISOString(),
  });
};
