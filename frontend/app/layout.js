// app/layout.js
import React from 'react';
import './globals.css';
import localFont from "next/font/local";
import NavBar from "./components/NavBar";
import { CartProvider } from "../app/context/CartContext";
import Head from "next/head";
import Footer from './components/Footer';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }) {
  <Head>
  <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0"/>
</Head>
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CartProvider> {/* Wrapping CartProvider */}
        <NavBar/>
          {children}
          <Footer/>
        </CartProvider>
      </body>
    </html>
  );
}
