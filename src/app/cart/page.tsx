"use client";
import React, { useEffect,useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import Footer from "@/components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "@/store/services/cartProductSlice";

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

function page() {
  const cartState = useSelector((state: RootState): Array<object> => state.cart);
  const [cart, setCart] = useState([]);
  const [OriginalPrice, setOriginalPrice] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountPercentageToNumber, setDiscountPercentageToNumber] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [applyDiscount, setApplyDiscount] = useState(false);
  useEffect(() => {
    setCart(cartState); // Make sure cart is updated with cartState
  
    const calculateOriginalPrice = () => {
      let totalPrice = 0;
      cartState.forEach((product) => {
        totalPrice += product.product_price; // Sum the price of all products
      });
      setOriginalPrice(totalPrice.toFixed(2)); // Set the total original price with two decimal places
    };
    const handleDiscountChange = () => {
      setDiscountPercentageToNumber(OriginalPrice * discountPercentage / 100);
      setTotalPrice(OriginalPrice - discountPercentageToNumber);
  }
  
    calculateOriginalPrice();
    handleDiscountChange();
  }, [cartState,applyDiscount]);
  const dispatch = useDispatch();
  // console.log(cart);
  const addItem = (product: Product) => {
    // Dispatch the action to add the product to the cart
    dispatch(addToCart(product));
  };

  const removeOneItem = (product: Product) => {
    // Dispatch the action to remove the product from the cart
    dispatch(removeFromCart({asin:product.asin,remove:false}));
  };
  const removeItem = (product: Product) => {
    // Dispatch the action to remove the product from the cart
    dispatch(removeFromCart({asin:product.asin,remove:true}));
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
          
                 
                  {cart && cart.map((product, index) => (
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
                            onClick={() => removeOneItem(product)}
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
              <div className="hidden xl:mt-8 xl:block">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  People also bought
                </h3>
                <div className="mt-6 grid grid-cols-3 gap-4 sm:mt-8">
                  <Card className="space-y-6 overflow-hidden rounded-lg border border-gray-200  p-6 shadow-sm">
                    <a href="#" className="overflow-hidden rounded">
                      <Image
                        width={44}
                        height={44}
                        className="mx-auto h-44 w-44"
                        src="https://m.media-amazon.com/images/I/61bMNCeAUAL._AC_UL960_FMwebp_QL65_.jpg"
                        alt="imac image"
                      />
                    </a>
                    <div>
                      <a
                        href="#"
                        className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
                      >
                        Apple Watch Series 8
                      </a>
                      <p className="mt-2 text-base font-normal text-gray-500 dark:text-gray-400">
                        This generation has some improvements, including a
                        longer continuous battery life.
                      </p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        <span className="line-through"> $1799,99 </span>
                      </p>
                      <p className="text-lg font-bold leading-tight text-red-600 dark:text-red-500">
                        $1199
                      </p>
                    </div>
                    <div className="mt-6 flex items-center gap-2.5">
                      <button
                        data-tooltip-target="favourites-tooltip-3"
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                      >
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
                            d="M12 6C6.5 1 1 8 5.8 13l6.2 7 6.2-7C23 8 17.5 1 12 6Z"
                          ></path>
                        </svg>
                      </button>
                      <div
                        id="favourites-tooltip-3"
                        role="tooltip"
                        className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
                      >
                        Add to favourites
                        <div className="tooltip-arrow" data-popper-arrow></div>
                      </div>

                      <button
                        type="button"
                        className="inline-flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium  text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                      >
                        <svg
                          className="-ms-2 me-2 h-5 w-5"
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
                            d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7h-1M8 7h-.688M13 5v4m-2-2h4"
                          />
                        </svg>
                        Add to cart
                      </button>
                    </div>
                  </Card>
                </div>
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
                      $ {OriginalPrice}
                      </dd>
                    </dl>

                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                        discount
                      </dt>
                      <dd className="text-base font-medium text-green-600">
                        $ {discountPercentageToNumber }
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

                <Button className="ml-14">Proceed to Checkout</Button>

                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {" "}
                    or{" "}
                  </span>
                  <a
                    href="#"
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
                      Do you have a voucher or gift card?{" "}
                    </label>
                    <Input type="number" placeholder="Enter your discount percent" value={setDiscountPercentage} required   onChange={discountPercentage}/>
                  </div>
                  <Button onClick={()=> setApplyDiscount(prev=>!prev)} >Apply Code</Button>
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
