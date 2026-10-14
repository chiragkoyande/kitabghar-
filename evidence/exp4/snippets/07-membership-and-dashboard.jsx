export function MembershipPage() {
  const { loading, data: plans, error } = useApiData("/plans");
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const [payerReference, setPayerReference] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const subscribe = async (plan) => {
    if (!user) return;
    setSubmitting(true);
    setMessage("");
    try {
      const result = await apiRequest("/subscriptions", { method: "POST", body: JSON.stringify({ planId: plan._id, paymentMethod: "upi" }) });
      const upiId = result.upiId || import.meta.env.VITE_UPI_ID || "kitabghar@upi";
      const payload = "upi://pay?pa=" + encodeURIComponent(upiId) + "&pn=" + encodeURIComponent("Kitab Ghar Badlapur") + "&am=" + encodeURIComponent(plan.amount) + "&cu=INR&tn=" + encodeURIComponent(result.payment.transactionReference);
      setQrCode(await QRCode.toDataURL(payload, { width: 280, margin: 2, color: { dark: "#3b2118", light: "#fffdf8" } }));
      setPaymentIntent({ ...result, plan });
    } catch (requestError) { setMessage(requestError.message); } finally { setSubmitting(false); }
  };
  const submitProof = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try { await apiRequest("/payments/" + paymentIntent.payment._id + "/proof", { method: "PATCH", body: JSON.stringify({ payerReference }) }); setMessage("UPI reference sent. Your membership will activate after admin verification."); setPaymentIntent(null); setPayerReference(""); } catch (requestError) { setMessage(requestError.message); } finally { setSubmitting(false); }
  };
  return <section className="page"><p className="eyebrow">Membership</p><h1>Choose your reading rhythm.</h1><p className="lead">Pay securely by UPI. Your membership becomes active after the Kitab Ghar team verifies the transaction reference.</p>{loading && <div className="loading-state">Loading plans…</div>}{error && <div className="error-state">{error}</div>}<div className="membership-grid">{plans?.map((plan) => <article className="membership-card" key={plan._id}><p className="plan-name">{plan.name}</p><p className="plan-price">₹{plan.amount}<span>/month</span></p><p className="plan-limit">Up to {plan.maxActiveRentals} active rental{plan.maxActiveRentals > 1 ? "s" : ""}</p><ul>{plan.benefits?.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul>{user ? <button className="secondary-button" type="button" disabled={submitting} onClick={() => subscribe(plan)}>{submitting ? "Preparing QR…" : "Pay by UPI"}</button> : <Link className="secondary-button" to="/login">Log in to join</Link>}</article>)}</div>{message && <p className="notice">{message}</p>}{paymentIntent && <div className="payment-overlay" role="dialog" aria-modal="true" aria-labelledby="upi-payment-title"><div className="payment-modal"><button className="modal-close" type="button" aria-label="Close payment dialog" onClick={() => setPaymentIntent(null)}>×</button><p className="eyebrow">UPI payment</p><h2 id="upi-payment-title">Complete your {paymentIntent.plan.name} membership.</h2><p className="payment-amount">₹{paymentIntent.plan.amount}<span> / month</span></p>{qrCode && <img className="upi-qr" src={qrCode} alt="UPI payment QR code" />}<p className="payment-instruction">Scan the QR code in your UPI app, complete the payment, then enter the transaction reference below.</p><p className="payment-demo-note">Demo payment flow: the membership stays pending until an admin verifies the reference.</p><form onSubmit={submitProof}><label>UPI transaction reference<input required minLength="4" value={payerReference} onChange={(event) => setPayerReference(event.target.value)} placeholder="e.g. 312456789012" /></label><button className="primary-button" disabled={submitting} type="submit">{submitting ? "Submitting…" : "Submit for verification →"}</button></form></div></div>}</section>;
}
