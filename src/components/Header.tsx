import React from 'react';
import { Pizza as PizzaIcon, ShoppingBag, Database, ShieldCheck, Flame, PlusCircle, Clock, ChefHat } from 'lucide-react';
import { CartItem } from '../types';

interface HeaderProps {
  activeTab: 'cardapio' | 'builder' | 'pedidos' | 'cozinha' | 'supabase';
  setActiveTab: (tab: 'cardapio' | 'builder' | 'pedidos' | 'cozinha' | 'supabase') => void;
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenSupabase: () => void;
  isConnectedToSupabase: boolean;
  activeOrderCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartItems,
  onOpenCart,
  onOpenSupabase,
  isConnectedToSupabase,
  activeOrderCount,
}) => {
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('cardapio')} 
            className="flex items-center space-x-3 cursor-pointer group select-none"
            id="brand-logo"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-red-600 to-orange-500 p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center">
                <PizzaIcon className="w-7 h-7 text-amber-500 transform group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
                  Bella Pizza
                </h1>
                <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full">
                  Artesanal
                </span>
              </div>
              <p className="text-xs text-stone-400 font-medium">Forno a Lenha & Delivery</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-stone-950/60 p-1.5 rounded-2xl border border-stone-800/80">
            <button
              id="nav-cardapio-btn"
              onClick={() => setActiveTab('cardapio')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'cardapio'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-semibold'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Cardápio</span>
            </button>

            <button
              id="nav-builder-btn"
              onClick={() => setActiveTab('builder')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'builder'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-semibold'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Monte a sua</span>
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                NOVO
              </span>
            </button>

            <button
              id="nav-pedidos-btn"
              onClick={() => setActiveTab('pedidos')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all relative ${
                activeTab === 'pedidos'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-semibold'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Acompanhar Pedido</span>
              {activeOrderCount > 0 && (
                <span className="bg-emerald-500 text-stone-950 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {activeOrderCount}
                </span>
              )}
            </button>

            <button
              id="nav-cozinha-btn"
              onClick={() => setActiveTab('cozinha')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'cozinha'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-semibold'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <ChefHat className="w-4 h-4" />
              <span>Cozinha / Admin</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-3">
            
            {/* Supabase Connection Status Badge */}
            <button
              id="supabase-status-btn"
              onClick={onOpenSupabase}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                isConnectedToSupabase
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/80 hover:bg-emerald-900/40'
                  : 'bg-amber-950/40 text-amber-300 border-amber-800/80 hover:bg-amber-900/40'
              }`}
              title={isConnectedToSupabase ? 'Supabase Conectado' : 'Configurar Conexão Supabase'}
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isConnectedToSupabase ? 'Supabase On' : 'Modo Demo (Supabase)'}
              </span>
              <span className={`w-2 h-2 rounded-full ${isConnectedToSupabase ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
            </button>

            {/* Cart Button */}
            <button
              id="open-cart-btn"
              onClick={onOpenCart}
              className="relative flex items-center space-x-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white px-4 py-2.5 rounded-2xl font-semibold shadow-lg shadow-red-900/30 hover:scale-105 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline">Carrinho</span>
              {totalCartCount > 0 && (
                <span className="bg-white text-red-600 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow-inner">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-stone-800/60 overflow-x-auto space-x-1 no-scrollbar">
          <button
            onClick={() => setActiveTab('cardapio')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'cardapio' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Cardápio</span>
          </button>
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'builder' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Monte a Sua</span>
          </button>
          <button
            onClick={() => setActiveTab('pedidos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'pedidos' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Acompanhar ({activeOrderCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('cozinha')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'cozinha' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Cozinha</span>
          </button>
        </div>

      </div>
    </header>
  );
};
