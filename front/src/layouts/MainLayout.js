import Header from '@/components/Header/index';

const MainLayout = ({children}) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
