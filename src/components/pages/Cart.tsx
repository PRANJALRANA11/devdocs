import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hook";
import { addToCart, removeFromCart } from "@/store/services/cartProductSlice";
import { useToast } from "@/components/ui/use-toast";
import ButtonLoader from "@/components/ui/button-loader";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
interface Product {
  asin: string;
  product_photo: string;
  product_title: string;
  product_price: number;
  quantity: number;
}

const Cart: React.FC = () => {
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
  const [loading, setLoading] = useState(false);
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
      if (totalPrice === 0) setDiscountPercentageToNumber(0);
    };

    calculatePrice();
  }, [cartState]);

  const addItem = async (product: Product) => {
    try {
      const response = await axios.put("/api/update-cart", {
        ...product,
        quantity: product.quantity + 1,
      });

      if (response.data.success) {
        dispatch(addToCart(product));
        handleDiscountChange(null);
        toast({
          title: "Product added to cart",
          description: "Product has been added to cart successfully",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeOneItem = async (product: Product) => {
    try {
      const response = await axios.put("/api/update-cart", {
        ...product,
        quantity: product.quantity - 1,
      });

      if (response.data.success) {
        dispatch(removeFromCart({ asin: product.asin, remove: false }));
        handleDiscountChange(null);
        toast({
          title: "Product removed from cart",
          description: "Product has been removed from cart successfully",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeItem = async (product: Product) => {
    try {
      setLoading(true);
      const response = await axios.delete("/api/delete-cart", {
        data: { asin: product.asin },
      });
      setLoading(false);

      if (response.data.success) {
        dispatch(removeFromCart({ asin: product.asin, remove: true }));
        handleDiscountChange(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDiscountChange = (
    event: { preventDefault: () => void } | null
  ) => {
    if (event) event.preventDefault();
    if (cart.length === 0) {
      toast({
        variant: "destructive",
        title: "Cart is empty",
        description: "Please add items to cart",
      });
      return;
    }
    if (discountPercentage === 0) {
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
    if (originalPrice === 0) {
      toast({
        variant: "destructive",
        title: "Cart is empty",
        description: "Please add items to cart",
      });
      return;
    }

    setDiscountPercentageToNumber(
      parseFloat(((originalPrice * discountPercentage) / 100).toFixed(2))
    );
    let total_price =
      originalPrice - (originalPrice * discountPercentage) / 100;
    setTotalPrice(parseFloat(total_price.toFixed(2)));
  };

  return (
    <div>
      <section className="py-8 antialiased md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            Shopping Cart
          </h2>

          <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
            <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
              <div className="space-y-6">
                {cart.length > 0 ? (
                  cart.map((product) => (
                    <div
                      key={product.asin}
                      className="rounded-lg border border-gray-200 p-4 shadow-sm md:p-6 hover:scale-105 transform transition-transform duration-300"
                    >
                      <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                        <a href="#" className="w-20 shrink-0 md:order-1">
                          <Image
                            width={150}
                            height={150}
                            priority
                            className="mt-5 mx-auto object-contain w-[150px] h-[150px]"
                            src={product.product_photo}
                            alt="Product Image"
                          />
                        </a>

                        <div className="flex items-center justify-between md:order-3 md:justify-end">
                          <div className="flex items-center">
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
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M1 1h16"
                                />
                              </svg>
                            </Button>
                            <input
                              type="text"
                              id="counter-input"
                              data-input-counter
                              className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
                              value={product.quantity}
                              readOnly
                            />
                            <Button
                              variant={"outline"}
                              onClick={() => addItem(product)}
                            >
                              <svg
                                className="h-2.5 w-2.5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 18 18"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
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
                              className="inline-flex items-center text-sm font-medium hover:underline  hover:scale-105 transform transition-transform duration-300"
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
                              {loading ? <ButtonLoader /> : "Remove"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="lg:h-[33rem]">
                    <img
                      src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-illustration-download-in-svg-png-gif-file-formats--shopping-ecommerce-simple-error-state-pack-user-interface-illustrations-6024626.png"
                      className=" mx-auto  w-80 my-32 h-80"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
              <div className="space-y-4 rounded-lg border border-gray-200  p-4 shadow-sm dark:border-gray-700  sm:p-6">
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
                  className="mx-auto w-full"
                  onClick={() => {
                    {
                      cart.length > 0
                        ? toast({
                            title: "Checkout has been successful",
                            description:
                              "Your order has been placed successfully",
                          })
                        : toast({
                            variant: "destructive",
                            title: "Cart is empty",
                            description: "Please add items to cart",
                          });
                    }
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
              </div>

              <div className="space-y-4 rounded-lg border border-gray-200 p-10 ">
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cart;
