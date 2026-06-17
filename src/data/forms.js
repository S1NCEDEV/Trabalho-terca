export const categoryFields = [
  { name: "name", label: "Nome da categoria", type: "text", required: true },
  { name: "description", label: "Descricao", type: "text", required: true },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { value: "Ativa", label: "Ativa" },
      { value: "Pausada", label: "Pausada" }
    ]
  }
];

export const clientFields = [
  { name: "name", label: "Nome do cliente", type: "text", required: true },
  { name: "email", label: "E-mail", type: "email", required: true },
  { name: "cpf", label: "CPF", type: "text", required: true },
  { name: "phone", label: "Telefone", type: "text", required: true },
  { name: "address", label: "Endereco", type: "text", required: true },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { value: "Ativo", label: "Ativo" },
      { value: "Bloqueado", label: "Bloqueado" }
    ]
  }
];

export const couponFields = [
  { name: "code", label: "Codigo", type: "text", required: true },
  { name: "discount", label: "Desconto (%)", type: "number", required: true, min: "0", step: "1" },
  { name: "validity", label: "Validade", type: "date", required: true },
  {
    name: "active",
    label: "Ativo",
    type: "select",
    required: true,
    options: [
      { value: "Sim", label: "Sim" },
      { value: "Nao", label: "Nao" }
    ]
  }
];

export function productFields(categoryOptions) {
  return [
    { name: "name", label: "Nome do produto", type: "text", required: true },
    { name: "description", label: "Descricao", type: "text", required: true },
    { name: "categoryId", label: "Categoria", type: "select", required: true, options: categoryOptions },
    { name: "price", label: "Preco", type: "number", required: true, min: "0", step: "0.01" },
    { name: "stock", label: "Estoque", type: "number", required: true, min: "0" },
    { name: "imageUrl", label: "URL da imagem", type: "text", required: true },
    {
      name: "favorite",
      label: "Favorito",
      type: "select",
      required: true,
      options: [
        { value: "Sim", label: "Sim" },
        { value: "Nao", label: "Nao" }
      ]
    }
  ];
}
