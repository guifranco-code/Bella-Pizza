import { Category, Ingredient, Pizza } from '../types';

export const PIZZA_CATEGORIES: Category[] = [
  { id: 'todos', name: 'Todas as Pizzas', description: 'Explore nosso cardápio completo', icon: 'Pizza' },
  { id: 'tradicionais', name: 'Tradicionais', description: 'As clássicas e mais amadas de sempre', icon: 'Flame' },
  { id: 'especiais', name: 'Especiais do Chef', description: 'Combinações gourmet e ingredientes selecionados', icon: 'Sparkles' },
  { id: 'vegetarianas', name: 'Vegetarianas', description: 'Saborosas, sem carne e cheias de frescor', icon: 'Leaf' },
  { id: 'doces', name: 'Pizzas Doces', description: 'A sobremesa perfeita para finalizar sua refeição', icon: 'Heart' },
  { id: 'bebidas', name: 'Bebidas & Refrescos', description: 'Refrigerantes, sucos artesanais e cervejas', icon: 'Wine' },
];

export const PIZZA_SIZES = [
  { id: 'broto', name: 'Broto (20cm)', slices: '4 fatias', multiplier: 0.75, description: 'Ideal para 1 pessoa' },
  { id: 'media', name: 'Média (30cm)', slices: '6 fatias', multiplier: 1.0, description: 'Serve até 2 pessoas' },
  { id: 'grande', name: 'Grande (35cm)', slices: '8 fatias', multiplier: 1.25, description: 'Serve de 3 a 4 pessoas' },
  { id: 'gigante', name: 'Gigante (40cm)', slices: '12 fatias', multiplier: 1.5, description: 'Ideal para a família inteira' },
] as const;

export const CRUST_OPTIONS = [
  { id: 'tradicional', name: 'Borda Tradicional', price: 0, description: 'Crocrante e levemente dourada' },
  { id: 'catupiry', name: 'Catupiry Original', price: 8, description: 'Borda recheada com verdadeiro Catupiry' },
  { id: 'cheddar', name: 'Cheddar Cremoso', price: 8, description: 'Cheddar fundido bem cremoso' },
  { id: 'nutella', name: 'Nutella Crocante', price: 12, description: 'Ideal para pizzas doces ou contraste salgado' },
] as const;

