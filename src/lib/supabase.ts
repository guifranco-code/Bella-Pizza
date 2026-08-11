import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DEFAULT_PIZZAS } from '../data/pizzas';
import { Order, OrderStatus, Pizza, SupabaseSettings } from '../types';

// Storage keys for dynamic config and local fallback
const STORAGE_SUPABASE_URL = 'bella_pizza_supabase_url';
const STORAGE_SUPABASE_KEY = 'bella_pizza_supabase_key';
const STORAGE_ORDERS = 'bella_pizza_local_orders';
const STORAGE_PIZZAS = 'bella_pizza_local_pizzas';

let supabaseInstance: SupabaseClient | null = null;

// Helper to retrieve current credentials
export function getSupabaseSettings(): SupabaseSettings {
  const metaEnv = (import.meta as any).env || {};
  const envUrl = metaEnv.VITE_SUPABASE_URL || '';
  const envKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';
  
  const savedUrl = localStorage.getItem(STORAGE_SUPABASE_URL) || envUrl;
  const savedKey = localStorage.getItem(STORAGE_SUPABASE_KEY) || envKey;

  const isValid = Boolean(savedUrl && savedKey && savedUrl.startsWith('http') && savedKey.length > 10);

  return {
    url: savedUrl,
    anonKey: savedKey,
    isConnected: isValid,
  };
}

export function saveSupabaseSettings(url: string, anonKey: string) {
  localStorage.setItem(STORAGE_SUPABASE_URL, url.trim());
  localStorage.setItem(STORAGE_SUPABASE_KEY, anonKey.trim());
  supabaseInstance = null; // reset client instance
}

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  const settings = getSupabaseSettings();
  if (settings.isConnected) {
    try {
      supabaseInstance = createClient(settings.url, settings.anonKey);
      return supabaseInstance;
    } catch (e) {
      console.warn('Erro ao inicializar cliente Supabase:', e);
      return null;
    }
  }

  return null;
}

// Data Services: Fetch Pizzas
export async function getPizzas(): Promise<Pizza[]> {
  const client = getSupabaseClient();
  
  if (client) {
    try {
      const { data, error } = await client
        .from('pizzas')
        .select('*')
        .order('id');
      
      if (!error && data && data.length > 0) {
        return data as Pizza[];
      }
    } catch (err) {
      console.warn('Falha ao buscar pizzas do Supabase. Utilizando armazenamento local/padrão:', err);
    }
  }

  // Fallback to local storage or defaults
  const local = localStorage.getItem(STORAGE_PIZZAS);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      // ignore
    }
  }

  localStorage.setItem(STORAGE_PIZZAS, JSON.stringify(DEFAULT_PIZZAS));
  return DEFAULT_PIZZAS;
}

// Data Services: Add / Update Pizza (Admin)
export async function savePizza(pizza: Pizza): Promise<boolean> {
  const client = getSupabaseClient();

  if (client) {
    try {
      const { error } = await client
        .from('pizzas')
        .upsert({
          id: pizza.id,
          name: pizza.name,
          description: pizza.description,
          category: pizza.category,
          base_price: pizza.basePrice,
          image: pizza.image,
          popular: pizza.popular || false,
          spicy: pizza.spicy || false,
          vegetarian: pizza.vegetarian || false,
          ingredients: pizza.ingredients,
        });

      if (!error) return true;
    } catch (err) {
      console.error('Erro ao salvar pizza no Supabase:', err);
    }
  }

  // Fallback local
  const pizzas = await getPizzas();
  const existingIndex = pizzas.findIndex((p) => p.id === pizza.id);
  if (existingIndex >= 0) {
    pizzas[existingIndex] = pizza;
  } else {
    pizzas.push(pizza);
  }
  localStorage.setItem(STORAGE_PIZZAS, JSON.stringify(pizzas));
  return true;
}

