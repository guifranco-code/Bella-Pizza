import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, Flame, Bike, PackageCheck, AlertCircle, Phone, RefreshCw, Sparkles, MapPin } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { updateOrderStatus } from '../lib/supabase';

interface OrderTrackerProps {
  orders: Order[];
  onRefreshOrders: () => void;
  onGoToMenu: () => void;
}

const STATUS_STEPS: { status: OrderStatus; label: string; desc: string; icon: any }[] = [
  { status: 'recebido', label: 'Pedido Recebido', desc: 'Sua solicitação foi registrada no sistema', icon: CheckCircle2 },
  { status: 'preparando', label: 'Em Preparo na Cozinha', desc: 'O pizzaiolo está abrindo a massa artesanal', icon: Sparkles },
  { status: 'forno', label: 'No Forno a Lenha', desc: 'Assando a 450ºC no forno de pedra', icon: Flame },
  { status: 'entrega', label: 'Saiu para Entrega', desc: 'O entregador já está a caminho do seu endereço', icon: Bike },
  { status: 'entregue', label: 'Pedido Entregue', desc: 'Bom apetite! Aproveite sua pizza bem quentinha', icon: PackageCheck },
];

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  orders,
  onRefreshOrders,
  onGoToMenu,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if (orders.length > 0 && !selectedOrderId) {
      setSelectedOrderId(orders[0].id);
    }
  }, [orders]);

  const activeOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  // Auto progression simulator for testing
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSimulating && activeOrder && activeOrder.status !== 'entregue' && activeOrder.status !== 'cancelado') {
      const statusOrder: OrderStatus[] = ['recebido', 'preparando', 'forno', 'entrega', 'entregue'];
      const currentIndex = statusOrder.indexOf(activeOrder.status);
      if (currentIndex >= 0 && currentIndex < statusOrder.length - 1) {
        timer = setTimeout(async () => {
          const nextStatus = statusOrder[currentIndex + 1];
          await updateOrderStatus(activeOrder.id, nextStatus);
          onRefreshOrders();
        }, 6000); // Advances status every 6s for demo visualization
      } else {
        setIsSimulating(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isSimulating, activeOrder, onRefreshOrders]);

  if (!activeOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-500 mx-auto">
          <Clock className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-stone-100">Nenhum Pedido Encontrado</h2>
        <p className="text-stone-400 text-sm max-w-md mx-auto">
          Você ainda não realizou nenhum pedido nesta sessão. Escolha suas pizzas favoritas no nosso cardápio!
        </p>
        <button
          onClick={onGoToMenu}
          className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-8 py-3 rounded-2xl text-sm shadow-lg transition-colors"
        >
          Explorar Cardápio
        </button>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.status === activeOrder.status);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header with Order Selector */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-amber-500 font-bold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Acompanhamento em Tempo Real</span>
          </div>
          <h2 className="text-2xl font-extrabold text-stone-100">
            Pedido #{activeOrder.id.substring(0, 8)}
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Realizado em: {new Date(activeOrder.createdAt).toLocaleTimeString('pt-BR')} por {activeOrder.customerName}
          </p>
        </div>

        {/* Order Selector & Refresh */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          {orders.length > 1 && (
            <select
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="bg-stone-950 border border-stone-800 text-stone-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
            >
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  #{o.id.substring(0, 6)} - {o.status.toUpperCase()}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={onRefreshOrders}
            className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl transition-colors"
            title="Atualizar Status"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Simulator Toggle */}
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              isSimulating
                ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md'
                : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            {isSimulating ? '⏸️ Simulando (Auto)' : '▶️ Simular Avanço'}
          </button>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8">
        
        {/* Estimated Time Card */}
        <div className="bg-gradient-to-r from-amber-950/40 via-stone-950 to-amber-950/40 border border-amber-500/20 p-5 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-stone-400 font-semibold uppercase">Tempo Estimado de Entrega</p>
              <p className="text-xl sm:text-2xl font-black text-amber-400">
                {activeOrder.status === 'entregue' ? 'Entregue com Sucesso!' : `Aprox. ${activeOrder.estimatedDeliveryTimeMinutes} minutos`}
              </p>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-xs text-stone-400">Status Atual</span>
            <p className="text-sm font-extrabold text-stone-200 uppercase tracking-wide">
              {activeOrder.status}
            </p>
          </div>
        </div>

        {/* Steps Visual Timeline */}
        <div className="relative py-4">
          <div className="space-y-6">
            {STATUS_STEPS.map((step, idx) => {
              const isDone = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const IconComp = step.icon;

              return (
                <div key={step.status} className="flex items-start space-x-4 relative">
                  
                  {/* Connecting Line */}
                  {idx < STATUS_STEPS.length - 1 && (
                    <div
                      className={`absolute left-5 top-10 bottom-0 w-0.5 -ml-px transition-colors duration-500 ${
                        idx < currentStepIndex ? 'bg-amber-500' : 'bg-stone-800'
                      }`}
                      style={{ height: 'calc(100% + 8px)' }}
                    />
                  )}

                  {/* Circle Icon Badge */}
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center z-10 transition-all duration-300 ${
                      isCurrent
                        ? 'bg-amber-500 text-stone-950 ring-4 ring-amber-500/20 font-bold scale-110 shadow-lg'
                        : isDone
                        ? 'bg-amber-500/20 border border-amber-500/50 text-amber-400'
                        : 'bg-stone-950 border border-stone-800 text-stone-600'
                    }`}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>

                  {/* Step Info */}
                  <div className="pt-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-base font-bold transition-colors ${
                          isCurrent
                            ? 'text-amber-400'
                            : isDone
                            ? 'text-stone-200'
                            : 'text-stone-500'
                        }`}
                      >
                        {step.label}
                      </h4>

                      {isCurrent && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold animate-pulse">
                          EM ANDAMENTO
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Order Items & Customer Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Item Summary */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-stone-100 border-b border-stone-800 pb-3">
            Itens do Pedido
          </h3>

          <div className="space-y-3 divide-y divide-stone-800/60">
            {activeOrder.items.map((item, idx) => (
              <div key={idx} className="pt-3 first:pt-0 flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-stone-200">
                    {item.quantity}x {item.name}
                  </p>
                  <p className="text-xs text-stone-400">
                    Massa: {item.options.size.toUpperCase()} | Borda: {item.options.crust}
                  </p>
                  {item.options.notes && (
                    <p className="text-[11px] text-amber-400/90 italic mt-0.5">
                      Obs: "{item.options.notes}"
                    </p>
                  )}
                </div>
                <span className="text-sm font-semibold text-stone-300">
                  R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-800 space-y-1 text-xs text-stone-400">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>R$ {activeOrder.subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxa de Entrega:</span>
              <span>R$ {activeOrder.deliveryFee.toFixed(2).replace('.', ',')}</span>
            </div>
            {activeOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Desconto:</span>
                <span>-R$ {activeOrder.discount.toFixed(2).replace('.', ',')}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-extrabold text-amber-400 pt-2 border-t border-stone-800">
              <span>Total Pago:</span>
              <span>R$ {activeOrder.total.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        </div>

        {/* Customer & Delivery Details */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-100 border-b border-stone-800 pb-3">
              Informações de Entrega
            </h3>

            <div className="space-y-3 mt-4 text-xs text-stone-300">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-stone-200">
                    {activeOrder.deliveryType === 'entrega' ? 'Endereço de Entrega:' : 'Retirada no Balcão:'}
                  </p>
                  <p className="text-stone-400">
                    {activeOrder.address ? `${activeOrder.address}, ${activeOrder.neighborhood}` : 'Retirada presencial na Pizzaria Bella Italia'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-stone-200">Telefone: </span>
                  <span className="text-stone-400">{activeOrder.customerPhone}</span>
                </div>
              </div>

              <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800">
                <span className="text-stone-400 block font-medium">Forma de Pagamento:</span>
                <span className="text-amber-400 font-bold uppercase">{activeOrder.paymentMethod.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          <a
            href={`https://wa.me/5511999999999?text=Olá,%20gostaria%20de%20saber%20sobre%20meu%20pedido%20%23${activeOrder.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center space-x-2 transition-colors shadow-lg"
          >
            <Phone className="w-4 h-4" />
            <span>Dúvidas? Falar com a Pizzaria no WhatsApp</span>
          </a>
        </div>

      </div>

    </div>
  );
};
