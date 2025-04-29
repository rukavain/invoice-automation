import Navbar from "../components/navbar/Navbar";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className=" flex flex-col justify-start items-start w-full h-full max-w-[2000px]">
      <div className="flex justify-start items-start h-full w-full">
        {children}
      </div>
    </main>
  );
}
