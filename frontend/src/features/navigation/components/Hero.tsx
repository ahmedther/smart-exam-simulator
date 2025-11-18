import { VscTerminalUbuntu } from "react-icons/vsc";

export default function Hero() {
  return (
    <div className="flex items-center gap-2">
      <div className="text-indigo-600">
        <VscTerminalUbuntu size={38} />
      </div>
      <h1 className="text-xl lg:text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-[.15em] uppercase">
        smart exam simulator
      </h1>
    </div>
  );
}
