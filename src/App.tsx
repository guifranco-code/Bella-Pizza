import React, { useState, useEffect } from 'react';
import { Search, Flame, Sparkles, Filter, Database, ChefHat, Check, Pizza as PizzaIcon, ShoppingBag } from 'lucide-react';
import { Header } from './components/Header';
import { PizzaCard } from './components/PizzaCard';
import { PizzaDetailsModal } from './components/PizzaDetailsModal';
import { CustomPizzaBuilder } from './components/CustomPizzaBuilder';
import { CartDrawer } from './components/CartDrawer';
import { OrderTracker } from './components/OrderTracker';
import { AdminPanel } from './components/AdminPanel';
import { SupabaseModal } from './components/SupabaseModal';
import { PIZZA_CATEGORIES } from './data/pizzas';
import { CartItem, CustomerDetails, Order, Pizza } from './types';
import { createOrder, getOrders, getPizzas, getSupabaseSettings } from './lib/supabase';

export default function App() {
  const [activeTab, setActiveTab] = useState<'cardapio' | 'builder' | 'pedidos' | 'cozinha' | 'supabase'>('cardapio');
  
  // Data State
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Modals
  const [selectedPizzaForModal, setSelectedPizzaForModal] = useState<Pizza | null>(null);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);

  // Connection State
  const supabaseSettings = getSupabaseSettings();

  // Initial Load
  const loadInitialData = async () => {
    const fetchedPizzas = await getPizzas();
    setPizzas(fetchedPizzas);

    const fetchedOrders = await getOrders();
    setOrders(fetchedOrders);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Filtered Pizzas
  const filteredPizzas = pizzas.filter((pizza) => {
    const matchesCategory = selectedCategory === 'todos' || pizza.category === selectedCategory;
    const matchesSearch = pizza.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pizza.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Cart Actions
  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === item.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += item.quantity;
        return updated;
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Submit Order Action
  const handleSubmitOrder = async (
    customer: CustomerDetails,
    totals: { subtotal: number; deliveryFee: number; discount: number; total: number }
  ) => {
    const newOrder: Order = {
      id: `PED-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: customer.name,
      customerPhone: customer.phone,
      deliveryType: customer.addressType,
      address: `${customer.street}, ${customer.number}${customer.complement ? ' - ' + customer.complement : ''}`,
      neighborhood: customer.neighborhood,
      paymentMethod: customer.paymentMethod,
      items: cartItems,
      subtotal: totals.subtotal,
      deliveryFee: totals.deliveryFee,
      discount: totals.discount,
      total: totals.total,
      status: 'recebido',
      createdAt: new Date().toISOString(),
      estimatedDeliveryTimeMinutes: 45,
    };

    await createOrder(newOrder);
    setCartItems([]);
    setIsCartOpen(false);
    
    // Refresh orders list and navigate to order tracker
    const updatedOrders = await getOrders();
    setOrders(updatedOrders);
    setActiveTab('pedidos');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'supabase') {
            setIsSupabaseModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSupabase={() => setIsSupabaseModalOpen(true)}
        isConnectedToSupabase={supabaseSettings.isConnected}
        activeOrderCount={orders.filter((o) => o.status !== 'entregue' && o.status !== 'cancelado').length}
      />

      {/* Main Container */}
      <main className="flex-1">
        
        {/* TAB 1: CARDÁPIO (MENU) */}
        {activeTab === 'cardapio' && (
          <div className="space-y-10 pb-16">
            
            {/* Hero Banner */}
            <div className="relative bg-gradient-to-b from-stone-900 via-amber-950/20 to-stone-950 border-b border-stone-800/80 overflow-hidden py-12 sm:py-16">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
                <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase px-4 py-1.5 rounded-full shadow-lg">
                  <Flame className="w-4 h-4 fill-amber-400" />
                  <span>Pizzaria Bella Italia • Forno a Lenha desde 1998</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-100 max-w-3xl mx-auto leading-tight">
                  A Verdadeira Pizza Artesanal Assada no <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent">Forno de Pedra</span>
                </h1>

                <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                  Massas de fermentação natural de 48h, molho de tomate pelati italiano e ingredientes selecionados das melhores origens.
                </p>

                {/* Search Bar */}
                <div className="max-w-xl mx-auto relative pt-2">
                  <div className="relative flex items-center">
                    <Search className="w-5 h-5 text-stone-400 absolute left-4 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Busque por sabor ou ingrediente (Ex: Calabresa, Trufado, Nutella)..."
                      className="w-full bg-stone-900/90 border border-stone-700/80 text-stone-100 text-sm rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-2xl placeholder-stone-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Categories Selector */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center space-x-2 overflow-x-auto pb-4 no-scrollbar">
                {PIZZA_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-5 py-3 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 flex items-center space-x-2 shadow-md ${
                      selectedCategory === cat.id
                        ? 'bg-amber-500 text-stone-950 scale-105 shadow-amber-500/20'
                        : 'bg-stone-900/80 text-stone-300 border border-stone-800 hover:border-stone-700 hover:bg-stone-800'
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Pizza Banner Callout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div 
                onClick={() => setActiveTab('builder')}
                className="bg-gradient-to-r from-red-950/60 via-stone-900 to-amber-950/60 border border-amber-500/30 rounded-3xl p-6 sm:p-8 cursor-pointer hover:border-amber-500/60 transition-all group flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-500 p-0.5 shadow-lg group-hover:scale-110 transition-transform">
                    <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center">
                      <PizzaIcon className="w-8 h-8 text-amber-400" />
                    </div>
                  </div>
                  <div>
                    <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                      Exclusivo
                    </span>
                    <h3 className="text-xl font-extrabold text-stone-100 group-hover:text-amber-400 transition-colors">
                      Quer criar sua própria combinação? Monte sua Pizza!
                    </h3>
                    <p className="text-xs text-stone-400 mt-1">
                      Escolha massa, bordas recheadas, molhos e mais de 20 ingredientes premium em nosso construtor interativo.
                    </p>
                  </div>
                </div>

                <span className="bg-amber-500 text-stone-950 font-black px-5 py-3 rounded-2xl text-xs uppercase tracking-wider group-hover:scale-105 transition-transform flex-shrink-0">
                  Montar Pizza Agora →
                </span>
              </div>
            </div>

            {/* Pizza Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-stone-100 flex items-center space-x-2">
                  <span>Cardápio de Pizzas</span>
                  <span className="text-xs text-stone-500 font-normal">
                    ({filteredPizzas.length} {filteredPizzas.length === 1 ? 'opção' : 'opções'})
                  </span>
                </h2>
              </div>

              {filteredPizzas.length === 0 ? (
                <div className="text-center py-16 bg-stone-900/40 rounded-3xl border border-stone-800 space-y-3">
                  <p className="text-stone-400 text-sm">Nenhuma pizza encontrada para a busca "{searchQuery}".</p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory('todos'); }}
                    className="text-xs text-amber-400 font-bold hover:underline"
                  >
                    Limpar Filtros
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredPizzas.map((pizza) => (
                    <PizzaCard
                      key={pizza.id}
                      pizza={pizza}
                      onSelectPizza={(p) => setSelectedPizzaForModal(p)}
                      onQuickAdd={(p) => setSelectedPizzaForModal(p)}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: CUSTOM PIZZA BUILDER */}
        {activeTab === 'builder' && (
          <CustomPizzaBuilder
            onAddToCart={handleAddToCart}
            onGoToMenu={() => setActiveTab('cardapio')}
          />
        )}

        {/* TAB 3: ORDER TRACKER */}
        {activeTab === 'pedidos' && (
          <OrderTracker
            orders={orders}
            onRefreshOrders={loadInitialData}
            onGoToMenu={() => setActiveTab('cardapio')}
          />
        )}

        {/* TAB 4: KITCHEN / ADMIN PANEL */}
        {activeTab === 'cozinha' && (
          <AdminPanel
            orders={orders}
            pizzas={pizzas}
            onRefreshData={loadInitialData}
            onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
            isConnectedToSupabase={supabaseSettings.isConnected}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-stone-950 border-t border-stone-800/80 py-10 text-stone-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <PizzaIcon className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-stone-200">Bella Pizza Artesanal</span>
            <span>• Conectado ao Supabase</span>
          </div>
          <p>© 2026 Bella Pizza. Todos os direitos reservados. Entrega Rápida em 45min.</p>
        </div>
      </footer>

      {/* Customization Details Modal */}
      <PizzaDetailsModal
        pizza={selectedPizzaForModal}
        allPizzas={pizzas}
        onClose={() => setSelectedPizzaForModal(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCartItems([])}
        onSubmitOrder={handleSubmitOrder}
      />

      {/* Supabase Connection & SQL Setup Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onRefresh={loadInitialData}
      />

    </div>
  );
}
