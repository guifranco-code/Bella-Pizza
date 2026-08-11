import React, { useState } from 'react';
import { X, Plus, Minus, Check, Sparkles, ChefHat } from 'lucide-react';
import { CRUST_OPTIONS, CUSTOM_BUILDER_INGREDIENTS, PIZZA_SIZES } from '../data/pizzas';
import { CartItem, CrustType, Pizza, PizzaSize } from '../types';

interface PizzaDetailsModalProps {
  pizza: Pizza | null;
  allPizzas: Pizza[];
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export const PizzaDetailsModal: React.FC<PizzaDetailsModalProps> = ({
  pizza,
  allPizzas,
  onClose,
  onAddToCart,
}) => {
  if (!pizza) return null;

  const [selectedSize, setSelectedSize] = useState<PizzaSize>('media');
  const [selectedCrust, setSelectedCrust] = useState<CrustType>('tradicional');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  
  // Half & Half state
  const [isHalfAndHalf, setIsHalfAndHalf] = useState(false);
  const [secondPizzaId, setSecondPizzaId] = useState<string>('');

  // Extra toppings selection
  const [selectedExtras, setSelectedExtras] = useState<{ id: string; name: string; price: number }[]>([]);

  // Removed default ingredients
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);

  const currentSizeObj = PIZZA_SIZES.find((s) => s.id === selectedSize) || PIZZA_SIZES[1];
  const currentCrustObj = CRUST_OPTIONS.find((c) => c.id === selectedCrust) || CRUST_OPTIONS[0];

  // Price Calculation
  const secondPizza = allPizzas.find((p) => p.id === secondPizzaId);
  const basePizzaPrice = isHalfAndHalf && secondPizza 
    ? Math.max(pizza.basePrice, secondPizza.basePrice) // Take higher price for 1/2 and 1/2
    : pizza.basePrice;

  const sizePrice = basePizzaPrice * currentSizeObj.multiplier;
  const crustPrice = currentCrustObj.price;
  const extrasTotalPrice = selectedExtras.reduce((sum, item) => sum + item.price, 0);

  const unitPrice = sizePrice + crustPrice + extrasTotalPrice;
  const totalPrice = unitPrice * quantity;

