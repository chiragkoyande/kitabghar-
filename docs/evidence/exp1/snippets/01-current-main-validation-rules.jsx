export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", mobile: "", dob: "", address: "", city: "Badlapur", pincode: "421503", password: "", confirmPassword: "", terms: false });
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({});
  const [attempted, setAttempted] = useState(false);
  const minimumDob = new Date(); minimumDob.setFullYear(minimumDob.getFullYear() - 13);
  const validate = (values) => {
    const next = {};
    if (values.name.trim().length < 2) next.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = "Enter a valid email address.";
    if (!/^[6-9]\d{9}$/.test(values.mobile)) next.mobile = "Enter a valid 10-digit Indian mobile number.";
    if (!values.dob || new Date(values.dob) > minimumDob) next.dob = "Readers must be at least 13 years old.";
    if (values.address.trim().length < 8) next.address = "Enter your delivery address.";
    if (!values.city.trim()) next.city = "Enter your city.";
    if (!/^\d{6}$/.test(values.pincode)) next.pincode = "Enter a valid 6-digit pincode.";
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(values.password)) next.password = "Use 8+ characters with uppercase, lowercase and a number.";
    if (values.confirmPassword !== values.password || !values.confirmPassword) next.confirmPassword = "Passwords do not match.";
    if (!values.terms) next.terms = "Accept the reader terms to continue.";
    return next;
