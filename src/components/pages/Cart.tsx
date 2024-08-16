import React, { useCallback, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hook";
import { addToCart, removeFromCart } from "@/store/services/cartProductSlice";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import CartCard from "../ui/cart-card";

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
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [discountPercentageToNumber, setDiscountPercentageToNumber] =
    useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // To memoize the calculatePrice function
  const calculatePrice = useMemo(() => {
    const totalPrice = cartState.reduce(
      (total, product) => total + product.product_price * product.quantity,
      0
    );
    return parseFloat(totalPrice.toFixed(2));
  }, [cartState]);

  // Update the prices and discount based on cart changes
  useEffect(() => {
    setCart(cartState); // Update cart

    setOriginalPrice(calculatePrice);
    setTotalPrice(calculatePrice);

    if (calculatePrice === 0) {
      setDiscountPercentageToNumber(0);
    }
  }, [cartState, calculatePrice]);

  //   Add item quantity
  const addItem = useCallback(
    async (product: Product) => {
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
    },
    [dispatch]
  );

  //   Remove one item from cart
  const removeOneItem = useCallback(
    async (product: Product) => {
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
    },
    [dispatch]
  );

  // Remove whole item from cart
  const removeItem = useCallback(
    async (product: Product) => {
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
    },
    [dispatch]
  );

  // Handle discount change and calculate the total price
  const handleDiscountChange = useCallback(
    (event: { preventDefault: () => void } | null) => {
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
    },
    [cart, discountPercentage, originalPrice]
  );

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
                    <CartCard
                      key={product.asin}
                      product={product}
                      removeOneItem={removeOneItem}
                      addItem={addItem}
                      removeItem={removeItem}
                      loading={loading}
                    />
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