  const handleToggleExtra = (extra: { id: string; name: string; price: number }) => {
    if (selectedExtras.some((e) => e.id === extra.id)) {
      setSelectedExtras(selectedExtras.filter((e) => e.id !== extra.id));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  const handleToggleRemoveIng = (ing: string) => {
    if (removedIngredients.includes(ing)) {
      setRemovedIngredients(removedIngredients.filter((i) => i !== ing));
    } else {
      setRemovedIngredients([...removedIngredients, ing]);
    }
  };

  const handleConfirmAddToCart = () => {
    const itemTitle = isHalfAndHalf && secondPizza
      ? `Meia ${pizza.name} / Meia ${secondPizza.name}`
      : pizza.name;

    const cartItem: CartItem = {
      id: `pizza-${pizza.id}-${Date.now()}`,
      pizzaId: pizza.id,
      name: itemTitle,
      description: pizza.description,
      price: unitPrice,
      quantity: quantity,
      image: pizza.image,
      options: {
        size: selectedSize,
        crust: selectedCrust,
        selectedExtraIngredients: selectedExtras,
        removedIngredients: removedIngredients,
        halfAndHalf: isHalfAndHalf && secondPizza ? {
          secondPizzaId: secondPizza.id,
          secondPizzaName: secondPizza.name,
          secondPizzaPrice: secondPizza.basePrice
        } : undefined,
        notes: notes,
      },
    };

    onAddToCart(cartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div 
        className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-stone-100 flex flex-col relative"
        id="pizza-modal-container"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-stone-950/80 hover:bg-stone-800 text-stone-300 p-2 rounded-full border border-stone-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Image */}
        <div className="relative h-56 sm:h-64 w-full bg-stone-950 flex-shrink-0">
          <img
            src={pizza.image}
            alt={pizza.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
          
          <div className="absolute bottom-4 left-6 right-6">
            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold uppercase px-3 py-1 rounded-full mb-2 inline-block">
              {pizza.category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-100">
              {pizza.name}
            </h2>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 flex-1">
          <p className="text-sm text-stone-300 leading-relaxed bg-stone-950/40 p-3.5 rounded-2xl border border-stone-800/80">
            {pizza.description}
          </p>

          {/* Option: Meia a Meia */}
          {pizza.category !== 'bebidas' && (
            <div className="p-4 bg-stone-950/60 rounded-2xl border border-stone-800">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isHalfAndHalf}
                  onChange={(e) => setIsHalfAndHalf(e.target.checked)}
                  className="w-5 h-5 rounded border-stone-700 text-amber-500 focus:ring-amber-500 bg-stone-800"
                />
                <div className="flex items-center space-x-2">
                  <ChefHat className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-bold text-stone-200">
                    Fazer Pizza Meia a Meia (Dois Sabores)?
                  </span>
                </div>
              </label>

              {isHalfAndHalf && (
                <div className="mt-3 pt-3 border-t border-stone-800">
                  <label className="block text-xs font-medium text-stone-400 mb-1.5">
                    Selecione o segundo sabor:
                  </label>
                  <select
                    value={secondPizzaId}
                    onChange={(e) => setSecondPizzaId(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 text-stone-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="">-- Escolha a outra metade --</option>
                    {allPizzas
                      .filter((p) => p.id !== pizza.id && p.category !== 'bebidas')
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (R$ {p.basePrice.toFixed(2)})
                        </option>
                      ))}
                  </select>
                  <p className="text-[11px] text-amber-400/80 mt-1">
                    * No meio a meio, vigora o valor do sabor de maior valor base.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Section: Size Selection */}
          <div>
            <label className="block text-sm font-bold text-stone-200 mb-3 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>1. Escolha o Tamanho</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PIZZA_SIZES.map((size) => {
                const calculatedPrice = basePizzaPrice * size.multiplier;
                const isSelected = selectedSize === size.id;
                return (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id as PizzaSize)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 text-stone-100 shadow-md ring-1 ring-amber-500/50'
                        : 'bg-stone-950/40 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <div className="font-bold text-sm text-stone-100">{size.name}</div>
                    <div className="text-[11px] text-stone-400">{size.slices}</div>
                    <div className="mt-2 text-xs font-bold text-amber-400">
                      R$ {calculatedPrice.toFixed(2).replace('.', ',')}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Crust Selection */}
          {pizza.category !== 'bebidas' && (
            <div>
              <label className="block text-sm font-bold text-stone-200 mb-3 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>2. Escolha a Borda</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CRUST_OPTIONS.map((crust) => {
                  const isSelected = selectedCrust === crust.id;
                  return (
                    <button
                      key={crust.id}
                      onClick={() => setSelectedCrust(crust.id as CrustType)}
                      className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 text-stone-100 ring-1 ring-amber-500/50'
                          : 'bg-stone-950/40 border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-sm text-stone-100">{crust.name}</div>
                        <div className="text-[11px] text-stone-400">{crust.description}</div>
                      </div>
                      <span className="text-xs font-bold text-amber-400 ml-2">
                        {crust.price > 0 ? `+R$ ${crust.price.toFixed(2)}` : 'Grátis'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section: Extra Toppings */}
          {pizza.category !== 'bebidas' && (
            <div>
              <label className="block text-sm font-bold text-stone-200 mb-2 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>3. Adicionar Ingredientes Extras</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1 custom-scrollbar">
                {CUSTOM_BUILDER_INGREDIENTS.map((ing) => {
                  const isSelected = selectedExtras.some((e) => e.id === ing.id);
                  return (
                    <button
                      key={ing.id}
                      onClick={() => handleToggleExtra({ id: ing.id, name: ing.name, price: ing.price })}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold'
                          : 'bg-stone-950/40 border-stone-800 text-stone-300 hover:bg-stone-800'
                      }`}
                    >
                      <span className="truncate pr-1">{ing.name}</span>
                      <span className="text-[10px] opacity-80">+R${ing.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section: Remove Default Ingredients */}
          {pizza.ingredients && pizza.ingredients.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                Remover algum ingrediente padrão?
              </label>
              <div className="flex flex-wrap gap-2">
                {pizza.ingredients.map((ing) => {
                  const isRemoved = removedIngredients.includes(ing);
                  return (
                    <button
                      key={ing}
                      onClick={() => handleToggleRemoveIng(ing)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        isRemoved
                          ? 'bg-red-950/80 text-red-300 border-red-700 line-through'
                          : 'bg-stone-800/80 text-stone-300 border-stone-700'
                      }`}
                    >
                      {isRemoved ? `Sem ${ing}` : ing}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Observações */}
          <div>
            <label className="block text-xs font-medium text-stone-400 mb-1.5">
              Observações do Pedido (Ex: Bem passada, pouca cebola, etc.)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Digite aqui alguma instrução para a cozinha..."
              className="w-full bg-stone-950/60 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-stone-950 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Quantity Controls */}
          <div className="flex items-center space-x-3 bg-stone-900 border border-stone-800 p-1.5 rounded-2xl">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-9 h-9 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center font-bold text-lg"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-base font-bold text-stone-100">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-9 h-9 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center font-bold text-lg"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Submit */}
          <button
            id="add-to-cart-confirm-btn"
            onClick={handleConfirmAddToCart}
            className="w-full sm:w-auto flex-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-stone-950 font-extrabold px-6 py-3.5 rounded-2xl shadow-xl hover:shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-between text-base"
          >
            <span>Adicionar ao Carrinho</span>
            <span className="bg-stone-950 text-amber-400 px-3 py-1 rounded-xl text-sm font-black">
              R$ {totalPrice.toFixed(2).replace('.', ',')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
