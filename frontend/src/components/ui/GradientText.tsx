type Props = {
  text: string;
};

export default function GradientText({ text }: Props) {
  return (
    <h1 className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-semibold">
      {text}
    </h1>
  );
}
