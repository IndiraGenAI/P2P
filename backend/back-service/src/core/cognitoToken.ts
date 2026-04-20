import { ErrorType } from 'src/commons/common';
import * as jwt from 'jsonwebtoken';
import * as jwkToPem from 'jwk-to-pem';
import { Request } from 'express';
import { HttpService } from '@nestjs/axios';
import { take } from 'rxjs';

let iss: string | null = null;
let pems: Record<string, unknown>;

export const CognitoAuthorizer = async (
  req: Request,
  userPoolId: string,
  region: string,
) => {
  const httpService = new HttpService();
  iss = 'https://cognito-idp.' + region + '.amazonaws.com/' + userPoolId;
  return new Promise((resolve, reject) => {
    //Download the JWKs and save it as PEM
    httpService
      .get(iss + '/.well-known/jwks.json')
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          if (res.status === 200) {
            pems = {};
            const keys = res.data['keys'];
            for (let i = 0; i < keys.length; i++) {
              //Convert each key to PEM
              const key_id = keys[i].kid;
              const modulus = keys[i].n;
              const exponent = keys[i].e;
              const key_type = keys[i].kty;
              const jwk = { kty: key_type, n: modulus, e: exponent };
              const pem = jwkToPem(jwk);
              pems[key_id] = pem;
            }
            //Now continue with validating the token
            try {
              const tokenResponse = ValidateToken(pems, req);
              resolve(tokenResponse);
            } catch (error) {
              reject(error);
            }
          } else {
            //Unable to download JWKs, fail the call
            throw errorGeneret(ErrorType.TokenExpiredError);
          }
        },
        error: (err) => {
          reject(err);
        },
      });
  });
};

const getAuthorizationToken = (req: Request): string => {
  const token: string | string[] =
    req.headers.Authorization || req.headers.authorization || '';
  return Array.isArray(token) ? token[0] : token;
};

const errorGeneret = (errorType: string): Error => {
  const error = new Error();
  error.name = errorType;
  return error;
};

const ValidateToken = (pems: Record<string, unknown>, req: Request) => {
  const tokenData = getAuthorizationToken(req);
  try {
    //Fail if the token is not jwt
    const token = tokenData.replace(/^Bearer /,'')
    const decodedJwt: any = jwt.decode(token, {
      complete: true,
    });
    if (!decodedJwt) {
      throw errorGeneret(ErrorType.TokenExpiredError);
    }
    //Fail if token is not from your UserPool
    if (decodedJwt.payload.iss != iss) {
      throw errorGeneret(ErrorType.TokenExpiredError);
    }
    //Reject the jwt if it's not an 'Access Token'
    if (decodedJwt.payload.token_use != 'access') {
      throw errorGeneret(ErrorType.TokenExpiredError);
    }

    //Get the kid from the token and retrieve corresponding PEM
    const kid = decodedJwt.header.kid;
    const pem = pems[kid] as string;

    if (!pem) {
      throw errorGeneret(ErrorType.TokenExpiredError);
    }

    //Verify the signature of the JWT token to ensure it's really coming from your User Pool

    const payload: any = jwt.verify(token, pem, { issuer: iss || '' });
    return payload.sub;
  } catch (err) {
    throw err as Error;
  }
};
