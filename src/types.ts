export type PizzaSize = 'broto' | 'media' | 'grande' | 'gigante';
export type CrustType = 'tradicional' | 'catupiry' | 'cheddar' | 'nutella';
export type OrderStatus = 'recebido' | 'preparando' | 'forno' | 'entrega' | 'entregue' | 'cancelado';
export type PaymentMethod = 'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro';

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Ingredient {
  id: string;
  name: string;
  category: 'massa' | 'molho' | 'queijo' | 'carne' | 'vegetal' | 'borda' | 'especial';
  price: number;
  available: boolean;
  color?: string;
}

export interface Pizza {
  id: string;
  name: string;
  description: string;
  category: 'tradicionais' | 'especiais' | 'doces' | 'vegetarianas' | 'bebidas';
  basePrice: number;
  image: string;
  popular?: boolean;
  spicy?: boolean;
  vegetarian?: boolean;
  ingredients: string[];
}

export interface CartItemOption {
  size: PizzaSize;
  crust: CrustType;
  selectedExtraIngredients?: { id: string; name: string; price: number }[];
  removedIngredients?: string[];
  halfAndHalf?: {
    secondPizzaId: string;
    secondPizzaName: string;
    secondPizzaPrice: number;
  };
  notes?: string;
}

export interface CartItem {
  id: string; // Unique cart item instance ID
  pizzaId?: string;
  name: string;
  description: string;
  isCustom?: boolean;
  price: number; // Final item price including size/extras
  quantity: number;
  image: string;
  options: CartItemOption;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  email?: string;
  addressType: 'entrega' | 'retirada';
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  zipCode: string;
  paymentMethod: PaymentMethod;
  changeFor?: number; // Se dinheiro
  notes?: string;
}

export interface Order {
  id: string; // Order UUID or string ID
  customerName: string;
  customerPhone: string;
  deliveryType: 'entrega' | 'retirada';
  address: string;
  neighborhood: string;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  estimatedDeliveryTimeMinutes: number;
}

export interface SupabaseSettings {
  url: string;
  anonKey: string;
  isConnected: boolean;
  tableNamePizzas?: string;
  tableNameOrders?: string;
}
