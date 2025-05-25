export function Container(
  props: React.PropsWithChildren & { className?: string }
) {
  return (
    <div className={`container mx-auto p-4 ${props.className || ""}`}>
      {props.children}
    </div>
  );
}
