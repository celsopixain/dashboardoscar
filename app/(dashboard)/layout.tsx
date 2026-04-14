import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      {/* Main content — on mobile takes full width since sidebar is a fixed overlay */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
