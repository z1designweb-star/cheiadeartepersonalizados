
/**
 * SERVIÇO DE INTEGRAÇÃO MERCADO PAGO
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

export interface PayerData {
  email: string;
  full_name: string;
  cpf: string;
  phone: string;
  address: {
    zip_code: string;
    street_name: string;
    street_number: string;
  };
}

export const createCheckoutPreference = async (items: PreferenceItem[], orderId: string, payer: PayerData) => {
  if (!MP_ACCESS_TOKEN) {
    throw new Error("Token de acesso do Mercado Pago não configurado.");
  }

  // Separar nome e sobrenome
  const nameParts = payer.full_name.trim().split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Artesanatos';

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
        payer: {
          name: firstName,
          surname: lastName,
          email: payer.email,
          identification: {
            type: 'CPF',
            number: payer.cpf.replace(/\D/g, '')
          },
          address: {
            zip_code: payer.address.zip_code.replace(/\D/g, ''),
            street_name: payer.address.street_name,
            street_number: parseInt(payer.address.street_number) || 0
          }
        },
        external_reference: orderId,
        back_urls: {
          success: `${window.location.origin}/#/sucesso`,
          failure: `${window.location.origin}/#/erro`,
          pending: `${window.location.origin}/#/pendente`,
        },
        auto_return: 'approved',
        statement_descriptor: 'CHEIADEARTE',
        payment_methods: {
          excluded_payment_types: [{ id: 'ticket' }],
          installments: 12
        }
      }),
    });

    const data = await response.json();
    if (data.init_point) return data.init_point;
    throw new Error(data.message || "Erro ao criar preferência.");
  } catch (error) {
    console.error("Erro Mercado Pago:", error);
    throw error;
  }
};
