import AccountNav from "./AccountNav";
import SignOutButton from "./SignOutButton";

type AccountSidebarProps = {
  user: {
    name?: string | null;
    email?: string | null;
  };
};

export default function AccountSidebar({ user }: AccountSidebarProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-lg font-semibold text-[#1f1a17]">
          {user.name ?? "BookNest member"}
        </div>
        <div className="text-sm text-[#6b5f54]">{user.email ?? ""}</div>
      </div>
      <AccountNav />
      <SignOutButton />
    </div>
  );
}
