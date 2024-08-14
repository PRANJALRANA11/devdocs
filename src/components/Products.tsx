"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
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
import { motion } from "framer-motion";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalTrigger,
  } from "@/components/ui/animated-modal";

interface Product {
  asin: string;
  product_photo: string;
  product_title: string;
  product_price: number;
  quantity: number;
}



interface RootState {
  cart: CartState;
}

function Products({ data }: { data: Product[] }) {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState): Array<object> => state.cart);

  // State to track clicked products' asin
  const [clickedProducts, setClickedProducts] = useState<string[]>([]);

  useEffect(() => {
    cart.forEach((item) => {
      setClickedProducts((prevClickedProducts) =>
        prevClickedProducts.includes(item.asin)
          ? prevClickedProducts
          : [...prevClickedProducts, item.asin]
      );
    })
  },[]);

  const addItem = (product: Product) => {
    // Dispatch the action to add the product to the cart
    dispatch(addToCart(product));

    // Directly add the product's asin to clickedProducts if it's not already there
    setClickedProducts((prevClickedProducts) =>
      prevClickedProducts.includes(product.asin)
        ? prevClickedProducts
        : [...prevClickedProducts, product.asin]
    );
  // You can log the updated cart state after the dispatch

  };

  const removeItem = (product: Product) => {
    // Dispatch the action to remove the product from the cart
    dispatch(removeFromCart({asin:product.asin, remove:true}));

    // Remove the product's asin from clickedProducts
    setClickedProducts((prevClickedProducts) =>
      prevClickedProducts.filter((asin) => asin !== product.asin)
    );

  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4 md:p-10 lg:p-20">
    {data &&
      data.map((product) => (
        <Card key={product.asin} className="w-full sm:w-64 md:w-72 lg:w-80 h-auto">
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
                className="max-w-[100px] max-h-[100px] mt-5 mx-auto"
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
                Remove from cart
              </Button>
            ) : (
              <Modal>
                <ModalTrigger className="bg-black dark:bg-white dark:text-black text-white flex justify-center group/modal-btn w-full relative">
                  <span className="group-hover/modal-btn:translate-x-40 text-center transition duration-500">
                    Add to Cart
                  </span>
                  <div
                    className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-300 text-white z-20"
                    onClick={() => addItem(product)}
                  >
                    🛒
                  </div>
                </ModalTrigger>
                <ModalBody>
                  <ModalContent>
                    <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
                      <span className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 border border-gray-200">
                        {product.product_title.split(" ").slice(0, 3).join(" ")}
                      </span>{" "}
                      added to cart
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
