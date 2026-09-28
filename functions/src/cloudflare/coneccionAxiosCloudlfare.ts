import axios,   { AxiosInstance } from 'axios';
import          { CloudflareConfig } from '../interfaces/cloudflareconfig.interface';


export function crearClienteCloudflare(config: CloudflareConfig): AxiosInstance {
  return axios.create({
    baseURL: 'https://api.cloudflare.com/client/v4',
    headers: {
      'Authorization': `Bearer ${config.apiToken}`,
      'Content-Type':  'application/json'
    },
    timeout: 15000
  });
}