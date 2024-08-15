import dbConnect from "@/lib/dbConnect";
import CartModel from "@/app/models/cart";
import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
export async function GET(request: Request) {
  await dbConnect();
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const cart = await CartModel.find({ email: user?.email });
   return NextResponse.json({ cart, status: 200, success: true });
  } catch (error) {
    return NextResponse.json({
      status: 400,
      message: (error as Error).message,
      success: false,
    });
  }
}
