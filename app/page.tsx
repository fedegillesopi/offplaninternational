import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="body-wrapper mx-auto w-full">
      <Navbar />
      <main>
        <div className="min-h-[50vh]" />
      </main>
      <Footer />
    </div>
  );
}
