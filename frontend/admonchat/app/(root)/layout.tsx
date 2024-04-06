import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

const RootLayout = async ({
  children
}: {
  children: React.ReactNode;
}) => {

  return (
    <div className="h-full">
      <div className="md:ml-80">
        <Navbar />
      </div>
      <div className="hidden md:flex h-full w-20 flex-col fixed inset-y-0">
        <Sidebar />
      </div>
      <main className="md:pl-20 pt-16 h-full md:ml-80">
        {children}
      </main>
    </div>
  );
}

export default RootLayout;