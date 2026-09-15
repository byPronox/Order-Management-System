import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { CustomersWorkspace } from "@/components/dashboard/customers-workspace";

export default function CustomersPage() {
  return (
    <div className="min-h-screen bg-[#fdf8f8] text-[#1c1b1b] lg:flex">
      <DashboardSidebar />
      <div className="min-w-0 flex-1 overflow-y-auto lg:h-screen">
        <CustomersWorkspace />
      </div>
    </div>
  );
}
