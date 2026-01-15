
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';

const Success: React.FC = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    // Limpa o carrinho assim que a página de sucesso é montada
    clearCart();
    
    // Opcional: Você pode capturar parâmetros da URL aqui se quiser mostrar o ID da transação
    // const params = new URLSearchParams(window.location.search);
    // const paymentId = params.get('payment_id');
  }, [clearCart]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#f4d3d2] rounded-full blur-xl opacity-20 animate-pulse"></div>
            <CheckCircle2 className="w-24 h-24 text-[#f4d3d2] relative z-10" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-serif font-bold text-gray-900">Pedido Confirmado!</h1>
          <p className="text-gray-600 text-lg">
            Muito obrigada por escolher a <span className="font-bold text-[#f4d3d2]">Cheia de Arte</span>. 
            Seu pagamento foi processado com sucesso e em breve prepararemos seu aroma com todo carinho.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <p className="text-sm text-gray-500 mb-4">
            Você receberá os detalhes da entrega no e-mail cadastrado durante o pagamento.
          </p>
          <div className="flex flex-col gap-3">
            <Link 
              to="/" 
              className="w-full py-4 bg-[#f4d3d2] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#e6c1c0] transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              Continuar Navegando
            </Link>
            <a 
              href="https://wa.me/5571982331700" 
              target="_blank"
              className="text-[#f4d3d2] font-semibold flex items-center justify-center gap-2 hover:underline"
            >
              Ficou com alguma dúvida? Fale conosco
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
