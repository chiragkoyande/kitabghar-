import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  return <><header className="site-header"><div className="header-inner"><Link className="brand" to="/"><img src="/kitab-ghar-logo.png" alt="Kitab Ghar Badlapur official logo" onError={(event) => { event.currentTarget.style.display = "none"; event.currentTarget.nextElementSibling?.classList.add("visible"); }} /><span className="brand-fallback" aria-hidden="true">Kitab Ghar <small>Badlapur</small></span></Link><nav><NavLink to="/books">Browse books</NavLink><NavLink to="/membership">Membership</NavLink><NavLink to="/how-it-works">How it works</NavLink>{user && <><NavLink to="/cart">Cart</NavLink><NavLink to="/orders">Orders</NavLink><NavLink to="/notifications">Inbox</NavLink></>}{user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}</nav><div className="header-actions">{user ? <><NavLink to="/dashboard">Hello, {user.name.split(" ")[0]}</NavLink><button className="link-button" onClick={logout} type="button">Log out</button></> : <><NavLink to="/login">Log in</NavLink><Link className="header-button" to="/register">Join Kitab Ghar →</Link></>}</div></div></header><main><Outlet /></main><footer className="footer"><strong>Kitab Ghar</strong><span>Currently serving readers across Badlapur, Maharashtra.</span></footer></>;
}
