import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { OrdersWorkspace } from "@/components/dashboard/orders-workspace";

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-[#fdf8f8] text-[#1c1b1b] lg:flex">
      <DashboardSidebar />
      <div className="min-w-0 flex-1 overflow-y-auto lg:h-screen">
        <OrdersWorkspace />
      </div>
    </div>
  );
}
