import { VscTerminalUbuntu } from "react-icons/vsc";

export default function Hero() {
  return (
    <div className="flex items-center gap-2">
      <VscTerminalUbuntu className="text-on-tertiary-container " size={38} />
      <h1 className="text-1xl lg:text-2xl font-bold text-on-tertiary-container tracking-[.25em] uppercase">
        smart exam simulator
      </h1>
    </div>
  );
}
