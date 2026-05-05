import Stripe from 'stripe';
import { envVars } from '../config/env';

if (!envVars.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY in environment variables.');
}

const stripe = new Stripe(envVars.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export default stripe;
