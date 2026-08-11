import React from 'react';
import { Flame, Sparkles, Leaf, Plus, Info } from 'lucide-react';
import { Pizza } from '../types';

interface PizzaCardProps {
  pizza: Pizza;
  onSelectPizza: (pizza: Pizza) => void;
  onQuickAdd: (pizza: Pizza) => void;
}

export const PizzaCard: React.FC<PizzaCardProps> = ({ pizza, onSelectPizza, onQuickAdd }) => {
  return (
    <div 
      id={`pizza-card-${pizza.id}`}
      className="group bg-stone-900/80 hover:bg-stone-900 border border-stone-800/80 hover:border-amber-500/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-950">
        <img
          src={pizza.image}
          alt={pizza.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/30" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {pizza.popular && (
            <span className="bg-amber-500 text-stone-950 text-xs font-black uppercase px-2.5 py-1 rounded-full shadow-lg flex items-center space-x-1">
              <Flame className="w-3 h-3 fill-stone-950" />
              <span>Mais Pedida</span>
            </span>
          )}
          {pizza.vegetarian && (
            <span className="bg-emerald-600 text-white text-xs font-bold uppercase px-2.5 py-1 rounded-full shadow-lg flex items-center space-x-1">
              <Leaf className="w-3 h-3" />
              <span>Veggie</span>
            </span>
          )}
          {pizza.spicy && (
            <span className="bg-red-600 text-white text-xs font-bold uppercase px-2 py-1 rounded-full shadow-lg">
              🌶️ Picante
            </span>
          )}
        </div>

        {/* Category Tag */}
        <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-md border border-stone-700/60 text-stone-300 text-xs font-medium px-2.5 py-0.5 rounded-lg">
          {pizza.category === 'tradicionais' && 'Tradicional'}
          {pizza.category === 'especiais' && 'Gourmet'}
          {pizza.category === 'doces' && 'Doce'}
          {pizza.category === 'vegetarianas' && 'Vegetariana'}
          {pizza.category === 'bebidas' && 'Bebida'}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-bold text-stone-100 group-hover:text-amber-400 transition-colors line-clamp-1">
              {pizza.name}
            </h3>
          </div>

          <p className="text-xs text-stone-400 mt-2 line-clamp-2 leading-relaxed">
            {pizza.description}
          </p>

          {/* Ingredient Pills */}
          {pizza.ingredients && pizza.ingredients.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {pizza.ingredients.slice(0, 4).map((ing, idx) => (
                <span key={idx} className="text-[10px] text-stone-400 bg-stone-800/60 px-2 py-0.5 rounded-md">
                  {ing}
                </span>
              ))}
              {pizza.ingredients.length > 4 && (
                <span className="text-[10px] text-amber-500 font-medium px-1">
                  +{pizza.ingredients.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card Footer: Price & Action */}
        <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-stone-400 uppercase tracking-wider block font-medium">A partir de</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-sm font-semibold text-amber-500">R$</span>
              <span className="text-2xl font-black text-stone-100">
                {pizza.basePrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id={`quick-add-${pizza.id}`}
              onClick={() => onSelectPizza(pizza)}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 p-2.5 rounded-2xl transition-colors"
              title="Personalizar / Ver Detalhes"
            >
              <Info className="w-4 h-4" />
            </button>

            <button
              id={`custom-add-${pizza.id}`}
              onClick={() => onSelectPizza(pizza)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold px-4 py-2.5 rounded-2xl shadow-md hover:shadow-amber-500/20 active:scale-95 transition-all flex items-center space-x-1 text-sm"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Pedir</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
