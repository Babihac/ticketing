import { useEffect, useState } from "react";
import useRequest from "../../hooks/useRequest";
import StripeCheckout from "react-stripe-checkout";
import Router from "next/router";
const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.order.id,
    },
    onSuccess: (payment) => Router.push("/orders"),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);
  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }
  return (
    <div>
      {timeLeft}
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_k0gUK92CrJD865UDKfjGBGab00nQ3qL5zn"
        amount={order.order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
