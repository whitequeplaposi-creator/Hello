# Stripe Setup Guide - Lösning för 402 Payment Error

## Problem
Du får **402 Payment Required** fel från Stripe eftersom du använder **live API keys** utan att ha aktiverat ditt Stripe-konto.

## Lösningar

### Option 1: Använd Test Mode (REKOMMENDERAT för utveckling)

1. **Hämta dina test-nycklar från Stripe Dashboard:**
   - Gå till: https://dashboard.stripe.com/test/apikeys
   - Kopiera **Publishable key** (börjar med `pk_test_...`)
   - Kopiera **Secret key** (börjar med `sk_test_...`)

2. **Uppdatera `.env.local`:**
   ```env
   STRIPE_SECRET_KEY=sk_test_51ShD84QxuLBnasz3...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51ShD84QxuLBnasz3...
   ```

3. **Testa betalningar med test-kort:**
   - Kortnummer: `4242 4242 4242 4242`
   - Utgångsdatum: Vilket som helst framtida datum (t.ex. `12/34`)
   - CVC: Vilka 3 siffror som helst (t.ex. `123`)
   - Postnummer: Vilket som helst (t.ex. `12345`)

4. **Starta om utvecklingsservern:**
   ```bash
   npm run dev
   ```

### Option 2: Aktivera Live Mode (För produktion)

Om du vill ta emot riktiga betalningar:

1. **Aktivera ditt Stripe-konto:**
   - Gå till: https://dashboard.stripe.com/account/onboarding
   - Fyll i alla obligatoriska uppgifter:
     - Företagsinformation
     - Bankuppgifter för utbetalningar
     - Identitetsverifiering
     - Skatteuppgifter

2. **Vänta på godkännande:**
   - Stripe granskar din ansökan (kan ta några dagar)
   - Du får ett e-postmeddelande när kontot är aktiverat

3. **Använd HTTPS:**
   - Live mode kräver HTTPS
   - Använd en hosting-tjänst som Vercel, Netlify, eller AWS
   - Eller använd ngrok för lokal testning: https://ngrok.com/

4. **Uppdatera till live keys:**
   ```env
   STRIPE_SECRET_KEY=sk_live_51ShD84QxuLBnasz3...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51ShD84QxuLBnasz3...
   ```

## Ändringar som gjorts

### 1. Valuta ändrad från USD till SEK
- **Fil:** `app/api/create-payment-intent/route.ts`
- **Ändring:** `currency: 'usd'` → `currency: 'sek'`
- **Anledning:** Din webbplats är på svenska och riktar sig till svenska kunder

### 2. Valuta ändrad i checkout
- **Fil:** `app/kassa/page.tsx`
- **Ändring:** `currency: 'usd'` → `currency: 'sek'`

### 3. .env.local uppdaterad
- **Fil:** `.env.local`
- **Ändring:** Kommenterade live keys och lade till placeholders för test keys
- **Nästa steg:** Hämta dina test keys från Stripe Dashboard

## Test-kort för Stripe Test Mode

| Scenario | Kortnummer | Resultat |
|----------|-----------|----------|
| Lyckad betalning | 4242 4242 4242 4242 | Betalning godkänd |
| Avvisad betalning | 4000 0000 0000 0002 | Kort avvisat |
| Otillräckliga medel | 4000 0000 0000 9995 | Otillräckliga medel |
| 3D Secure krävs | 4000 0027 6000 3184 | Kräver autentisering |

Fler test-kort: https://stripe.com/docs/testing

## Felsökning

### Fel: "No API key provided"
- Kontrollera att `.env.local` innehåller rätt nycklar
- Starta om utvecklingsservern efter ändringar i `.env.local`

### Fel: "Invalid API Key"
- Kontrollera att du kopierat hela nyckeln (inga mellanslag)
- Kontrollera att secret key börjar med `sk_test_` eller `sk_live_`
- Kontrollera att publishable key börjar med `pk_test_` eller `pk_live_`

### Fel: "402 Payment Required"
- Du använder live keys utan aktiverat konto → Byt till test keys
- Eller aktivera ditt Stripe-konto via onboarding-processen

### Betalning går igenom men ingen bekräftelse
- Kontrollera att webhook är konfigurerad (om du använder webhooks)
- Kontrollera att order-uppdateringen fungerar i `/api/orders` PATCH endpoint

## Nästa steg

1. ✅ Hämta test keys från Stripe Dashboard
2. ✅ Uppdatera `.env.local` med test keys
3. ✅ Starta om utvecklingsservern
4. ✅ Testa en betalning med test-kort `4242 4242 4242 4242`
5. ✅ Verifiera att ordern skapas korrekt
6. ⏳ När du är redo för produktion: Aktivera Stripe-kontot
7. ⏳ Deploya till HTTPS-server
8. ⏳ Byt till live keys

## Resurser

- Stripe Test Mode: https://stripe.com/docs/testing
- Stripe Dashboard: https://dashboard.stripe.com/
- Stripe Onboarding: https://dashboard.stripe.com/account/onboarding
- Stripe API Docs: https://stripe.com/docs/api
- Test Cards: https://stripe.com/docs/testing#cards
