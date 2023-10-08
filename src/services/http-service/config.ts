import axios from "axios";

export const axios_instance = axios.create({
    // baseURL: 'https://newsapi.org/v2/',
    baseURL:'https://mocki.io/v1/',
    timeout: 10000,
  });