export const DEFAULT_PIZZAS: Pizza[] = [
  {
    id: 'calabresa',
    name: 'Calabresa Especial',
    description: 'Molho de tomate italiano, mussarela especial, fatias finas de calabresa artesanal, cebola roxa e orégano fresco.',
    category: 'tradicionais',
    basePrice: 48,
    popular: true,
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Molho de Tomate', 'Mussarela', 'Calabresa Artesanal', 'Cebola Roxa', 'Azeitonas Pretas', 'Orégano']
  },
  {
    id: 'margherita',
    name: 'Margherita Gurmet',
    description: 'Molho de tomate pelati, mussarela de búfala fresca, rodelas de tomate cereja, manjericão fresco e azeite extravirgem.',
    category: 'tradicionais',
    basePrice: 52,
    popular: true,
    vegetarian: true,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Molho Tomate Pelati', 'Mussarela de Búfala', 'Tomate Cereja', 'Manjericão Fresco', 'Azeite Extravirgem']
  },
  {
    id: 'frango-catupiry',
    name: 'Frango Supremo com Catupiry',
    description: 'Peito de frango desfiado temperado com ervas, coberto com o legítimo Catupiry cremoso, mussarela e milho verde.',
    category: 'tradicionais',
    basePrice: 54,
    popular: true,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Molho de Tomate', 'Mussarela', 'Frango Desfiado', 'Catupiry Original', 'Milho', 'Orégano']
  },
  {
    id: 'quatro-queijos',
    name: 'Quatro Queijos Seleção',
    description: 'Combinação harmônica de Mussarela, Gorgonzola, Gouda refinado e requeijão cremoso salpicado com parmesão.',
    category: 'tradicionais',
    basePrice: 56,
    vegetarian: true,
    image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Mussarela', 'Gorgonzola', 'Queijo Gouda', 'Requeijão', 'Parmesão Ralado']
  },
  {
    id: 'pepperoni-supreme',
    name: 'Pepperoni Supreme',
    description: 'Molho artesanal, camada generosa de mussarela, rodelas crocantes de pepperoni importado e um toque de pimenta calabresa.',
    category: 'especiais',
    basePrice: 58,
    popular: true,
    spicy: true,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Molho de Tomate', 'Mussarela', 'Pepperoni Importado', 'Pimenta Calabresa', 'Orégano']
  },
  {
    id: 'portuguesa',
    name: 'Portuguesa Tradicional',
    description: 'Molho de tomate, mussarela, presunto cozido de primeira, ovos fatiados, cebola, pimentão colorido, ervilha e azeitonas.',
    category: 'tradicionais',
    basePrice: 50,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Molho de Tomate', 'Mussarela', 'Presunto Cozido', 'Ovos Cozidos', 'Cebola', 'Pimentão', 'Azeitonas']
  },
  {
    id: 'parma-rucula',
    name: 'Parma com Rúcula & Grana Padano',
    description: 'Base de mussarela, fatias finíssimas de presunto de Parma, rúcula fresca baby, lascas de queijo Grana Padano e xarope de balsâmico.',
    category: 'especiais',
    basePrice: 66,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Mussarela', 'Presunto de Parma', 'Rúcula Baby', 'Grana Padano', 'Redução de Balsâmico']
  },
  {
    id: 'cogumelos-trufados',
    name: 'Cogumelos Trufados & Brie',
    description: 'Cogumelos Paris e Shimeji salteados na manteiga de ervas, queijo Brie derretido e finalizado com azeite de trufas brancas.',
    category: 'especiais',
    basePrice: 68,
    vegetarian: true,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Mussarela', 'Cogumelos Shimeji', 'Cogumelos Paris', 'Queijo Brie', 'Azeite de Trufa']
  },
  {
    id: 'veggie-garden',
    name: 'Vegetariana do Jardim',
    description: 'Abobrinha grelhada, berinjela marinada, tomate seco, alho-poró, champignon fresco, milho e mussarela light.',
    category: 'vegetarianas',
    basePrice: 52,
    vegetarian: true,
    image: 'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Molho de Tomate', 'Mussarela Light', 'Abobrinha Grelhada', 'Tomate Seco', 'Alho-poró', 'Champignon']
  },
  {
    id: 'nutella-morango',
    name: 'Nutella com Morangos Frescos',
    description: 'Massa fina crocrante coberta com creme de avelã Nutella genuíno, lâminas de morango fresco e raspas de chocolate branco.',
    category: 'doces',
    basePrice: 49,
    popular: true,
    vegetarian: true,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Nutella Original', 'Morangos Frescos', 'Raspas de Chocolate Branco', 'Avelãs Tostadas']
  },
  {
    id: 'banoffee-pizza',
    name: 'Banoffee Doce de Leite',
    description: 'Doce de leite argentino cremoso, fatias de banana nanica caramelizada, canela em pó e farofa crocrante de biscoito.',
    category: 'doces',
    basePrice: 46,
    vegetarian: true,
    image: 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Doce de Leite Argentino', 'Bananas Caramelizadas', 'Canela em Pó', 'Farofa Crocante']
  },
  {
    id: 'coca-cola-2l',
    name: 'Coca-Cola Zero / Tradicional 2L',
    description: 'Garrafa de 2 Litros trincando de gelada.',
    category: 'bebidas',
    basePrice: 14,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Refrigerante 2L']
  },
  {
    id: 'guarana-2l',
    name: 'Guaraná Antarctica 2L',
    description: 'Sabor único da Amazônia, garrafa 2 Litros.',
    category: 'bebidas',
    basePrice: 12,
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Guaraná 2L']
  },
  {
    id: 'suco-laranja',
    name: 'Suco de Laranja Natural 1L',
    description: 'Suco 100% natural espremido na hora sem adição de açúcar.',
    category: 'bebidas',
    basePrice: 16,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Suco 100% Fruta']
  }
];

