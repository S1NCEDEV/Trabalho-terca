export const initialCategories = [
  {
    id: "cat-1",
    name: "Corrida",
    description: "Roupas leves com tecnologia dry fit para treinos e provas.",
    status: "Ativa"
  },
  {
    id: "cat-2",
    name: "Musculacao",
    description: "Pecas resistentes para academia, treino funcional e alta mobilidade.",
    status: "Ativa"
  },
  {
    id: "cat-3",
    name: "Yoga e Pilates",
    description: "Linha com elasticidade, toque macio e modelagem confortavel.",
    status: "Ativa"
  }
];

export const initialClients = [
  {
    id: "cli-1",
    name: "Amanda Rocha",
    email: "amanda@email.com",
    cpf: "123.456.789-10",
    phone: "(11) 98888-1010",
    address: "Rua das Palmeiras, 120",
    status: "Ativo"
  },
  {
    id: "cli-2",
    name: "Bruno Lima",
    email: "bruno@email.com",
    cpf: "222.333.444-55",
    phone: "(21) 97777-2020",
    address: "Av. Brasil, 480",
    status: "Ativo"
  },
  {
    id: "cli-3",
    name: "Carla Mendes",
    email: "carla@email.com",
    cpf: "333.444.555-66",
    phone: "(31) 96666-3030",
    address: "Rua Horizonte, 85",
    status: "Ativo"
  }
];

export const initialProducts = [
  {
    id: "prod-1",
    name: "Legging Flex Pro",
    description: "Legging de alta compressao com bolso lateral.",
    categoryId: "cat-3",
    price: "129.90",
    stock: "18",
    imageUrl: "https://images.unsplash.com/photo-1506629905607-d9f297d88f44?auto=format&fit=crop&w=900&q=80",
    favorite: "Sim"
  },
  {
    id: "prod-2",
    name: "Regata Dry Run",
    description: "Regata respiravel para corrida em clima quente.",
    categoryId: "cat-1",
    price: "79.90",
    stock: "26",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
    favorite: "Nao"
  },
  {
    id: "prod-3",
    name: "Short Training Core",
    description: "Short com tecido flexivel e secagem rapida.",
    categoryId: "cat-2",
    price: "99.90",
    stock: "14",
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
    favorite: "Sim"
  },
  {
    id: "prod-4",
    name: "Top Impact Run",
    description: "Top esportivo com sustentacao para corrida e treino intenso.",
    categoryId: "cat-1",
    price: "89.90",
    stock: "22",
    imageUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=900&q=80",
    favorite: "Nao"
  },
  {
    id: "prod-5",
    name: "Jaqueta Corta Vento",
    description: "Jaqueta leve para treino externo, corrida e caminhada.",
    categoryId: "cat-1",
    price: "189.90",
    stock: "11",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
    favorite: "Sim"
  },
  {
    id: "prod-6",
    name: "Camiseta Training Dry",
    description: "Camiseta respiravel com tecido dry fit para musculacao.",
    categoryId: "cat-2",
    price: "69.90",
    stock: "35",
    imageUrl: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=900&q=80",
    favorite: "Nao"
  },
  {
    id: "prod-7",
    name: "Moletom Recovery",
    description: "Moletom confortavel para pos-treino e dias frios.",
    categoryId: "cat-2",
    price: "159.90",
    stock: "16",
    imageUrl: "https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?auto=format&fit=crop&w=900&q=80",
    favorite: "Sim"
  },
  {
    id: "prod-8",
    name: "Calca Jogger Fit",
    description: "Calca jogger flexivel para academia, yoga e uso casual.",
    categoryId: "cat-3",
    price: "139.90",
    stock: "19",
    imageUrl: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=900&q=80",
    favorite: "Nao"
  }
];

export const initialCoupons = [
  {
    id: "cup-1",
    code: "SPORT10",
    discount: "10",
    validity: "2026-12-31",
    active: "Sim"
  },
  {
    id: "cup-2",
    code: "FRETE15",
    discount: "15",
    validity: "2026-09-30",
    active: "Sim"
  },
  {
    id: "cup-3",
    code: "OUTLET20",
    discount: "20",
    validity: "2026-08-15",
    active: "Nao"
  }
];

export const initialPayments = [
  {
    id: "pay-1",
    orderId: "ped-1",
    method: "Cartao de credito",
    status: "Aprovado",
    paymentDate: "2026-06-14"
  },
  {
    id: "pay-2",
    orderId: "ped-2",
    method: "Pix",
    status: "Aprovado",
    paymentDate: "2026-06-13"
  },
  {
    id: "pay-3",
    orderId: "ped-3",
    method: "Boleto",
    status: "Pendente",
    paymentDate: "2026-06-12"
  }
];

export const initialOrders = [
  {
    id: "ped-1",
    clientId: "cli-1",
    productId: "prod-2",
    couponId: "cup-1",
    quantity: "2",
    status: "Em transporte",
    orderDate: "2026-06-14"
  },
  {
    id: "ped-2",
    clientId: "cli-2",
    productId: "prod-3",
    couponId: "cup-2",
    quantity: "1",
    status: "Separando pedido",
    orderDate: "2026-06-13"
  },
  {
    id: "ped-3",
    clientId: "cli-3",
    productId: "prod-1",
    couponId: "cup-3",
    quantity: "1",
    status: "Aguardando pagamento",
    orderDate: "2026-06-12"
  }
];
