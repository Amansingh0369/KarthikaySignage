"use client"

import { useSession } from "next-auth/react";
import Navbar from "./component/Navbar";
import HeroSection from "./component/HeroSection";
import ProductsSection from "./component/ProductsSection";
import Footer from "./component/Footer";
import ShareDesignSection from "./component/ShareDesignSection";
import CategorySection from "./component/CategorySection";

const Page = () => {
  const { data: session } = useSession();

  return (
    <>
      <Navbar />
      <HeroSection />
      <CategorySection />
      <ProductsSection />
      <ShareDesignSection />
      <Footer />
    </>
  );
};

export default Page;