import Button from "@/components/ui/Button";
import GLContours from "@/components/webgl/GLContours";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-night">
      <GLContours className="absolute inset-0" density={12} opacity={0.14} />
      <div className="relative z-[2] mx-auto w-full max-w-content px-6 md:px-8">
        <p className="font-mono text-[10px] uppercase tracking-hud text-saffron">● Error 404 · No GPS fix</p>
        <h1 className="mt-6 font-display text-fluid-xl text-bone">
          Lost the <span className="italic text-ember">trail.</span>
        </h1>
        <p className="mt-6 max-w-md text-bone/60">This page isn&apos;t on the map. The road back starts here.</p>
        <div className="mt-10">
          <Button href="/">Back to base</Button>
        </div>
      </div>
    </section>
  );
}
