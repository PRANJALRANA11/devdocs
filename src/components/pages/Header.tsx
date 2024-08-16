"use client";
import React, { useEffect, useCallback, useState } from "react";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Toggle } from "@/components/ui/toggle";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
function Header() {
  const { getUser } = useKindeBrowserClient();
  const [user, setUser] = useState<KindeUser | null>(null);

  // Get user details function
  const GetUserDetails = useCallback(async () => {
    try {
      const userDetails = await getUser();
      console.log(userDetails);
      setUser(userDetails);
    } catch (error) {
      console.error("Error fetching user details", error);
    }
  }, [getUser]);

  useEffect(() => {
    GetUserDetails();
  }, [GetUserDetails]);

  return (
    <div>
      <nav className="border-gray-200">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8 "
              alt="Flowbite Logo"
            />
            <span className="self-center md:text-2xl  text-xl  font-semibold whitespace-nowrap dark:text-white">
              Ecommerce
            </span>
          </Link>

          <div className="flex items-center md:order-2 space-x-2 lg:space-x-6 rtl:space-x-reverse">
            <Link href="/cart">
              <Toggle variant="outline" aria-label="Toggle italic">
                🛒
              </Toggle>
            </Link>

            <ModeToggle />

            <button
              type="button"
              className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            >
              <img
                src={user?.picture ?? ""}
                className="w-8 h-8 rounded-full"
                alt="user photo"
              />
            </button>
          </div>

          <div
            className="items-center justify-between hidden w-full lg:flex  md:w-auto md:order-1"
            id="navbar-user"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 rounded md:bg-transparent md:p-0"
                  aria-current="page"
                >
                  Top brands
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 rounded md:bg-transparent md:p-0"
                  aria-current="page"
                >
                  Top categories
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 rounded md:bg-transparent md:p-0"
                  aria-current="page"
                >
                  Top picks
                </a>
              </li>
              <li>
                <LogoutLink>
                  <p
                    className="block py-2 px-3 rounded md:bg-transparent md:p-0"
                    aria-current="page"
                  >
                    Logout
                  </p>
                </LogoutLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
