import StoreLayout from "@/components/StoreLayout";

export default function LojaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StoreLayout>{children}</StoreLayout>;
}
