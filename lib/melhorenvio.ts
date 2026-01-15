
const ME_TOKEN = (import.meta as any).env.VITE_MELHOR_ENVIO_TOKEN || '';
const ORIGIN_CEP = (import.meta as any).env.VITE_ORIGIN_CEP || '';

export interface CalculateShippingParams {
  to_cep: string;
  products: {
    id: string;
    width: number;
    height: number;
    length: number;
    weight: number;
    insurance_value: number;
    quantity: number;
  }[];
}

export const calculateShipping = async (params: CalculateShippingParams) => {
  if (!ME_TOKEN || !ORIGIN_CEP) {
    console.warn("Melhor Envio: Token ou CEP de origem não configurados.");
    return [];
  }

  // Sanitizar CEPs (remover hífens)
  const fromCep = ORIGIN_CEP.replace(/\D/g, '');
  const toCep = params.to_cep.replace(/\D/g, '');

  if (toCep.length !== 8) return [];

  try {
    const response = await fetch('https://www.melhorenvio.com.br/api/v2/me/shipment/calculate', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ME_TOKEN}`,
        'User-Agent': 'Cheia de Arte (contato@cheiadearte.com)'
      },
      body: JSON.stringify({
        from: { postal_code: fromCep },
        to: { postal_code: toCep },
        products: params.products.map(p => ({
          id: p.id,
          width: p.width || 10,
          height: p.height || 10,
          length: p.length || 10,
          weight: (p.weight || 100) / 1000, // Melhor Envio usa KG
          insurance_value: p.insurance_value,
          quantity: p.quantity
        }))
      })
    });

    if (!response.ok) throw new Error("Erro ao calcular frete");

    const data = await response.json();
    
    // Filtrar apenas opções que não retornaram erro e têm preço
    return data.filter((option: any) => !option.error && option.price);
  } catch (error) {
    console.error("Erro Melhor Envio:", error);
    return [];
  }
};
