
import React, { useState, useEffect } from "react";
import { ArrowRight, CheckCircle, Eye, EyeOff, Lock, Mail, Phone, ShieldCheck, User, X } from "lucide-react";
import "./Login.css";

const Signup = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", password: "", confirm_password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => { if(isOpen) setErrors({}); }, [isOpen]);
  if (!isOpen) return null;

  const validate = () => {
    const err = {};
    if (form.full_name.trim().length < 3) err.full_name = "Enter valid full name";
    if (!form.email) err.email = "Email required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) err.email = "Invalid email";
    if (!/^[6-9]\d{9}$/.test(form.phone)) err.phone = "Valid 10-digit mobile required";
    if (form.password.length < 6) err.password = "Min 6 chars";
    if (form.password!== form.confirm_password) err.confirm_password = "Passwords do not match";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    localStorage.setItem("userEmail", form.email);
    alert("Account created! Now sign in.");
    onSwitchToLogin(); // auto go to login - THIS FIXES YOUR ISSUE
  };

  return (
    <div className="login-popup">
      <div className="login-overlay" onClick={onClose} />
      <div className="login-box">
        <button type="button" className="login-close" onClick={onClose}><X size={20} /></button>
        <div className="login-left">
          <div className="login-left-content">
            <ShieldCheck size={32} />
            <h2>Create your<br/>account today.</h2>
            <p>Join us and start building your future.</p>
          </div>
        </div>
        <div className="login-right">
          <span className="login-label">GET STARTED</span>
          <h1>Create your account</h1>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field"><div className={`login-input-box ${errors.full_name?'input-error':''}`}><User size={18} className="input-icon"/><input type="text" name="full_name" placeholder="Full name" value={form.full_name} onChange={(e)=>{setForm({...form, full_name:e.target.value}); setErrors({...errors, full_name:''})}} /></div>{errors.full_name && <small className="input-error-message">{errors.full_name}</small>}</div>
            <div className="login-field"><div className={`login-input-box ${errors.email?'input-error':''}`}><Mail size={18} className="input-icon"/><input type="email" name="email" placeholder="Email address" value={form.email} onChange={(e)=>{setForm({...form, email:e.target.value}); setErrors({...errors, email:''})}} /></div>{errors.email && <small className="input-error-message">{errors.email}</small>}</div>
            <div className="login-field"><div className={`login-input-box ${errors.phone?'input-error':''}`}><Phone size={18} className="input-icon"/><input type="tel" name="phone" maxLength={10} placeholder="Mobile number" value={form.phone} onChange={(e)=>{setForm({...form, phone:e.target.value}); setErrors({...errors, phone:''})}} /></div>{errors.phone && <small className="input-error-message">{errors.phone}</small>}</div>
            <div className="login-field"><div className={`login-input-box ${errors.password?'input-error':''}`}><Lock size={18} className="input-icon"/><input type={showPassword?"text":"password"} name="password" placeholder="Password" value={form.password} onChange={(e)=>{setForm({...form, password:e.target.value}); setErrors({...errors, password:''})}} /><button type="button" className="password-toggle" onClick={()=>setShowPassword(!showPassword)}>{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></div>{errors.password && <small className="input-error-message">{errors.password}</small>}</div>
            <div className="login-field"><div className={`login-input-box ${errors.confirm_password?'input-error':''}`}><CheckCircle size={18} className="input-icon"/><input type={showConfirmPassword?"text":"password"} name="confirm_password" placeholder="Confirm password" value={form.confirm_password} onChange={(e)=>{setForm({...form, confirm_password:e.target.value}); setErrors({...errors, confirm_password:''})}} /><button type="button" className="password-toggle" onClick={()=>setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></div>{errors.confirm_password && <small className="input-error-message">{errors.confirm_password}</small>}</div>
            <button type="submit" className="login-button"><span>Create account</span><ArrowRight size={17} /></button>
          </form>
          <div className="login-switch">
            <span>Already have an account?</span>
            <button type="button" onClick={onSwitchToLogin}>Sign in</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Signup;