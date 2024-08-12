import { NextResponse } from "next/server";
import axios from "axios";

interface Options{
    url: string;
    params: {
        query: string;
        page: string;
        country: string;
        sort_by: string;
        product_condition: string;
        is_prime: string;
    };
    headers: {
        'x-rapidapi-key': string;
        'x-rapidapi-host': string;
    };
    withCredentials: boolean;
}

const options :Options = {
    url: 'https://real-time-amazon-data.p.rapidapi.com/search',
    params: {
      query: 'Phone',
      page: '1',
      country: 'US',
      sort_by: 'RELEVANCE',
      product_condition: 'ALL',
      is_prime: 'false'
    },
    headers: {
      'x-rapidapi-key': 'f5a38a9cd0mshfa3154c6efaa96dp1d8e85jsn0312c0e646e9',
      'x-rapidapi-host': 'real-time-amazon-data.p.rapidapi.com'
    },
    withCredentials: true
  };
export async function GET(request: Request) {
    try {
        // TODO: TAKE IN PARAMS
        // const { productName } = await request.json();
        const response = await axios.get(options.url,{
            params: options.params,
            headers: options.headers,
            withCredentials: options.withCredentials
        });
        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error registering user:', error);
        return NextResponse.json(error);
    }
    }