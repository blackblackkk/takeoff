export function Logo({
  tone = "dark",
  large = false,
}: {
  tone?: "dark" | "light";
  large?: boolean;
}) {
  const ink = tone === "light" ? "text-paper" : "text-navy";

  return (
    <span className={`inline-flex items-center gap-2.5 ${ink}`}>
      <img
        src="/media/logo.png"
        alt=""
        width={512}
        height={512}
        className={large ? "size-16 shrink-0" : "size-9 shrink-0"}
      />
      <span className={large ? "text-2xl font-semibold tracking-tight" : "text-xl font-semibold tracking-tight"}>
        take off
      </span>
    </span>
  );
}