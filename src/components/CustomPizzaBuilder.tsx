import React, { useState } from 'react';
import { Sparkles, Check, ChefHat, Plus, Trash2, Pizza as PizzaIcon } from 'lucide-react';
import { CRUST_OPTIONS, CUSTOM_BUILDER_INGREDIENTS, PIZZA_SIZES } from '../data/pizzas';
import { CartItem, CrustType, Ingredient, PizzaSize } from '../types';

interface CustomPizzaBuilderProps {
  onAddToCart: (cartItem: CartItem) => void;
  onGoToMenu: () => void;
}

export const CustomPizzaBuilder: React.FC<CustomPizzaBuilderProps> = ({
  onAddToCart,
  onGoToMenu,
}) => {
  const [size, setSize] = useState<PizzaSize>('grande');
  const [crust, setCrust] = useState<CrustType>('catupiry');
  const [pizzaName, setPizzaName] = useState('Minha Pizza Exclusiva');
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<string[]>([
    'molho-tomate',
    'queijo-mussarela',
    'carne-calabresa',
    'veg-manjericao',
  ]);

  const currentSizeObj = PIZZA_SIZES.find((s) => s.id === size) || PIZZA_SIZES[2];
  const currentCrustObj = CRUST_OPTIONS.find((c) => c.id === crust) || CRUST_OPTIONS[0];

  const selectedIngredients = CUSTOM_BUILDER_INGREDIENTS.filter((ing) =>
    selectedIngredientIds.includes(ing.id)
  );

  // Price Calculation: Base dough (R$ 28) + Size Multiplier + Crust + Toppings Sum
  const baseDoughPrice = 28;
  const toppingsSum = selectedIngredients.reduce((sum, ing) => sum + ing.price, 0);
  const totalPrice = (baseDoughPrice + toppingsSum) * currentSizeObj.multiplier + currentCrustObj.price;

  const toggleIngredient = (id: string) => {
    if (selectedIngredientIds.includes(id)) {
      setSelectedIngredientIds(selectedIngredientIds.filter((i) => i !== id));
    } else {
      if (selectedIngredientIds.length >= 8) {
        alert('Você atingiu o limite de 8 ingredientes por pizza para garantir o assamento perfeito!');
        return;
      }
      setSelectedIngredientIds([...selectedIngredientIds, id]);
    }
  };

  const handleAddCustomPizzaToCart = () => {
    const ingredientNames = selectedIngredients.map((i) => i.name);
    
    const cartItem: CartItem = {
      id: `custom-pizza-${Date.now()}`,
      name: pizzaName || 'Pizza Customizada do Chef',
      description: `Massa ${currentSizeObj.name}, Borda ${currentCrustObj.name}. Com: ${ingredientNames.join(', ')}.`,
      isCustom: true,
      price: totalPrice,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      options: {
        size: size,
        crust: crust,
        selectedExtraIngredients: selectedIngredients.map((ing) => ({
          id: ing.id,
          name: ing.name,
          price: ing.price,
        })),
      },
    };

    onAddToCart(cartItem);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 border border-amber-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-extrabold uppercase px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Monte do Seu Jeito</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-100 tracking-tight">
            Crie sua Pizza Personalizada
          </h2>
          <p className="text-stone-300 text-sm max-w-xl">
            Escolha o tamanho, a borda recheada, os molhos, queijos e seus ingredientes favoritos. Nós assamos no forno a lenha!
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-stone-950/80 p-3 rounded-2xl border border-stone-800">
          <ChefHat className="w-8 h-8 text-amber-500 animate-bounce" />
          <div>
            <p className="text-xs text-stone-400 font-medium">Preço Atual</p>
            <p className="text-2xl font-black text-amber-400">
              R$ {totalPrice.toFixed(2).replace('.', ',')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Visual Interactive Pizza Canvas */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center sticky top-28">
            <div className="w-full flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Pré-visualização Visual
              </span>
              <span className="text-xs bg-amber-500/10 text-amber-400 font-bold px-2.5 py-1 rounded-lg border border-amber-500/30">
                {selectedIngredients.length} Ingredientes
              </span>
            </div>

            {/* Pizza Crust & Layer Visualizer */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-amber-800/80 border-[14px] border-amber-700 shadow-2xl flex items-center justify-center overflow-hidden transform hover:scale-105 transition-transform duration-300">
              
              {/* Dough base texture */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-amber-200 via-amber-100 to-amber-300 flex items-center justify-center shadow-inner">
                
                {/* Sauce Layer */}
                {selectedIngredientIds.some((id) => id.startsWith('molho')) && (
                  <div className="absolute inset-3 rounded-full bg-red-600/90 shadow-inner opacity-90 animate-fadeIn" />
                )}

                {/* Cheese Layer */}
                {selectedIngredientIds.some((id) => id.startsWith('queijo')) && (
                  <div className="absolute inset-5 rounded-full bg-yellow-200/80 shadow-sm opacity-90 backdrop-blur-[1px]" />
                )}

                {/* Render Selected Topping Dots / Icons */}
                <div className="absolute inset-6 grid grid-cols-4 gap-2 items-center justify-items-center p-4">
                  {selectedIngredients.map((ing, idx) => (
                    <div
                      key={`${ing.id}-${idx}`}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${ing.color || 'bg-stone-700'} flex items-center justify-center text-[10px] font-bold text-white shadow-md border border-white/20 transform hover:scale-125 transition-transform`}
                      title={ing.name}
                    >
                      {ing.name.substring(0, 2).toUpperCase()}
                    </div>
                  ))}
                </div>

                {/* Center Badge */}
                <div className="z-10 bg-stone-950/80 text-amber-400 font-extrabold text-xs px-3 py-1 rounded-full border border-amber-500/40 shadow-lg text-center backdrop-blur-sm">
                  {currentSizeObj.name}
                </div>
              </div>
            </div>

            {/* Pizza Name Input */}
            <div className="w-full mt-6 space-y-2">
              <label className="block text-xs font-medium text-stone-400">
                Dê um nome para sua criação:
              </label>
              <input
                type="text"
                value={pizzaName}
                onChange={(e) => setPizzaName(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 text-stone-100 font-bold rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Selected Ingredient Chips */}
            <div className="w-full mt-4 space-y-2">
              <span className="text-xs font-semibold text-stone-400 block">Ingredientes Selecionados:</span>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {selectedIngredients.map((ing) => (
                  <span
                    key={ing.id}
                    className="bg-stone-800 border border-stone-700 text-stone-200 text-xs px-2.5 py-1 rounded-lg flex items-center space-x-1"
                  >
                    <span>{ing.name}</span>
                    <button
                      onClick={() => toggleIngredient(ing.id)}
                      className="text-stone-400 hover:text-red-400 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Action Submit */}
            <button
              id="add-custom-pizza-btn"
              onClick={handleAddCustomPizzaToCart}
              className="w-full mt-6 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-stone-950 font-black py-4 px-6 rounded-2xl shadow-xl hover:shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center space-x-2 text-base"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>Adicionar Pizza ao Carrinho (R$ {totalPrice.toFixed(2).replace('.', ',')})</span>
            </button>
          </div>
        </div>

        {/* Right Side: Step-by-Step Ingredient Selection Controls */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Step 1: Size */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-stone-100 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 text-xs font-black flex items-center justify-center">1</span>
              <span>Escolha o Tamanho da Massa</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PIZZA_SIZES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSize(s.id as PizzaSize)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    size === s.id
                      ? 'bg-amber-500/10 border-amber-500 text-stone-100 ring-2 ring-amber-500/50'
                      : 'bg-stone-950/40 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="font-bold text-sm text-stone-100">{s.name}</div>
                  <div className="text-[11px] text-stone-400 mt-0.5">{s.slices}</div>
                  <div className="text-[10px] text-amber-400 font-semibold mt-2">{s.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Crust */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-stone-100 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 text-xs font-black flex items-center justify-center">2</span>
              <span>Escolha o Recheio da Borda</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CRUST_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCrust(c.id as CrustType)}
                  className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    crust === c.id
                      ? 'bg-amber-500/10 border-amber-500 text-stone-100 ring-2 ring-amber-500/50'
                      : 'bg-stone-950/40 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm text-stone-100">{c.name}</div>
                    <div className="text-xs text-stone-400">{c.description}</div>
                  </div>
                  <span className="text-xs font-bold text-amber-400 ml-2">
                    {c.price > 0 ? `+R$ ${c.price}` : 'Grátis'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Toppings Categories */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-stone-100 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 text-xs font-black flex items-center justify-center">3</span>
              <span>Escolha os Ingredientes</span>
            </h3>

            {/* Grouped Toppings */}
            {(['molho', 'queijo', 'carne', 'vegetal', 'especial'] as const).map((catGroup) => {
              const groupItems = CUSTOM_BUILDER_INGREDIENTS.filter((i) => i.category === catGroup);
              const groupTitles: Record<string, string> = {
                molho: '🍅 Base & Molhos',
                queijo: '🧀 Queijos Cremosos & Especiais',
                carne: '🥩 Carnes & Proteínas',
                vegetal: '🥦 Vegetais & Ervas Frescas',
                especial: '✨ Toques Especiais do Chef',
              };

              return (
                <div key={catGroup} className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    {groupTitles[catGroup]}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {groupItems.map((ing) => {
                      const isSelected = selectedIngredientIds.includes(ing.id);
                      return (
                        <button
                          key={ing.id}
                          onClick={() => toggleIngredient(ing.id)}
                          className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-500 text-stone-100 ring-1 ring-amber-500'
                              : 'bg-stone-950/40 border-stone-800 text-stone-300 hover:border-stone-700'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className={`w-3 h-3 rounded-full ${ing.color || 'bg-stone-600'}`} />
                            <span className="text-sm font-semibold">{ing.name}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-stone-400">
                              +R$ {ing.price.toFixed(2)}
                            </span>
                            <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${isSelected ? 'bg-amber-500 text-stone-950' : 'bg-stone-800'}`}>
                              {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3 h-3 text-stone-500" />}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
