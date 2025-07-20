import PushNotification from '@/components/notification/PushNotification';
import Layout from '@/pages/layout';
import { useSession } from 'next-auth/react';
import { useContext, useEffect, useReducer, useState } from 'react';
import { socket } from '../../../public/socket.js';
import Swal from 'sweetalert2';
import ViewSelect from '@/components/ViewSelect.js';
import SellOrdersView from '@/components/SellOrdersView.js';
import BuyOrdersView from '@/components/BuyOrdersView.js';
import { useOrders } from '@/contexts/OrdersContext.js';

export default function OrdersPage() {
  const { data: session } = useSession();
  const { state, dispatch, actions } = useOrders();
  const { view, orders, pendingOffers, offers } = state;
  const { buyOffersId } = pendingOffers;

  useEffect(() => {
    if (session?.user.id) {
      actions.fetchBuyOrders();
      actions.fetchUserOffers();
    }
  }, [session?.user.id]);

  useEffect(() => {
    if (state.isOfferSold) {
      const handleAlert = async (order) => {
        const result = await Swal.fire({
          title: 'W ofercie nie masz więcej waluty!',
          text: 'Czy chcesz usunąć tą ofertę?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Usuń ofertę',
          cancelButtonText: 'Aktualizuj ofertę',
          reverseButtons: true,
        });
        //TODO delete offer / update if sold
        // if (result.isConfirmed) {
        //   dispatch({ type: 'DELETE_OFFER', payload: { offerId: ... } });
        // }
        dispatch({ type: 'CLEAR_OFFER_SOLD_FLAG' });
      };

      handleAlert();
    }
  }, [state.isOfferSold]);

  useEffect(() => {
    if (!buyOffersId || buyOffersId.length === 0) return;
    socket.emit('join-order-room', buyOffersId);

    // nasłu chuj aktualizacji statusu
    socket.on('order-updated', ({ orderId, status }) => {
      if (buyOffersId.includes(orderId)) {
        dispatch({
          type: 'UPDATE_BUY_ORDER_STATUS',
          payload: { orderId, status },
        });
      }
    });
    //funkcja czysczaca
    return () => {
      socket.off('order-updated');
    };
  }, [buyOffersId]);

  useEffect(() => {
    if (!offers || offers.length === 0) return;
    const offersIds = offers?.map((offer) => offer._id);
    socket.emit('join-order-room', offersIds);

    // nasłu chuj aktualizacji statusu
    socket.on('new-purchase', ({ orderId }) => {
      console.log(orderId);
      actions.fetchBuyOrders();
    });

    //funkcja czysczaca
    return () => {
      socket.off('new-purchase');
    };
  }, [offers]);

  return (
    <Layout>
      <PushNotification />
      <ViewSelect
        view={view}
        setView={(newView) => dispatch({ type: 'SET_VIEW', payload: newView })}
      />

      {
        // isLoading ? (
        //   <div className="bg-brighterBg  p-6">
        //     <div className="bg-mainBg p-6 mb-4">
        //       <div className="h-2 w-32 bg-brighterBg animate-pulse mb-2"></div>
        //       <div className="h-2 w-12 bg-brighterBg animate-pulse"></div>
        //     </div>
        //   </div>
        // ) :
        // view === 'buy' ? (
        //   <BuyOrdersView />
        // ) : view === 'sell' ? (
        //   <SellOrdersView orders={orders} />
        // ) : (
        //   <OffersView offers={offers} />
        // )
        view === 'buy' ? <BuyOrdersView /> : <SellOrdersView />
      }
    </Layout>
  );
}
