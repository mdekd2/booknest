import AccountNav from "./AccountNav";
import SignOutButton from "./SignOutButton";

type AccountSidebarProps = {
  user: {
    name?: string | null;
    email?: string | null;
  };
  memberLabel: string;
  navItems: { href: string; label: string }[];
};

export default function AccountSidebar({
  user,
  memberLabel,
  navItems,
}: AccountSidebarProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-lg font-semibold text-[#1f1a17]">
          {user.name ?? memberLabel}
        </div>
        <div className="text-sm text-[#6b5f54]">{user.email ?? ""}</div>
      </div>
      <AccountNav items={navItems} />
      <SignOutButton />
    </div>
  );
}