// Data Services: Create Order
export async function createOrder(order: Order): Promise<{ success: boolean; orderId: string; message?: string }> {
  const client = getSupabaseClient();

  if (client) {
    try {
      const { data, error } = await client
        .from('orders')
        .insert({
          id: order.id,
          customer_name: order.customerName,
          customer_phone: order.customerPhone,
          delivery_type: order.deliveryType,
          address: order.address,
          neighborhood: order.neighborhood,
          payment_method: order.paymentMethod,
          items: order.items,
          subtotal: order.subtotal,
          delivery_fee: order.deliveryFee,
          discount: order.discount,
          total: order.total,
          status: order.status,
          estimated_delivery_time_minutes: order.estimatedDeliveryTimeMinutes,
          created_at: order.createdAt,
        })
        .select()
        .single();

      if (!error && data) {
        return { success: true, orderId: data.id };
      } else if (error) {
        console.warn('Aviso do Supabase ao criar pedido (usando fallback local):', error.message);
      }
    } catch (err) {
      console.error('Erro ao salvar pedido no Supabase:', err);
    }
  }

  // Fallback local storage
  const existingOrders = getLocalOrders();
  existingOrders.unshift(order);
  localStorage.setItem(STORAGE_ORDERS, JSON.stringify(existingOrders));

  return {
    success: true,
    orderId: order.id,
    message: client ? undefined : 'Pedido salvo localmente. Conecte ao Supabase para sincronização em nuvem.',
  };
}

// Fetch Orders
export async function getOrders(): Promise<Order[]> {
  const client = getSupabaseClient();

  if (client) {
    try {
      const { data, error } = await client
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((d) => ({
          id: d.id,
          customerName: d.customer_name,
          customerPhone: d.customer_phone,
          deliveryType: d.delivery_type,
          address: d.address,
          neighborhood: d.neighborhood,
          paymentMethod: d.payment_method,
          items: d.items,
          subtotal: Number(d.subtotal),
          deliveryFee: Number(d.delivery_fee),
          discount: Number(d.discount),
          total: Number(d.total),
          status: d.status as OrderStatus,
          createdAt: d.created_at,
          estimatedDeliveryTimeMinutes: d.estimated_delivery_time_minutes || 40,
        }));
      }
    } catch (err) {
      console.warn('Erro ao carregar pedidos do Supabase:', err);
    }
  }

  return getLocalOrders();
}

// Update Order Status (Admin)
export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
  const client = getSupabaseClient();

  if (client) {
    try {
      const { error } = await client
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (!error) return true;
    } catch (err) {
      console.error('Erro ao atualizar status no Supabase:', err);
    }
  }

  // Fallback local
  const orders = getLocalOrders();
  const order = orders.find((o) => o.id === orderId);
  if (order) {
    order.status = status;
    localStorage.setItem(STORAGE_ORDERS, JSON.stringify(orders));
    return true;
  }
  return false;
}

function getLocalOrders(): Order[] {
  const local = localStorage.getItem(STORAGE_ORDERS);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      return [];
    }
  }
  return [];
}

