import { ProposalBanner } from "@/components/proposal-banner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProposalBanner n={1} />
      {children}
    </>
  );
}
