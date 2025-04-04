import React from "react";
import { RoleBasedNavbar, Footer } from "@components";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <RoleBasedNavbar />
      <main className="main-layout-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
