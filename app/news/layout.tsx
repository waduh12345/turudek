import DefaultHeader from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DefaultHeader showNavigationBars={true} />
      <main className="pt-32 min-h-screen flex flex-col font-sans">
        <div className="flex-1">{children}</div>
      </main>
    </>
  );
}
