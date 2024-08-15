"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Header from "@/components/pages/Header";
import { Input } from "@/components/ui/input";
import Footer from "@/components/pages/Footer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hook";
import { addToCart, removeFromCart } from "@/store/services/cartProductSlice";
import { useToast } from "@/components/ui/use-toast";

interface Product {
  asin: string;
  product_photo: string;
  product_title: string;
  product_price: number;
  quantity: number;
}

function page() {
  const dispatch = useAppDispatch();
  const cartState = useAppSelector(
    (state): Array<Product> => state.cart as Array<Product>
  );

  const [cart, setCart] = useState<Product[]>([]);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountPercentageToNumber, setDiscountPercentageToNumber] =
    useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    setCart(cartState); // Make sure cart is updated with cartState

    const calculatePrice = () => {
      let totalPrice = 0;
      cartState.forEach((product) => {
        totalPrice += product.product_price; // Sum the price of all products
      });
      setOriginalPrice(parseFloat(totalPrice.toFixed(2))); // Set the total original price with two decimal places
      setTotalPrice(parseFloat(totalPrice.toFixed(2))); // Set the total original price with two decimal places
      if (totalPrice == 0) setDiscountPercentageToNumber(0);
    };

    calculatePrice();
  }, [cartState]);

  // console.log(cart);
  const addItem = (product: Product) => {
    // Dispatch the action to add the product to the cart
    let event = null;
    dispatch(addToCart(product));
    handleDiscountChange(event);
  };

  const removeOneItem = (product: Product) => {
    // Dispatch the action to remove the product from the cart
    let event = null;
    dispatch(removeFromCart({ asin: product.asin, remove: false }));
    handleDiscountChange(event);
  };

  const removeItem = (product: Product) => {
    // Dispatch the action to remove the product from the cart
    let event = null;
    dispatch(removeFromCart({ asin: product.asin, remove: true }));
    handleDiscountChange(event);
  };

  const handleDiscountChange = (
    event: { preventDefault: () => void } | null
  ) => {
    if (event) event.preventDefault();
    if (event) {
      if (discountPercentage == 0) {
        toast({
          variant: "destructive",
          title: "Discount percentage is required",
          description: "Please enter a discount percentage",
        });
        return;
      }
      if (discountPercentage < 0) {
        toast({
          variant: "destructive",
          title: "Discount percentage is invalid",
          description: "Please enter a valid discount percentage",
        });
        return;
      }
      if (discountPercentage > 40) {
        toast({
          variant: "destructive",
          title: "Discount percentage is invalid",
          description: "Please enter a discount percentage less than 40",
        });
        return;
      }
      if (originalPrice == 0) {
        toast({
          variant: "destructive",
          title: "Cart is empty",
          description: "Please add items to cart",
        });
        return;
      }
    }
    console.log(originalPrice);
    setDiscountPercentageToNumber(
      parseFloat(((originalPrice * discountPercentage) / 100).toFixed(2))
    );
    let total_price =
      originalPrice - (originalPrice * discountPercentage) / 100;
    setTotalPrice(parseFloat(total_price.toFixed(2)));
  };

  return (
    <div>
      <Header />
      <section className=" py-8 antialiased  md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            Shopping Cart
          </h2>

          <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
            <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
              <div className="space-y-6">
                {cart &&
                  cart.map((product, index) => (
                    <Card className="rounded-lg border border-gray-200  p-4 shadow-sm  md:p-6">
                      <div
                        key={product.asin}
                        className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0"
                      >
                        <a href="#" className="w-20 shrink-0 md:order-1">
                          <Image
                            width={20}
                            height={20}
                            className="h-20 w-20 "
                            src={product.product_photo}
                            alt="imac image"
                          />
                        </a>

                        <label htmlFor="counter-input" className="sr-only">
                          Choose quantity:
                        </label>
                        <div className="flex items-center justify-between md:order-3 md:justify-end">
                          <div
                            className="flex items-center"
                            onClick={() => {
                              console.log(cart);
                            }}
                          >
                            <Button
                              variant={"outline"}
                              onClick={(e) => removeOneItem(product)}
                            >
                              <svg
                                className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 18 2"
                              >
                                <path
                                  stroke="currentColor"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M1 1h16"
                                />
                              </svg>
                            </Button>
                            <input
                              type="text"
                              id="counter-input-5"
                              data-input-counter
                              className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
                              placeholder=""
                              value={product.quantity}
                              required
                            />
                            <Button
                              variant={"outline"}
                              onClick={() => addItem(product)}
                            >
                              <svg
                                className="h-2.5 w-2.5 "
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 18 18"
                              >
                                <path
                                  stroke="currentColor"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M9 1v16M1 9h16"
                                />
                              </svg>
                            </Button>
                          </div>
                          <div className="text-end md:order-4 md:w-32">
                            <p className="text-base font-bold text-gray-900 dark:text-white">
                              $ {product.product_price}
                            </p>
                          </div>
                        </div>

                        <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                          <a
                            href="#"
                            className="text-base font-medium text-gray-900 hover:underline dark:text-white"
                          >
                            {product.product_title
                              .split(" ")
                              .slice(0, 3)
                              .join(" ")}
                          </a>

                          <div className="flex items-center gap-4">
                            <button
                              type="button"
                              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
                            >
                              <svg
                                className="me-1.5 h-5 w-5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke="currentColor"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                                />
                              </svg>
                              Add to Favorites
                            </button>

                            <Button
                              type="button"
                              variant={"destructive"}
                              className="inline-flex items-center text-sm font-medium hover:underline "
                              onClick={() => removeItem(product)}
                            >
                              <svg
                                className="me-1.5 h-5 w-5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke="currentColor"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M6 18 17.94 6M18 18 6.06 6"
                                />
                              </svg>
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>

            <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
              <Card className="space-y-4 rounded-lg border border-gray-200  p-4 shadow-sm dark:border-gray-700  sm:p-6">
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  Order summary
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                        Original price
                      </dt>
                      <dd className="text-base font-medium text-gray-900 dark:text-white">
                        $ {originalPrice}
                      </dd>
                    </dl>

                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                        discount
                      </dt>
                      <dd className="text-base font-medium text-green-600">
                        $ {discountPercentageToNumber}
                      </dd>
                    </dl>
                  </div>

                  <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                    <dt className="text-base font-bold text-gray-900 dark:text-white">
                      Total
                    </dt>
                    <dd className="text-base font-bold text-gray-900 dark:text-white">
                      $ {totalPrice}
                    </dd>
                  </dl>
                </div>

                <Button
                  className="ml-14"
                  onClick={() => {
                    toast({
                      title: "Checkout has been successful",
                      description: "Your order has been placed successfully",
                    });
                  }}
                >
                  Proceed to Checkout
                </Button>

                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {" "}
                    or{" "}
                  </span>
                  <a
                    href="/products"
                    title=""
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
                  >
                    Continue Shopping
                    <svg
                      className="h-5 w-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 12H5m14 0-4 4m4-4-4-4"
                      />
                    </svg>
                  </a>
                </div>
              </Card>

              <Card className="space-y-4 rounded-lg border border-gray-200 p-10 ">
                <form className="space-y-4">
                  <div>
                    <label
                      htmlFor="voucher"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {" "}
                      Enter your discount percentage below{" "}
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter your discount percent"
                      value={discountPercentage}
                      required
                      onChange={(e) => {
                        let discount = parseFloat(e.target.value);
                        setDiscountPercentage(discount);
                      }}
                    />
                  </div>
                  <Button onClick={handleDiscountChange}>Apply Code</Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default page;
