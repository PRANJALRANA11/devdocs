import dbConnect from "@/lib/dbConnect";
import CartModel from "@/app/models/cart";
import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
export async function POST(request: Request) {
  await dbConnect();
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const { asin, product_title, product_photo, product_price, quantity } =
      await request.json();
    let cartExist = (await CartModel.find({ email: user?.email })).filter(
      (item) => item.asin === asin
    );
    if (cartExist.length > 0) throw new Error("Product already in cart");
    const cart = await CartModel.create({
      asin,
      product_title,
      product_photo,
      product_price,
      quantity,
      email: user?.email,
    });
  return  NextResponse.json({
      cart,
      status: 201,
      message: "Product added to cart",
      success: true,
    });
  } catch (error) {
   return  NextResponse.json({
      status: 400,
      message: (error as Error).message,
      success: false,
    });
  }
}
