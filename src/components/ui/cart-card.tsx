import React from "react";
import Image from "next/image";
import { Button } from "./button";
import ButtonLoader from "./button-loader";

const CartCard = ({
  product,
  removeOneItem,
  addItem,
  removeItem,
  loading,
}: {
  product: any;
  removeOneItem: any;
  addItem: any;
  removeItem: any;
  loading: boolean;
}) => (
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
          {product.quantity < 2 ? (
            <Button variant={"destructive"} disabled={true}>
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
          ) : (
            <Button variant={"outline"} onClick={() => removeOneItem(product)}>
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
          )}
          <input
            type="text"
            id="counter-input"
            data-input-counter
            className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
            value={product.quantity}
            readOnly
          />
          <Button variant={"outline"} onClick={() => addItem(product)}>
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
          {product.product_title.split(" ").slice(0, 3).join(" ")}
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
);

export default CartCard;
