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
import ProductCard from "../ui/product-card";
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
        if (
          response.cart.filter((value) => cartAsins.includes(value.asin))
            .length < 0
        ) {
          dispatch(addToCart(response.cart));
          console.log("dispatch called with ", response.cart);
        }
      }
    };

    getCartProducts();
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get("/api/get-cart");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, []);
  // Add item to cart
  const addItem = useCallback(
    async (product: Product) => {
      try {
        setLoading(true);
        // Send POST request to add the item to the cart
        const response = await axios.post("/api/add-cart", {
          ...product,
          quantity: 1,
        });
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4 p-4 md:p-10 lg:p-20 lg:grid-cols-3">
      {data &&
        data.map((product) => (
          <ProductCard
            key={product.asin}
            product={product}
            addItem={addItem}
            removeItem={removeItem}
            loading={loading}
            clickedProducts={clickedProducts} 
          />
        ))}
    </div>
  );
}

export default Products;
