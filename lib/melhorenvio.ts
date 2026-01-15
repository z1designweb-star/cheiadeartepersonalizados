
const ME_TOKEN = (import.meta as any).env.VITE_MELHOR_ENVIO_TOKEN || '';
const ORIGIN_CEP = (import.meta as any).env.VITE_ORIGIN_CEP || '';

// Proxy para evitar erro de CORS em ambiente de desenvolvimento/frontend
const CORS_PROXY = 'https://corsproxy.io/?';
const API_URL = 'https://www.melhorenvio.com.br/api/v2/me/shipment/calculate';

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

  // Sanitizar CEPs (remover hífens e espaços)
  const fromCep = ORIGIN_CEP.replace(/\D/g, '');
  const toCep = params.to_cep.replace(/\D/g, '');

  if (toCep.length !== 8) {
    console.warn("Melhor Envio: CEP de destino inválido.");
    return [];
  }

  try {
    // Concatenamos o Proxy com a URL da API codificada
    const fullUrl = `${CORS_PROXY}${encodeURIComponent(API_URL)}`;

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ME_TOKEN}`
      },
      body: JSON.stringify({
        from: { postal_code: fromCep },
        to: { postal_code: toCep },
        products: params.products.map(p => ({
          id: p.id,
          width: Number(p.width) || 10,
          height: Number(p.height) || 10,
          length: Number(p.length) || 10,
          weight: (Number(p.weight) || 100) / 1000, // Melhor Envio usa KG (g para kg)
          insurance_value: Number(p.insurance_value),
          quantity: Number(p.quantity)
        }))
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Erro na resposta do Melhor Envio:", errorData);
      throw new Error("Erro ao calcular frete");
    }

    const data = await response.json();
    
    // O Melhor Envio retorna um array de transportadoras
    // Filtramos apenas as que não retornaram erro e que têm preço
    return Array.isArray(data) ? data.filter((option: any) => !option.error && option.price) : [];
  } catch (error) {
    console.error("Erro na integração com Melhor Envio:", error);
    return [];
  }
};
