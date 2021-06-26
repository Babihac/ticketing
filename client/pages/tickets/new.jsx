import { useState } from "react";
import useRequest from "../../hooks/useRequest";
import Router from "next/router";
const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: (ticket) => Router.push("/"),
  });

  const onSubmit = (e) => {
    e.preventDefault();
    doRequest();
  };
  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) {
      return;
    }
    setPrice(value.toFixed(2));
  };

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            type="text"
          />
        </div>

        <div className="form-group">
          <label>Price</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={onBlur}
            className="form-control"
            type="text"
          />
        </div>

        <div className="form-group">
          {errors}
          <button className="btn-primary">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default NewTicket;
