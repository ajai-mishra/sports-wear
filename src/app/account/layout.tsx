import { AccountLayoutShell } from "@/components/account/account-layout-shell";

export default function AccountLayout({ children }: LayoutProps<"/account">) {
  return <AccountLayoutShell>{children}</AccountLayoutShell>;
}
