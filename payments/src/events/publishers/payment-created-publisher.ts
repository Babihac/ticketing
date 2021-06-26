import { Subjects, Publisher, PaymentCreated } from "@mvticketsxxx/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreated> {
  readonly subject = Subjects.PaymentCreated;
}
