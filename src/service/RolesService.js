import axios from 'axios';
import baseURL from './baseURL';

export class ProductService {

    getProductsAll() {
        return axios.get(baseURL() + 'roles').then(res => res.data.data);
    }

}