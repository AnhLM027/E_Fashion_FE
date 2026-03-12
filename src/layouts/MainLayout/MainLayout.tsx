import { Outlet } from "react-router-dom";

import Header from "@/layouts/Header/Header";
import Footer from "@/layouts/Footer/Footer";
import ChatWidget from "@/features/chat/components/ChatWidget";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Hiển thị cho cả guest và user */}
      <ChatWidget />

      <Footer />
    </div>
  );
};

export default MainLayout;