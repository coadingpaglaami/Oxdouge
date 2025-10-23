export const RevenueData = ()=>{
    const recentOrders = [
      { id: '#NOT-BK2219', amount: 2898.99, status: 'PAID' },
      { id: '#NOT-BK2218', amount: 1245.50, status: 'PAID' },
      { id: '#NOT-BK2212', amount: 3450.00, status: 'VALID' },
      { id: '#NOT-BK2744', amount: 890.25, status: 'PAID' },
      { id: '#NOT-BK2631', amount: 1567.80, status: 'VALID' }
    ];
    const totalRevenue = recentOrders.reduce((total, order) => total + order.amount, 0);
    return (
        <div className="space-y-6">
            <div className="bg-zinc-800 rounded-lg p-6">
            <h3 className="text-sm text-zinc-400 mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-white">${totalRevenue.toFixed(2)}</p>
          </div>
           <div className="bg-zinc-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-zinc-300 mb-4">Recent Order</h3>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-zinc-300">{order.id}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Just now</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">${order.amount}</p>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      order.status === 'PAID' 
                        ? 'bg-yellow-500/20 text-yellow-500' 
                        : 'bg-emerald-500/20 text-emerald-500'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    )
};