// SQL Schema for Supabase Setup with Storage Policies and RLS
export const SUPABASE_SQL_SCHEMA = `-- =============================================================
-- SCRIPT DE CONFIGURAÇÃO DO SUPABASE PARA O BELLA PIZZA
-- Inclui: Tabelas, Dados Iniciais, Políticas RLS e Armazenamento (Storage)
-- =============================================================

-- 1. Habilitar extensão para IDs UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------
-- 2. TABELA DE CARDÁPIO DE PIZZAS (public.pizzas)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pizzas (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL,
    image TEXT,
    popular BOOLEAN DEFAULT false,
    spicy BOOLEAN DEFAULT false,
    vegetarian BOOLEAN DEFAULT false,
    ingredients JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -------------------------------------------------------------
-- 3. TABELA DE PEDIDOS (public.orders)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    delivery_type TEXT NOT NULL,
    address TEXT,
    neighborhood TEXT,
    payment_method TEXT NOT NULL,
    items JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    delivery_fee NUMERIC(10, 2) DEFAULT 0,
    discount NUMERIC(10, 2) DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'recebido',
    estimated_delivery_time_minutes INTEGER DEFAULT 45,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -------------------------------------------------------------
-- 4. POLÍTICAS DE SEGURANÇA DE LINHA (RLS - ROW LEVEL SECURITY)
-- -------------------------------------------------------------
ALTER TABLE public.pizzas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se existirem para evitar duplicidade
DROP POLICY IF EXISTS "Leitura pública de pizzas" ON public.pizzas;
DROP POLICY IF EXISTS "Permitir inserção e edição de pizzas" ON public.pizzas;
DROP POLICY IF EXISTS "Permitir leitura pública de pedidos" ON public.orders;
DROP POLICY IF EXISTS "Permitir criação pública de pedidos" ON public.orders;
DROP POLICY IF EXISTS "Permitir atualização do status dos pedidos" ON public.orders;

-- Políticas da Tabela 'pizzas'
CREATE POLICY "Leitura pública de pizzas" 
    ON public.pizzas FOR SELECT 
    USING (true);

CREATE POLICY "Permitir inserção e edição de pizzas" 
    ON public.pizzas FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- Políticas da Tabela 'orders'
CREATE POLICY "Permitir leitura pública de pedidos" 
    ON public.orders FOR SELECT 
    USING (true);

CREATE POLICY "Permitir criação pública de pedidos" 
    ON public.orders FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Permitir atualização do status dos pedidos" 
    ON public.orders FOR UPDATE 
    USING (true) 
    WITH CHECK (true);

-- -------------------------------------------------------------
-- 5. BUCKET DE ARMAZENAMENTO (SUPABASE STORAGE) & POLÍTICAS
-- -------------------------------------------------------------
-- Criar Bucket 'pizza-images' para fotos de pizzas do cardápio
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'pizza-images', 
    'pizza-images', 
    true, 
    5242880, -- Limite de 5MB por arquivo
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Remover políticas antigas de armazenamento se existirem
DROP POLICY IF EXISTS "Acesso público para leitura de imagens" ON storage.objects;
DROP POLICY IF EXISTS "Permitir upload público de imagens de pizzas" ON storage.objects;
DROP POLICY IF EXISTS "Permitir alteração de imagens de pizzas" ON storage.objects;
DROP POLICY IF EXISTS "Permitir remoção de imagens de pizzas" ON storage.objects;

-- Políticas para 'storage.objects' no bucket 'pizza-images'
CREATE POLICY "Acesso público para leitura de imagens" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'pizza-images');

CREATE POLICY "Permitir upload público de imagens de pizzas" 
    ON storage.objects FOR INSERT 
    WITH CHECK (bucket_id = 'pizza-images');

CREATE POLICY "Permitir alteração de imagens de pizzas" 
    ON storage.objects FOR UPDATE 
    USING (bucket_id = 'pizza-images') 
    WITH CHECK (bucket_id = 'pizza-images');

CREATE POLICY "Permitir remoção de imagens de pizzas" 
    ON storage.objects FOR DELETE 
    USING (bucket_id = 'pizza-images');

-- -------------------------------------------------------------
-- 6. DADOS INICIAIS DO CARDÁPIO (POPULAR A TABELA)
-- -------------------------------------------------------------
INSERT INTO public.pizzas (id, name, description, category, base_price, image, popular, vegetarian, ingredients)
VALUES 
('calabresa', 'Calabresa Especial', 'Molho de tomate italiano, mussarela especial, fatias finas de calabresa artesanal, cebola roxa e orégano.', 'tradicionais', 48.00, 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee', true, false, '["Molho de Tomate", "Mussarela", "Calabresa", "Cebola Roxa"]'),
('margherita', 'Margherita Gurmet', 'Molho de tomate pelati, mussarela de búfala fresca, tomate cereja e manjericão fresco.', 'tradicionais', 52.00, 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3', true, true, '["Molho Tomate", "Mussarela de Búfala", "Tomate Cereja", "Manjericão"]'),
('frango-catupiry', 'Frango com Catupiry', 'Peito de frango desfiado temperado, Catupiry cremoso, mussarela e milho verde.', 'tradicionais', 54.00, 'https://images.unsplash.com/photo-1513104890138-7c749659a591', true, false, '["Molho", "Mussarela", "Frango Desfiado", "Catupiry Original"]'),
('nutella-morango', 'Nutella com Morango', 'Creme de avelã Nutella genuíno com morangos frescos fatiados e chocolate branco.', 'doces', 49.00, 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47', true, true, '["Nutella", "Morangos Frescos", "Chocolate Branco"]')
ON CONFLICT (id) DO NOTHING;

`;
