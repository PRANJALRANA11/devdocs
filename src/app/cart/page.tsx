"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import Footer from "@/components/pages/Footer";
import Header from "@/components/pages/Header";
const Cart = dynamic(() => import("@/components/pages/Cart"), {
  suspense: true,
});

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { redirect } from "next/navigation";

interface Product {
  asin: string;
  product_photo: string;
  product_title: string;
  product_price: number;
  quantity: number;
}

function page() {
  const { isAuthenticated } = useKindeBrowserClient();

  if (!isAuthenticated) redirect("/api/auth/login");

  return (
    <div>
      <Header />
      <Cart />
      <Footer />
    </div>
  );
}

export default page;
