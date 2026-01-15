
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Clock, AlertCircle, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';

const CheckoutResult: React.FC = () => {
  const { clearCart } = useCart();
  const location = useLocation();
  const [status, setStatus] = useState<'success' | 'pending' | 'error' | 'loading'>('loading');

  useEffect(() => {
    // Captura o status vindo da URL do Mercado Pago
    const params = new URLSearchParams(location.search);
    const mpStatus = params.get('status'); // approved, pending, in_process, rejected

    if (mpStatus === 'approved') {
      setStatus('success');
      clearCart();
    } else if (mpStatus === 'pending' || mpStatus === 'in_process') {
      setStatus('pending');
      clearCart(); // Limpamos o carrinho também no pendente (Pix emitido)
    } else if (mpStatus === 'rejected') {
      setStatus('error');
    } else {
      // Caso o usuário acesse a rota diretamente sem parâmetros, verificamos o caminho
      if (location.pathname.includes('sucesso')) {
        setStatus('success');
        clearCart();
      } else if (location.pathname.includes('pendente')) {
        setStatus('pending');
        clearCart();
      } else {
        setStatus('error');
      }
    }
  }, [location, clearCart]);

  const content = {
    success: {
      icon: <CheckCircle2 className="w-20 h-20 text-green-500" />,
      title: "Pagamento Aprovado!",
      message: "Recebemos sua confirmação. Agora nossa equipe vai preparar seu pedido com todo o carinho que ele merece.",
      color: "text-green-600"
    },
    pending: {
      icon: <Clock className="w-20 h-20 text-yellow-500" />,
      title: "Pagamento em Processamento",
      message: "Obrigada! Seu pagamento está sendo validado (comum em Pix e Boleto). Assim que confirmado, você receberá um e-mail com os detalhes.",
      color: "text-yellow-600"
    },
    error: {
      icon: <AlertCircle className="w-20 h-20 text-red-500" />,
      title: "Ops! Algo deu errado",
      message: "Não conseguimos confirmar seu pagamento. Por favor, verifique os dados ou tente outra forma de pagamento.",
      color: "text-red-600"
    },
    loading: {
      icon: <Loader2 className="w-20 h-20 text-[#f4d3d2] animate-spin" />,
      title: "Verificando Status...",
      message: "Aguarde um momento enquanto confirmamos as informações do seu pedido.",
      color: "text-gray-400"
    }
  };

  const current = content[status];

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center relative">
          <div className="absolute inset-0 bg-gray-100 rounded-full blur-2xl opacity-30 animate-pulse"></div>
          <div className="relative z-10">{current.icon}</div>
        </div>

        <div className="space-y-4">
          <h1 className={`text-3xl md:text-4xl font-serif font-bold ${current.color}`}>
            {current.title}
          </h1>
          <p className="text-gray-600 leading-relaxed">
            {current.message}
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-[#f4d3d2]/10 space-y-6">
          <div className="space-y-3">
            <Link 
              to="/" 
              className="w-full py-4 bg-[#f4d3d2] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#e6c1c0] transition-all shadow-md active:scale-95"
            >
              <ShoppingBag className="w-5 h-5" />
              Voltar para a Loja
            </Link>
            
            <a 
              href="https://wa.me/5571982331700" 
              target="_blank"
              className="w-full py-4 border-2 border-gray-50 text-gray-500 rounded-xl font-bold flex items-center justify-center gap-2 hover:border-[#f4d3d2] hover:text-[#f4d3d2] transition-all"
            >
              Precisa de ajuda? Fale conosco
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <p className="text-[10px] uppercase tracking-widest text-gray-300 font-bold">
            Cheia de Arte • Aromas que Curam
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutResult;
