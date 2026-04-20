export const errorResponse = (err : any) => {
    return {
      status: err?.response?.status,
      message: err?.response?.error
    };
  };
  
  export const successResponse = (data : any) => {
    return { status: HttpStatus.OK, data };
  };
  
  export const HttpStatus = {
    OK: 200,
    NotFound: 404,
    BadRequest: 400,
    InternalServer: 500
  };
  