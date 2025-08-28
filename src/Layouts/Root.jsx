import React, { useEffect } from "react";
import Navbar from "../Shared/Navbar/Navbar";
import { Outlet, useNavigation } from "react-router-dom";
import Footer from "../Shared/Footer/Footer";
import useWebsiteLoading from "../Hook/useWebsiteLoading.jsx";

const Root = () => {
  const navigation = useNavigation();
  const { showLoading, hideLoading } = useWebsiteLoading();

  useEffect(() => {
    if (navigation.state === "loading") {
      showLoading();
    } else {
      // Small delay to show the loading animation smoothly
      setTimeout(() => {
        hideLoading();
      }, 300);
    }
  }, [navigation.state, showLoading, hideLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
          {[...Array(96)].map((_, i) => (
            <div
              key={i}
              className="border border-purple-500/20 animate-pulse"
              style={{
                animationDelay: `${(i * 0.1) % 3}s`,
                animationDuration: "4s",
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-20 animate-float"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + i * 8}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${4 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Fixed Navbar */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Main Content with top padding for fixed navbar */}
      <main className=" pt-16 relative z-10">
        <Outlet></Outlet>
      </main>

      {/* Footer */}
      <div className="relative z-10">
        <Footer></Footer>
      </div>
    </div>
  );
};

export default Root;
