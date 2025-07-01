"use client";

//import Home from "./Home/index";
//import Header from "./Header/index";


import dynamic from 'next/dynamic';

const Header = dynamic(() => import('./Header'), { ssr: false });
const Home = dynamic(() => import('./Home'), { ssr: false });

export default function Page() {
  return (
    <>
      <Header />
      <Home />
    </>
  );
}