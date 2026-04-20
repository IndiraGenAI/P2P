import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';


@Injectable()
export class BatchService {

    async batchUserAuthToken(batchUserAuthData) {
        // Define the API endpoint URL
        const apiUrl = `${batchUserAuthData.url}/api/v1/auth/token`;

        // It is written in exam portal doc to send this parameter and value in body
        const requestData = {
        email: batchUserAuthData.email,
        password: batchUserAuthData.password,
        institute: batchUserAuthData.uniqueId
        };

        try {
        const response = await axios.post(apiUrl, requestData);
        const responseData = response.data;

        if (responseData.success) {
            const token = responseData.token;
            return token; // Handle the token as needed
        } else {
            throw new UnauthorizedException('Unauthorized User!');
        }
        } catch (error) {
          console.error(error); 
        }
    }

    async createBatch(branchAdminUserToken,examPortalUrl,requestBodyData){
        // Define the API endpoint URL
        const apiUrl = `${examPortalUrl}/api/v1/institute/batch`;
        
        // Define the request headers including the Bearer token
        const headers = {
            Authorization: `Bearer ${branchAdminUserToken}` 
        };
        
        // Make the POST request
        try {
            const response = await axios.post(apiUrl, requestBodyData, { headers });
            return response.data.batch._id
        } catch (error) {
            console.error(error);
        }
    }
}

