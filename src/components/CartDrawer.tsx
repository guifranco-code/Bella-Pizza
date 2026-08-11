import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, Tag, CreditCard, MapPin, Truck, CheckCircle2, ArrowRight } from 'lucide-react';
import { CartItem, CustomerDetails, Order, PaymentMethod } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onSubmitOrder: (orderDetails: CustomerDetails, totals: { subtotal: number; deliveryFee: number; discount: number; total: number }) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSubmitOrder,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'cart' | 'checkout'>('cart');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');

  // Checkout Form Details
  const [customer, setCustomer] = useState<CustomerDetails>({
    name: '',
    phone: '',
    addressType: 'entrega',
    street: '',
    number: '',
    neighborhood: '',
    city: 'São Paulo',
    zipCode: '',
    paymentMethod: 'pix',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = customer.addressType === 'entrega' ? 8.00 : 0.00;
  const discountAmount = (subtotal * discountPercent) / 100;
  const grandTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  const handleApplyCoupon = () => {
    setCouponError('');
    const cleaned = couponCode.trim().toUpperCase();
    if (cleaned === 'PRIMEIRA10' || cleaned === 'BELLAPIZZA') {
      setDiscountPercent(10);
      setCouponError('');
    } else {
      setCouponError('Cupom inválido. Tente PRIMEIRA10 para 10% OFF!');
    }
  };

  const validateCheckoutForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!customer.name.trim()) errors.name = 'Informe seu nome';
    if (!customer.phone.trim()) errors.phone = 'Informe seu telefone/WhatsApp';

    if (customer.addressType === 'entrega') {
      if (!customer.street.trim()) errors.street = 'Rua é obrigatória';
      if (!customer.number.trim()) errors.number = 'Número é obrigatório';
      if (!customer.neighborhood.trim()) errors.neighborhood = 'Bairro é obrigatório';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCheckoutForm()) return;

    onSubmitOrder(customer, {
      subtotal,
      deliveryFee,
      discount: discountAmount,
      total: grandTotal,
    });
    
    // Reset modal
    setStep('cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-900 text-stone-100 border-l border-stone-800 shadow-2xl flex flex-col justify-between">
          
          {/* Drawer Header */}
          <div className="p-6 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-stone-100">
                  {step === 'cart' ? 'Seu Carrinho' : 'Finalizar Pedido'}
                </h2>
                <p className="text-xs text-stone-400">
                  {cartItems.length} {cartItems.length === 1 ? 'item selecionado' : 'itens selecionados'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {step === 'cart' ? (
              <>
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                    <div className="w-20 h-20 rounded-full bg-stone-800/60 flex items-center justify-center text-stone-500">
                      <ShoppingBag className="w-10 h-10" />
                    </div>
                    <h3 className="text-lg font-bold text-stone-300">Seu carrinho está vazio</h3>
                    <p className="text-xs text-stone-500 max-w-xs">
                      Que tal adicionar uma pizza deliciosa feita no forno a lenha?
                    </p>
                    <button
                      onClick={onClose}
                      className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-6 py-2.5 rounded-xl text-sm"
                    >
                      Ver Cardápio
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Item List */}
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="bg-stone-950/60 border border-stone-800/80 rounded-2xl p-4 flex gap-3 relative group"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-16 h-16 rounded-xl object-cover bg-stone-900 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-stone-100 truncate">
                              {item.name}
                            </h4>
                            <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                              Massa: {item.options.size.toUpperCase()} | Borda: {item.options.crust}
                            </p>

                            {/* Options summary */}
                            {item.options.selectedExtraIngredients && item.options.selectedExtraIngredients.length > 0 && (
                              <p className="text-[10px] text-amber-400/80 line-clamp-1">
                                Extras: {item.options.selectedExtraIngredients.map((e) => e.name).join(', ')}
                              </p>
                            )}

                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-sm font-extrabold text-amber-400">
                                R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                              </span>

                              {/* Quantity Controls */}
                              <div className="flex items-center space-x-2 bg-stone-900 border border-stone-800 px-2 py-1 rounded-xl">
                                <button
                                  onClick={() => onUpdateQuantity(item.id, -1)}
                                  className="text-stone-400 hover:text-white p-0.5"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-xs font-bold text-stone-200 px-1">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => onUpdateQuantity(item.id, 1)}
                                  className="text-stone-400 hover:text-white p-0.5"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-stone-500 hover:text-red-400 p-1 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Coupon Code Input */}
                    <div className="p-4 bg-stone-950/80 rounded-2xl border border-stone-800 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Tag className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-bold text-stone-300">Cupom de Desconto</span>
                      </div>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Ex: PRIMEIRA10"
                          className="flex-1 bg-stone-900 border border-stone-800 text-stone-100 text-xs rounded-xl px-3 py-2 uppercase placeholder-stone-500 focus:outline-none focus:border-amber-500"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                        >
                          Aplicar
                        </button>
                      </div>
                      {couponError && <p className="text-[11px] text-red-400">{couponError}</p>}
                      {discountPercent > 0 && (
                        <p className="text-[11px] text-emerald-400 font-semibold">
                          ✓ Cupom ativado! {discountPercent}% de desconto aplicado no subtotal.
                        </p>
                      )}
                    </div>
                  </>
                )}
              </>
            ) : (
              /* Checkout Step Form */
              <form onSubmit={handleFinalSubmit} className="space-y-5" id="checkout-form">
                
                {/* Tipo de Entrega */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400">
                    Modalidade do Pedido
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCustomer({ ...customer, addressType: 'entrega' })}
                      className={`p-3 rounded-2xl border flex items-center justify-center space-x-2 text-xs font-bold transition-all ${
                        customer.addressType === 'entrega'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                          : 'bg-stone-950/40 border-stone-800 text-stone-400'
                      }`}
                    >
                      <Truck className="w-4 h-4" />
                      <span>Entrega (+R$ 8,00)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomer({ ...customer, addressType: 'retirada' })}
                      className={`p-3 rounded-2xl border flex items-center justify-center space-x-2 text-xs font-bold transition-all ${
                        customer.addressType === 'retirada'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                          : 'bg-stone-950/40 border-stone-800 text-stone-400'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Retirada (Grátis)</span>
                    </button>
                  </div>
                </div>

                {/* Cliente Info */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400">
                    Dados Pessoais
                  </label>
                  <div>
                    <input
                      type="text"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      placeholder="Seu Nome Completo *"
                      className="w-full bg-stone-950 border border-stone-800 text-stone-100 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-500"
                    />
                    {formErrors.name && <p className="text-[10px] text-red-400 mt-0.5">{formErrors.name}</p>}
                  </div>

                  <div>
                    <input
                      type="tel"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="Telefone / WhatsApp *"
                      className="w-full bg-stone-950 border border-stone-800 text-stone-100 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-500"
                    />
                    {formErrors.phone && <p className="text-[10px] text-red-400 mt-0.5">{formErrors.phone}</p>}
                  </div>
                </div>

                {/* Endereço se entrega */}
                {customer.addressType === 'entrega' && (
                  <div className="space-y-3 pt-2 border-t border-stone-800">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-400">
                      Endereço de Entrega
                    </label>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={customer.street}
                          onChange={(e) => setCustomer({ ...customer, street: e.target.value })}
                          placeholder="Rua / Avenida *"
                          className="w-full bg-stone-950 border border-stone-800 text-stone-100 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-500"
                        />
                        {formErrors.street && <p className="text-[10px] text-red-400 mt-0.5">{formErrors.street}</p>}
                      </div>
                      <div>
                        <input
                          type="text"
                          value={customer.number}
                          onChange={(e) => setCustomer({ ...customer, number: e.target.value })}
                          placeholder="Nº *"
                          className="w-full bg-stone-950 border border-stone-800 text-stone-100 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-500"
                        />
                        {formErrors.number && <p className="text-[10px] text-red-400 mt-0.5">{formErrors.number}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={customer.neighborhood}
                        onChange={(e) => setCustomer({ ...customer, neighborhood: e.target.value })}
                        placeholder="Bairro *"
                        className="w-full bg-stone-950 border border-stone-800 text-stone-100 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-500"
                      />
                      <input
                        type="text"
                        value={customer.complement}
                        onChange={(e) => setCustomer({ ...customer, complement: e.target.value })}
                        placeholder="Complemento (Apto, Bloco)"
                        className="w-full bg-stone-950 border border-stone-800 text-stone-100 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                )}

                {/* Forma de Pagamento */}
                <div className="space-y-3 pt-2 border-t border-stone-800">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400">
                    Forma de Pagamento
                  </label>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'pix', label: 'PIX (Aprovação Instantânea)' },
                      { id: 'cartao_credito', label: 'Cartão de Crédito' },
                      { id: 'cartao_debito', label: 'Cartão de Débito' },
                      { id: 'dinheiro', label: 'Dinheiro na Entrega' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setCustomer({ ...customer, paymentMethod: p.id as PaymentMethod })}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                          customer.paymentMethod === p.id
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : 'bg-stone-950/40 border-stone-800 text-stone-400'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  {customer.paymentMethod === 'dinheiro' && (
                    <input
                      type="number"
                      value={customer.changeFor || ''}
                      onChange={(e) => setCustomer({ ...customer, changeFor: Number(e.target.value) })}
                      placeholder="Troco para quanto? (Ex: R$ 100)"
                      className="w-full bg-stone-950 border border-stone-800 text-stone-100 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-500"
                    />
                  )}
                </div>

              </form>
            )}

          </div>

          {/* Drawer Footer Summary & Submit */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-stone-950 border-t border-stone-800 space-y-4">
              
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                {customer.addressType === 'entrega' && (
                  <div className="flex justify-between text-stone-400">
                    <span>Taxa de Entrega</span>
                    <span>R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Desconto Cupom</span>
                    <span>-R$ {discountAmount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-stone-800 flex justify-between text-base font-extrabold text-stone-100">
                  <span>Total</span>
                  <span className="text-amber-400">R$ {grandTotal.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              {step === 'cart' ? (
                <button
                  id="checkout-next-btn"
                  onClick={() => setStep('checkout')}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black py-3.5 rounded-2xl shadow-xl flex items-center justify-center space-x-2 text-sm transition-all"
                >
                  <span>Avançar para o Pagamento</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold px-4 py-3.5 rounded-2xl text-xs"
                  >
                    Voltar
                  </button>
                  <button
                    id="submit-order-btn"
                    type="submit"
                    form="checkout-form"
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-black py-3.5 rounded-2xl shadow-xl text-sm transition-all flex items-center justify-center space-x-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Confirmar & Concluir Pedido</span>
                  </button>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
