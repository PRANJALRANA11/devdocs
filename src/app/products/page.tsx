import Products from "@/components/Products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
export async function getData() {
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
  let query = "Phone";
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
      "x-rapidapi-key": "10b8a93400msh7b87e57da8bb34ap1bf674jsn81b3673f6b0d",
      "x-rapidapi-host": "real-time-amazon-data.p.rapidapi.com",
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
    console.log("API response:", data);
    data.data.products.forEach((product) => {
      console.log("Product Price:", product.product_price);
      if(product.product_price!=null)  product.product_price = parseFloat(product.product_price.replace(/[$,]/g, ''));
      else product.product_price = 200;
    });
    return data.data.products;
  } catch (error) {
    console.error("Error while getting products:", error);
  }
}

async function page() {
  const data = await getData();
  return (
    <>
      {" "}
      <Header />
      <Products data={data} />;
      <Footer />
    </>
  );
}

export default page;
