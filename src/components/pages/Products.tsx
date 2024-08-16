"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hook";
import Image from "next/image";
import axios from "axios";  
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { addToCart, removeFromCart } from "@/store/services/cartProductSlice";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalTrigger,
} from "@/components/ui/animated-modal";
import ButtonLoader from "@/components/ui/button-loader";
interface Product {
  asin: string;
  product_photo: string;
  product_title: string;
  product_price: number;
  quantity: number;
}

function Products({ data }: { data: Product[] }) {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(
    (state): Array<Product> => state.cart as Array<Product>
  );

  // State to track clicked products' asin
  const [clickedProducts, setClickedProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const cartAsins = useMemo(() => cart.map((item) => item.asin), [cart]);

  // Add products in cart to clickedProducts
  useEffect(() => {
    const newClickedProducts = cartAsins.filter(
      (asin) => !clickedProducts.includes(asin)
    );

    if (newClickedProducts.length > 0) {
      setClickedProducts((prevClickedProducts) => [
        ...prevClickedProducts,
        ...newClickedProducts,
      ]);
    }
  }, [cartAsins, clickedProducts]);

  useEffect(() => {
    const getCartProducts = async () => {
      const response = await fetchProducts(); // Await the fetchProducts call

      if (response?.success && response.cart.length > 0) {
        // Check if the response is successful and then dispatch the action
        if (response.cart.filter((value)=> cartAsins.includes(value.asin)).length <0){
        dispatch(addToCart(response.cart));
        console.log("dispatch called with ", response.cart);
        }
      }
    };

    getCartProducts();
  } , []);

  const fetchProducts =   useCallback(async() => {
    try {
      const response = await axios.get("/api/get-cart");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },[]);
  // Add item to cart
  const addItem = useCallback(
    async (product: Product) => {
     
  
      try {
        setLoading(true);
        // Send POST request to add the item to the cart
        const response = await axios.post("/api/add-cart", {...product,quantity:1});
        setLoading(false);
        // Check response.data.success
        if (response.data.success) {
          // Dispatch addToCart action to update Redux store
          dispatch(addToCart(product));
  
          // Update clickedProducts state if asin is not already present
          if (!clickedProducts.includes(product.asin)) {
            setClickedProducts((prevClickedProducts) => [
              ...prevClickedProducts,
              product.asin,
            ]);
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    [clickedProducts, dispatch] // Dependencies for useCallback
  );

  // Remove item from cart
  const removeItem = useCallback(
    async (product: Product) => {
      try {
        setLoading(true);
        const response = await axios.delete("/api/delete-cart", {
          data: { asin: product.asin },
        });
        setLoading(false);
        // Check response.data.success
        if (response.data.success) {
          // Dispatch the removeFromCart action
          dispatch(removeFromCart({ asin: product.asin, remove: true }));
  
          // Update clickedProducts state
          setClickedProducts((prevClickedProducts) =>
            prevClickedProducts.filter((asin) => asin !== product.asin)
          );
        }
      } catch (error) {
        console.log(error);
      }
    },
    [dispatch] // Correct dependency array
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 md:p-10 lg:p-20">
      {data &&
  data.map((product) => (
    <div
    key={product.asin}
    className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
  >
  
      <a href="#">
        <Image
  
          src={product.product_photo}
          alt={product.product_title}
          width={150}
          height={150}
          priority
          className=" mt-5 mx-auto object-contain w-[150px] h-[150px]  hover:scale-105 transform transition-transform duration-300"
        />
      </a>
      <div className="px-5 pb-5 ">
        <a href="#">
          <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white  hover:scale-105 transform transition-transform duration-300">
            {product.product_title.split(" ").slice(0, 6).join(" ")}
          </h5>
        </a>
        <div className="flex items-center mt-2.5 mb-5">
          <div className="flex items-center space-x-1 rtl:space-x-reverse  hover:scale-105 transform transition-transform duration-300">
            {/* Placeholder for star ratings */}
            <svg
              className="w-4 h-4 text-yellow-300  hover:scale-105 transform transition-transform duration-300"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            {/* More stars as needed */}
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3  hover:scale-105 transform transition-transform duration-300">
            5.0
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            ${product.product_price}
          </span>
  
          {clickedProducts.includes(product.asin) ? (
            <Button
              variant="destructive"
              onClick={() => removeItem(product)}
              className="lg:w-32  hover:scale-105 transform transition-transform duration-300"
            >
              {loading ? <ButtonLoader /> : "Remove from cart"}
            </Button>
            
          ) : (
            <Modal>
            <ModalTrigger className="bg-black dark:bg-white dark:text-black text-white flex justify-center group/modal-btn lg:w-32  relative  hover:scale-105 transform transition-transform duration-300">
              <span className="group-hover/modal-btn:translate-x-60 text-center transition duration-500">
                Add to Cart
              </span>
              <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
                🛒
              </div>
            </ModalTrigger>
            <ModalBody>
              <ModalContent>
                <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8  hover:scale-105 transform transition-transform duration-300">
                  <span className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 border border-gray-200 ">
                    {product.product_title
                      .split(" ")
                      .slice(0, 3)
                      .join(" ")}
                  </span>{" "}
                  for ${product.product_price}
                </h4>
                <motion.div
                  style={{
                    rotate: Math.random() * 20 - 10,
                  }}
                  whileHover={{
                    scale: 1.1,
                    rotate: 0,
                    zIndex: 100,
                  }}
                  whileTap={{
                    scale: 1.1,
                    rotate: 0,
                    zIndex: 100,
                  }}
                  className="rounded-xl p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden w-20 mx-auto"
                >
                  <Image
                    src={product.product_photo}
                    alt="product image"
                    width="500"
                    height="500"
                    className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
                  />
                </motion.div>
                <Button
                  onClick={() => addItem(product)}
                  className="mt-4 w-full"
                >
                  {loading ? <ButtonLoader/>:"Confirm Add to Cart"}
                </Button>
              </ModalContent>
            </ModalBody>
          </Modal>
          )}
        </div>
      </div>
    </div>
  ))}
    </div>
  );
}

export default Products;