export const CUSTOM_BUILDER_INGREDIENTS: Ingredient[] = [
  // Molhos
  { id: 'molho-tomate', name: 'Molho de Tomate San Marzano', category: 'molho', price: 0, available: true, color: 'bg-red-600' },
  { id: 'molho-pesto', name: 'Molho Pesto de Manjericão', category: 'molho', price: 4, available: true, color: 'bg-emerald-600' },
  { id: 'molho-branco', name: 'Molho Branco Alfredo', category: 'molho', price: 4, available: true, color: 'bg-amber-100' },

  // Queijos
  { id: 'queijo-mussarela', name: 'Mussarela Especial', category: 'queijo', price: 5, available: true, color: 'bg-yellow-200' },
  { id: 'queijo-bufala', name: 'Mussarela de Búfala', category: 'queijo', price: 8, available: true, color: 'bg-stone-100' },
  { id: 'queijo-catupiry', name: 'Catupiry Original', category: 'queijo', price: 6, available: true, color: 'bg-amber-50' },
  { id: 'queijo-gorgonzola', name: 'Gorgonzola Intenso', category: 'queijo', price: 7, available: true, color: 'bg-emerald-200' },
  { id: 'queijo-provolone', name: 'Provolone Defumado', category: 'queijo', price: 6, available: true, color: 'bg-amber-300' },

  // Carnes / Proteínas
  { id: 'carne-calabresa', name: 'Calabresa Artesanal', category: 'carne', price: 6, available: true, color: 'bg-red-800' },
  { id: 'carne-pepperoni', name: 'Pepperoni Importado', category: 'carne', price: 8, available: true, color: 'bg-red-700' },
  { id: 'carne-bacon', name: 'Bacon Defumado Crocante', category: 'carne', price: 7, available: true, color: 'bg-amber-800' },
  { id: 'carne-frango', name: 'Frango Temperado Desfiado', category: 'carne', price: 6, available: true, color: 'bg-amber-500' },
  { id: 'carne-presunto', name: 'Presunto Cozido', category: 'carne', price: 5, available: true, color: 'bg-rose-300' },
  { id: 'carne-parma', name: 'Presunto de Parma Crudo', category: 'carne', price: 12, available: true, color: 'bg-red-900' },

  // Vegetais / Legumes
  { id: 'veg-manjericao', name: 'Manjericão Fresco', category: 'vegetal', price: 3, available: true, color: 'bg-green-600' },
  { id: 'veg-tomate-ce', name: 'Tomate Cereja', category: 'vegetal', price: 4, available: true, color: 'bg-red-500' },
  { id: 'veg-cebola', name: 'Cebola Roxa Fatiada', category: 'vegetal', price: 3, available: true, color: 'bg-purple-300' },
  { id: 'veg-azeitona', name: 'Azeitonas Pretas', category: 'vegetal', price: 3, available: true, color: 'bg-slate-800' },
  { id: 'veg-cogumelos', name: 'Cogumelos Champignon', category: 'vegetal', price: 6, available: true, color: 'bg-amber-200' },
  { id: 'veg-milho', name: 'Milho Doce', category: 'vegetal', price: 3, available: true, color: 'bg-yellow-400' },
  { id: 'veg-pimentao', name: 'Pimentões Coloridos', category: 'vegetal', price: 4, available: true, color: 'bg-orange-500' },
  { id: 'veg-rucula', name: 'Rúcula Baby', category: 'vegetal', price: 4, available: true, color: 'bg-emerald-700' },

  // Adicionais / Finais
  { id: 'esp-ovo', name: 'Ovos de Codorna', category: 'especial', price: 4, available: true, color: 'bg-yellow-100' },
  { id: 'esp-alho', name: 'Alho Frito Crocante', category: 'especial', price: 3, available: true, color: 'bg-amber-400' },
  { id: 'esp-azeite-trufa', name: 'Azeite de Trufas', category: 'especial', price: 9, available: true, color: 'bg-yellow-500' },
];
