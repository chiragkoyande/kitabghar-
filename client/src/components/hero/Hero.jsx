import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import GenieHero from "./GenieHero";

export default function Hero() {
  return <section className="home-hero"><div className="hero-copy"><motion.p className="eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>Kitab Ghar · Badlapur</motion.p><motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.7 }}>Books that come<br /><em>home with you.</em></motion.h1><motion.p className="hero-lead" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.7 }}>Discover, rent and enjoy your next favourite book with a simple membership designed for readers in Badlapur.</motion.p><motion.div className="hero-actions" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: 0.7 }}><Link className="primary-button hero-button" to="/books">Browse books <span>↗</span></Link><Link className="secondary-button hero-button" to="/membership">Explore membership <span>↗</span></Link></motion.div><div className="hero-metadata"><span>Local book rental</span><i /> <span>Membership from ₹199/month</span></div></div><div className="hero-visual"><GenieHero /></div></section>;
}
