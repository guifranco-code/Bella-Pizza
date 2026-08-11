import React, { useState } from 'react';
import { ChefHat, Flame, Bike, CheckCircle2, DollarSign, TrendingUp, ShoppingBag, Plus, Edit2, Database, AlertCircle } from 'lucide-react';
import { Order, OrderStatus, Pizza } from '../types';
import { updateOrderStatus, savePizza } from '../lib/supabase';

interface AdminPanelProps {
  orders: Order[];
  pizzas: Pizza[];
  onRefreshData: () => void;
  onOpenSupabaseModal: () => void;
  isConnectedToSupabase: boolean;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  orders,
  pizzas,
  onRefreshData,
  onOpenSupabaseModal,
  isConnectedToSupabase,
}) => {
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'todos'>('todos');
  const [showAddPizzaModal, setShowAddPizzaModal] = useState(false);

  // New Pizza Form State
  const [newPizza, setNewPizza] = useState<Partial<Pizza>>({
    name: '',
    description: '',
    category: 'tradicionais',
    basePrice: 50,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    popular: false,
    vegetarian: false,
    ingredients: ['Molho de Tomate', 'Mussarela'],
  });

  const filteredOrders = activeFilter === 'todos' 
    ? orders 
    : orders.filter((o) => o.status === activeFilter);

  // Stats calculation
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const averageTicket = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
  const pendingCount = orders.filter((o) => o.status === 'recebido' || o.status === 'preparando').length;

  const handleStatusChange = async (orderId: string, nextStatus: OrderStatus) => {
    await updateOrderStatus(orderId, nextStatus);
    onRefreshData();
  };

  const handleSaveNewPizza = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPizza.name || !newPizza.basePrice) return;

    const pizzaToSave: Pizza = {
      id: newPizza.name.toLowerCase().replace(/\s+/g, '-'),
      name: newPizza.name,
      description: newPizza.description || '',
      category: newPizza.category as any,
      basePrice: Number(newPizza.basePrice),
      image: newPizza.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      popular: newPizza.popular,
      vegetarian: newPizza.vegetarian,
      ingredients: typeof newPizza.ingredients === 'string' 
        ? (newPizza.ingredients as string).split(',').map((s) => s.trim())
        : newPizza.ingredients || [],
    };

    await savePizza(pizzaToSave);
    setShowAddPizzaModal(false);
    onRefreshData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner & Stats */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-stone-100">Painel do Restaurante & Cozinha</h2>
              <p className="text-xs text-stone-400">Gerenciamento de pedidos e sincronização com Supabase</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddPizzaModal(true)}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-lg transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Nova Pizza no Cardápio</span>
            </button>

            <button
              onClick={onOpenSupabaseModal}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-2 ${
                isConnectedToSupabase
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800'
                  : 'bg-amber-950/40 text-amber-300 border-amber-800'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>{isConnectedToSupabase ? 'Supabase OK' : 'Configurar Supabase'}</span>
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-2xl flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-stone-400 font-medium">Faturamento Total</span>
              <p className="text-xl font-black text-stone-100">
                R$ {totalRevenue.toFixed(2).replace('.', ',')}
              </p>
            </div>
          </div>

          <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-2xl flex items-center space-x-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-stone-400 font-medium">Total de Pedidos</span>
              <p className="text-xl font-black text-stone-100">{totalOrdersCount}</p>
            </div>
          </div>

          <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-2xl flex items-center space-x-4">
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-stone-400 font-medium">Pedidos Pendentes</span>
              <p className="text-xl font-black text-amber-400">{pendingCount}</p>
            </div>
          </div>

          <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-2xl flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-stone-400 font-medium">Ticket Médio</span>
              <p className="text-xl font-black text-stone-100">
                R$ {averageTicket.toFixed(2).replace('.', ',')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Management Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-xl space-y-6">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center justify-between overflow-x-auto pb-2 border-b border-stone-800 gap-2 no-scrollbar">
          {(['todos', 'recebido', 'preparando', 'forno', 'entrega', 'entregue'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                activeFilter === status
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'bg-stone-950/60 text-stone-400 hover:text-stone-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders Cards Grid */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-stone-500 space-y-2">
            <p className="text-sm font-semibold">Nenhum pedido encontrado neste filtro.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-stone-950/80 border border-stone-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-800/80 pb-3">
                    <div>
                      <span className="text-[10px] text-stone-500 font-bold uppercase">ID #{order.id.substring(0, 8)}</span>
                      <h3 className="text-sm font-bold text-stone-100">{order.customerName}</h3>
                      <p className="text-[11px] text-stone-400">{order.customerPhone}</p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      order.status === 'recebido' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                      order.status === 'preparando' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' :
                      order.status === 'forno' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                      order.status === 'entrega' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' :
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Order Item List */}
                  <div className="space-y-1.5 text-xs text-stone-300">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="truncate pr-2">{item.quantity}x {item.name} ({item.options.size})</span>
                        <span className="text-stone-400 font-medium">R$ {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-stone-800/60 flex justify-between items-center text-xs">
                    <span className="text-stone-400">Total do Pedido:</span>
                    <span className="text-amber-400 font-extrabold text-sm">
                      R$ {order.total.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                {/* Workflow Status Action Buttons */}
                <div className="pt-3 border-t border-stone-800 flex flex-wrap gap-1.5">
                  {order.status === 'recebido' && (
                    <button
                      onClick={() => handleStatusChange(order.id, 'preparando')}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-xl text-xs transition-colors"
                    >
                      Inicia Cozinha (Massa)
                    </button>
                  )}
                  {order.status === 'preparando' && (
                    <button
                      onClick={() => handleStatusChange(order.id, 'forno')}
                      className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded-xl text-xs transition-colors"
                    >
                      Colocar no Forno a Lenha 🔥
                    </button>
                  )}
                  {order.status === 'forno' && (
                    <button
                      onClick={() => handleStatusChange(order.id, 'entrega')}
                      className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 rounded-xl text-xs transition-colors"
                    >
                      Enviar para Entrega 🛵
                    </button>
                  )}
                  {order.status === 'entrega' && (
                    <button
                      onClick={() => handleStatusChange(order.id, 'entregue')}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs transition-colors"
                    >
                      Marcar como Entregue ✅
                    </button>
                  )}
                  {order.status === 'entregue' && (
                    <span className="text-[11px] text-emerald-400 font-bold mx-auto">
                      ✓ Pedido Concluído
                    </span>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Modal Nova Pizza */}
      {showAddPizzaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full p-6 text-stone-100 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-stone-100">Adicionar Nova Pizza ao Cardápio</h3>
            <form onSubmit={handleSaveNewPizza} className="space-y-3">
              <div>
                <label className="block text-xs text-stone-400 mb-1">Nome da Pizza</label>
                <input
                  type="text"
                  required
                  value={newPizza.name}
                  onChange={(e) => setNewPizza({ ...newPizza, name: e.target.value })}
                  placeholder="Ex: Baiana Especial"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1">Descrição</label>
                <textarea
                  value={newPizza.description}
                  onChange={(e) => setNewPizza({ ...newPizza, description: e.target.value })}
                  placeholder="Descrição saborosa da pizza..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-400 mb-1">Preço Base (Média)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newPizza.basePrice}
                    onChange={(e) => setNewPizza({ ...newPizza, basePrice: Number(e.target.value) })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-400 mb-1">Categoria</label>
                  <select
                    value={newPizza.category}
                    onChange={(e) => setNewPizza({ ...newPizza, category: e.target.value as any })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-100"
                  >
                    <option value="tradicionais">Tradicionais</option>
                    <option value="especiais">Especiais</option>
                    <option value="vegetarianas">Vegetarianas</option>
                    <option value="doces">Doces</option>
                    <option value="bebidas">Bebidas</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1">URL da Imagem</label>
                <input
                  type="url"
                  value={newPizza.image}
                  onChange={(e) => setNewPizza({ ...newPizza, image: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-100"
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddPizzaModal(false)}
                  className="flex-1 bg-stone-800 hover:bg-stone-700 text-stone-300 py-2.5 rounded-xl text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-stone-950 py-2.5 rounded-xl text-xs font-bold"
                >
                  Salvar no Cardápio (Supabase)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
