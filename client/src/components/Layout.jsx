import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function MobileNavIcon({ name }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    home: <path {...common} d="m3.5 10.5 8.5-7.25 8.5 7.25v8.75a1.5 1.5 0 0 1-1.5 1.5h-4.5v-6.25h-5v6.25H5a1.5 1.5 0 0 1-1.5-1.5Z" />,
    books: <><path {...common} d="M4 5.75A2.75 2.75 0 0 1 6.75 3H11.5v16.5H6.75A2.75 2.75 0 0 0 4 22Z" /><path {...common} d="M20 5.75A2.75 2.75 0 0 0 17.25 3H12.5v16.5h4.75A2.75 2.75 0 0 1 20 22Z" /></>,
    plans: <path {...common} d="M6 3.5h12v17L12 17l-6 3.5Z" />,
    cart: <><path {...common} d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L20 8H6" /><circle {...common} cx="9" cy="20" r="1" /><circle {...common} cx="17" cy="20" r="1" /></>,
    profile: <><circle {...common} cx="12" cy="8.25" r="3.25" /><path {...common} d="M5 20.5c.75-3.5 3.2-5.5 7-5.5s6.25 2 7 5.5" /></>,
    join: <><rect {...common} x="4" y="4" width="16" height="16" rx="5" /><path {...common} d="M12 8.25v7.5M8.25 12h7.5" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{icons[name]}</svg>;
}

function MobileBottomNav({ user }) {
  const items = [["/", "Home", "home", true], ["/books", "Books", "books"], ["/membership", "Plans", "plans"], user ? ["/cart", "Cart", "cart"] : ["/register", "Join", "join"], user ? ["/dashboard", "Profile", "profile"] : ["/login", "Log in", "profile"]];
  return <nav className="mobile-bottom-nav" aria-label="Mobile navigation">{items.map(([to, label, icon, end]) => <NavLink key={label} to={to} end={end}><MobileNavIcon name={icon} /><span>{label}</span></NavLink>)}</nav>;
}

export default function Layout() {
  const { user, logout } = useAuth();
  return <><header className="site-header"><div className="header-inner"><Link className="brand" to="/"><img src="/kitab-ghar-logo.png" alt="Kitab Ghar Badlapur official logo" onError={(event) => { event.currentTarget.style.display = "none"; event.currentTarget.nextElementSibling?.classList.add("visible"); }} /><span className="brand-fallback" aria-hidden="true">Kitab Ghar <small>Badlapur</small></span></Link><nav className="desktop-nav"><NavLink to="/books">Browse books</NavLink><NavLink to="/membership">Membership</NavLink><NavLink to="/how-it-works">How it works</NavLink>{user && <><NavLink to="/cart">Cart</NavLink><NavLink to="/orders">Orders</NavLink><NavLink to="/notifications">Inbox</NavLink></>}{user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}</nav><div className="header-actions">{user ? <><NavLink to="/dashboard">Hello, {user.name.split(" ")[0]}</NavLink><button className="link-button" onClick={logout} type="button">Log out</button></> : <><NavLink to="/login">Log in</NavLink><Link className="header-button" to="/register">Join Kitab Ghar →</Link></>}</div></div></header><main><Outlet /></main><footer className="footer"><strong>Kitab Ghar</strong><span>Currently serving readers across Badlapur, Maharashtra.</span></footer><MobileBottomNav user={user} /></>;
}
