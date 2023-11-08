import User from "@/models/userModel";
import { NextResponse } from "next/server";
import { connect } from "@/db/dbConfig";

connect();

// GET ALL USERS
export async function GET() {
  try {
    const users = await User.find();

    return NextResponse.json({
      status: 200,
      message: "Berhasil mendapatkan data user",
      users: users,
    });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message });
  }
}
