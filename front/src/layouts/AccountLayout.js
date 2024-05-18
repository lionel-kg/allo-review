import Navbar from "@/components/Account/Navbar";
import Header from "@/components/Header";

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main className="container_account">
        <Navbar />
        <div className="account_content">{children}</div>
      </main>
    </>
  );
};

export default MainLayout;
