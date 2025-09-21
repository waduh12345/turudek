import DefaultHeader from "@/components/layout/header";

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DefaultHeader showNavigationBars={true} />
      <main className="pt-26 md:pt-36 min-h-screen flex flex-col font-sans">
        <div className="flex-1">{children}</div>
      </main>
    </>
  );
}
