import React from "react";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Header() {
  return (
    <div>
      <nav className=" border-gray-200">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8"
              alt="Flowbite Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Ecommerce
            </span>
          </Link>

          <div className="flex items-center md:order-2 space-x-4 md:space-x-0 rtl:space-x-reverse">
            <ModeToggle />
            <button
              type="button"
              className="flex text-sm  bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            >
              <img
                className="w-8 h-8 rounded-full"
                src="https://github.com/shadcn.png"
                alt="user photo"
              />
            </button>
          </div>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input type="text" placeholder="Search any product" />
            <Button type="button" >Search</Button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
