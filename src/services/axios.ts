import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
});

api.interceptors.request.use((req) => {
  req.headers.set('origin', process.env.NEXT_PUBLIC_ORIGIN);
  req.headers.setAuthorization(
    `Basic ${btoa(`${process.env.NEXT_PUBLIC_ADMIN_CREDENTIALS}`)}`,
  );
  return req;
});
