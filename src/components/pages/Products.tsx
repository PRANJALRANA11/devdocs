"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hook";
import Image from "next/image";
import axios from "axios";  
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { addToCart, removeFromCart } from "@/store/services/cartProductSlice";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalTrigger,
} from "@/components/ui/animated-modal";
import Loading from "@/app/products/loading";
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4 md:p-10 lg:p-20">
      {data &&
        data.map((product) => (
          <Card
            key={product.asin}
            className="w-full sm:w-64 md:w-72 lg:w-80 h-auto"
          >
            <CardHeader>
              <CardTitle>
                {product.product_title.split(" ").slice(0, 3).join(" ")}
              </CardTitle>
              <CardDescription>
                <Image
                  src={product.product_photo}
                  alt={product.product_title}
                  width={100}
                  height={100}
                  priority
                  className="h-auto mt-5 mx-auto"
                />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center">$ {product.product_price}</p>
            </CardContent>
            <CardFooter className="relative flex justify-center">
              {clickedProducts.includes(product.asin) ? (
                <Button
                  variant="destructive"
                  onClick={() => removeItem(product)}
                  className="w-full"
                >
                {loading ? <Loading/>: "Remove from cart"}  
                </Button>
              ) : (
                <Modal>
                  <ModalTrigger className="bg-black dark:bg-white dark:text-black text-white flex justify-center group/modal-btn w-full relative">
                    <span className="group-hover/modal-btn:translate-x-60 text-center transition duration-500">
                      Add to Cart
                    </span>
                    <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
                      🛒
                    </div>
                  </ModalTrigger>
                  <ModalBody>
                    <ModalContent>
                      <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
                        <span className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 border border-gray-200">
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
                        {loading ? <Loading/>:"Confirm Add to Cart"}
                      </Button>
                    </ModalContent>
                  </ModalBody>
                </Modal>
              )}
            </CardFooter>
          </Card>
        ))}
    </div>
  );
}

export default Products;
