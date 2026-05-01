import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin } from "lucide-react";
import logoImg from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <img src={logoImg} alt="Shakil AAM Bazar" width={40} height={40} className="h-10 w-10 object-contain" loading="lazy" />
            <div>
              <div className="font-bold">Shakil AAM Bazar</div>
              <div className="text-[10px] uppercase tracking-widest opacity-70">খাঁটি রাজশাহীর আম</div>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm opacity-80 leading-relaxed">
            সরাসরি রাজশাহীর বাগান থেকে আপনার ঘরে পৌঁছে দিচ্ছি ফরমালিন ও কেমিক্যাল মুক্ত প্রিমিয়াম মানের আম। স্বাদে, গন্ধে ও পুষ্টিতে অতুলনীয়।
          </p>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider opacity-90">দ্রুত লিংক</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/" className="hover:text-accent">হোম</Link></li>
            <li><Link to="/shop" className="hover:text-accent">শপ</Link></li>
            <li><Link to="/about" className="hover:text-accent">আমাদের সম্পর্কে</Link></li>
            <li><Link to="/contact" className="hover:text-accent">যোগাযোগ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider opacity-90">যোগাযোগ</h4>
          <ul className="space-y-3 text-sm opacity-80">
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 flex-shrink-0" /><span>০১৭০০-০০০০০০</span></li>
            <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 flex-shrink-0" /><span>info@shakilaambazar.com</span></li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" /><span>রাজশাহী, বাংলাদেশ</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs opacity-70 md:px-8">
          © ২০২৬ Shakil AAM Bazar — সর্বস্বত্ব সংরক্ষিত
        </div>
      </div>
    </footer>
  );
}