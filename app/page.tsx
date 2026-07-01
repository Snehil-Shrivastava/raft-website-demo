import IntroModuleQuestion from "@/components/IntroModuleQuestion";

export default function Home() {
  return (
    <div className="h-screen">
      <div className="h-50 text-center flex items-center justify-center">
        <h1 className="text-5xl tracking-widest">Home</h1>
      </div>
      <IntroModuleQuestion />
    </div>
  );
}
