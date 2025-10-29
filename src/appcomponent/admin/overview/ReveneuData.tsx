import { formatDistanceToNow } from "date-fns";

interface Order {
  id: number;
  order_number: string;
  user__name: string;
  user__email: string;
  final_amount: number;
  order_status: string;
  created_at: string;
}

interface RevenueDataProps {
  data: Order[];
}

export const RevenueData = ({ data }: RevenueDataProps) => {
  const totalRevenue = data.reduce((total, order) => total + order.final_amount, 0);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 rounded-lg p-6">
        <h3 className="text-sm text-zinc-400 mb-2">Total Revenue</h3>
        <p className="text-3xl font-bold text-white">৳{totalRevenue.toFixed(2)}</p>
      </div>
      
      <div className="bg-zinc-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-zinc-300 mb-4">Recent Orders</h3>
        <div className="space-y-3">
          {data.slice(0, 5).map((order) => (
            <div key={order.id} className="flex justify-between items-center bg-[#F9DE862B] p-2 rounded-lg">
              <div>
                <p className="text-sm text-zinc-300">{order.order_number}</p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">${order.final_amount}</p>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  order.order_status === 'COMPLETED' 
                    ? 'bg-emerald-500/20 text-emerald-500' 
                    : order.order_status === 'PENDING'
                    ? 'bg-yellow-500/20 text-yellow-500'
                    : 'bg-blue-500/20 text-blue-500'
                }`}>
                  {order.order_status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};