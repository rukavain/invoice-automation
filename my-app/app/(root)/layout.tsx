import Category from "../components/category/Category";
import Navbar from "../components/navbar/Navbar";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className=" flex flex-col justify-start items-start w-full h-full max-w-[1800px]">
      <Navbar />
      <div className="flex justify-start items-start h-full">
        <Category />
        {children}
      </div>
    </main>
  );
}
