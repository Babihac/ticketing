import { Ticket } from "../ticket";

Ticket;

it("implements optimistic concurency control", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 30,
    userId: "123",
  });

  await ticket.save();

  const instanceOne = await Ticket.findById(ticket.id);
  const instanceTwo = await Ticket.findById(ticket.id);

  instanceOne!.set({ price: 666 });
  instanceTwo!.set({ price: 333 });
  await instanceOne!.save();
  try {
    await instanceTwo!.save();
  } catch (err) {
    return;
  }
});

it("increments the version number on multiple saves", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId: "Abc",
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});
