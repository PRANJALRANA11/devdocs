import Header from "@/components/pages/Header";
import Footer from "@/components/pages/Footer";
import Products from "@/components/pages/Products";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {redirect} from "next/navigation";


// Moved sensitive keys to environment variables for security
const API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
const API_HOST = process.env.NEXT_PUBLIC_RAPIDAPI_HOST;

interface Options {
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
    "x-rapidapi-key": string;
    "x-rapidapi-host": string;
  };
}

// Fetch data from the API
async function getData(query: string = "Phone") {
  const options: Options = {
    url: "https://real-time-amazon-data.p.rapidapi.com/search",
    params: {
      query: query,
      page: "1",
      country: "US",
      sort_by: "RELEVANCE",
      product_condition: "ALL",
      is_prime: "false",
    },
    headers: {
      "x-rapidapi-key": API_KEY || "",
      "x-rapidapi-host": API_HOST || "",
    },
  };

  const queryParams = new URLSearchParams(options.params).toString();
  const urlWithParams = `${options.url}?${queryParams}`;

  try {
    const res = await fetch(urlWithParams, {
      method: "GET",
      headers: options.headers,
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();

    const products = data.data.products.map((product: any) => {
      // Clean the product price and set a default if null
      const price = product.product_price
        ? parseFloat(product.product_price.replace(/[$,]/g, ""))
        : 200; // Default price

      return {
        ...product,
        product_price: price,
      };
    });

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return an empty array to avoid breaking the UI
  }
}

async function Page() {
  const data = await getData();
  const { isAuthenticated } = getKindeServerSession();

  if(!(await isAuthenticated())) redirect("/api/auth/login");

  return (
    <>
      <Header />
      <Products data={data} />
      <Footer />
    </>
  );
}

export default Page;
