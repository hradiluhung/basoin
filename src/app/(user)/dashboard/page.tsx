"use client";
import Banner from "@/components/banner/Banner";
import React from "react";

const dummyUserData = {
  name: "John Doe",
  email: "johndoe@gmail.com",
};

export default function page() {
  return (
    <main>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-400">
          Selamat datang kembali,{" "}
          <span className="font-semibold">{dummyUserData.name}</span>
        </p>
      </div>
      <div className="flex">
        <Banner />
      </div>
    </main>
  );
}
