import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { checkAuth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { PaymentValidation } from './payment.validation';

const router = Router();

// Initialize payment (Authenticated — creates Stripe Checkout Session)
router.post(
  '/init',
  checkAuth('STUDENT'),
  validateRequest(PaymentValidation.initializePaymentValidationSchema),
  PaymentController.initializePayment
);

// Stripe Webhook (Public — raw body handled in app.ts)
// router.post('/webhook/stripe', PaymentController.handleStripeWebhook);

// Get payment by booking ID (Authenticated)

// Get all payments (Admin only)
router.get(
  '/',
  checkAuth('ADMIN'),
  PaymentController.getAllPayments
);

router.get(
  '/:bookingId',
  checkAuth('STUDENT', 'TUTOR', 'ADMIN'),
  PaymentController.getPaymentByBookingId
);

export const paymentRoutes = router;
