export default function ContentLayout({ children, }: { children: React.ReactNode; }) {
  return (
    <main className="container min-h-[calc(100vh-4rem)] px-5 mx-auto ">{children}</main>
  );
}