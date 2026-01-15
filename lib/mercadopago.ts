
/**
 * SERVIÇO DE INTEGRAÇÃO MERCADO PAGO
 * IMPORTANTE: Em um ambiente de produção real, as chamadas para api.mercadopago.com
 * devem ser feitas através de um backend (como Supabase Edge Functions) para manter 
 * o ACCESS_TOKEN seguro.
 */

const MP_ACCESS_TOKEN = (import.meta as any).env.VITE_MERCADO_PAGO_ACCESS_TOKEN || '';

export interface PreferenceItem {
  id: string;
  title: string;
  unit_price: number;
  quantity: number;
  description?: string;
  picture_url?: string;
}

export const createCheckoutPreference = async (items: PreferenceItem[]) => {
  if (!MP_ACCESS_TOKEN) {
    throw new Error("Token de acesso do Mercado Pago não configurado.");
  }

  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: items.map(item => ({
          id: item.id,
          title: item.title,
          unit_price: item.unit_price,
          quantity: item.quantity,
          currency_id: 'BRL',
          description: item.description,
          picture_url: item.picture_url
        })),
        back_urls: {
          success: `${window.location.origin}/#/sucesso`,
          failure: `${window.location.origin}/#/erro`,
          pending: `${window.location.origin}/#/pendente`,
        },
        auto_return: 'approved',
        statement_descriptor: 'CHEIADEARTE',
        payment_methods: {
          excluded_payment_types: [
            { id: 'ticket' } // Exemplo: Excluir boleto se desejar
          ],
          installments: 12
        }
      }),
    });

    const data = await response.json();
    
    if (data.init_point) {
      return data.init_point; // URL do Checkout Pro
    } else {
      throw new Error(data.message || "Erro ao criar preferência de pagamento.");
    }
  } catch (error) {
    console.error("Erro Mercado Pago:", error);
    throw error;
  }
};
