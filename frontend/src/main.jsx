import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Routes, Route, Link, useNavigate, useLocation, useParams} from 'react-router-dom';
import axios from 'axios';
import {BookOpen, Search, ShoppingBag, User, Heart, ArrowRight, Star, ShieldCheck, Truck, RotateCcw, Menu, X, LogOut, ChevronRight, Minus, Plus, Trash2, CheckCircle2} from 'lucide-react';
import './styles.css';

const api = axios.create({baseURL:'http://localhost:8080/api'});
api.interceptors.request.use(config=>{
  const token=localStorage.getItem('dh_token');
  if(token) config.headers.Authorization=`Bearer ${token}`;
  return config;
});

const AuthContext=createContext(null);
function AuthProvider({children}){
  const [user,setUser]=useState(()=>JSON.parse(localStorage.getItem('dh_user')||'null'));
  const login=(data)=>{localStorage.setItem('dh_token',data.token);localStorage.setItem('dh_user',JSON.stringify(data.user));setUser(data.user)};
  const logout=()=>{localStorage.removeItem('dh_token');localStorage.removeItem('dh_user');setUser(null)};
  return <AuthContext.Provider value={{user,login,logout}}>{children}</AuthContext.Provider>
}
const useAuth=()=>useContext(AuthContext);

const CartContext=createContext(null);
function CartProvider({children}){
  const [cart,setCart]=useState(()=>JSON.parse(localStorage.getItem('dh_cart')||'[]'));
  useEffect(()=>localStorage.setItem('dh_cart',JSON.stringify(cart)),[cart]);
  const add=(book)=>setCart(c=>c.some(x=>x.id===book.id)?c.map(x=>x.id===book.id?{...x,qty:x.qty+1}:x):[...c,{...book,qty:1}]);
  const remove=(id)=>setCart(c=>c.filter(x=>x.id!==id));
  const change=(id,d)=>setCart(c=>c.map(x=>x.id===id?{...x,qty:Math.max(1,x.qty+d)}:x));
  const clear=()=>setCart([]);
  const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
  return <CartContext.Provider value={{cart,add,remove,change,clear,total}}>{children}</CartContext.Provider>
}
const useCart=()=>useContext(CartContext);

function Header(){
  const {user,logout}=useAuth(); const {cart}=useCart();
  const [open,setOpen]=useState(false);
  const navigate=useNavigate();
  return <header className="header">
    <div className="nav container">
      <Link className="brand" to="/"><span className="brand-mark"><BookOpen size={22}/></span><span>Siddhi's <b>Bookstore</b></span></Link>
      <div className="nav-search"><Search size={18}/><input placeholder="Search books, authors..." onKeyDown={e=>e.key==='Enter'&&navigate('/books?q='+encodeURIComponent(e.target.value))}/></div>
      <nav className={open?'mobile-open':''}>
        <Link to="/books">Shop</Link><Link to="/books?category=Fiction">Categories</Link>
        {user?<button className="nav-btn" onClick={logout}><LogOut size={17}/> Logout</button>:<Link className="login-link" to="/login">Sign in</Link>}
        <Link className="cart-link" to="/cart"><ShoppingBag size={19}/><span>Cart</span>{cart.length>0&&<em>{cart.reduce((s,x)=>s+x.qty,0)}</em>}</Link>
      </nav>
      <button className="menu-btn" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
    </div>
  </header>
}

function Home(){
  const [books,setBooks]=useState([]);
  useEffect(()=>{api.get('/books').then(r=>setBooks(r.data))},[]);
  return <>
    <section className="hero"><div className="container hero-grid">
      <div><div className="eyebrow">CURATED FOR CURIOUS MINDS</div><h1>Find your next <span>great read.</span></h1><p>Discover handpicked books for every mood, ambition and chapter of life.</p><div className="hero-actions"><Link className="btn btn-dark" to="/books">Explore books <ArrowRight size={18}/></Link><Link className="text-link" to="/books?category=Fiction">Browse fiction <ChevronRight size={17}/></Link></div>
      <div className="hero-trust"><div><b>10k+</b><small>Readers</small></div><div><b>4.8/5</b><small>Average rating</small></div><div><b>24hr</b><small>Fast dispatch</small></div></div></div>
      <div className="hero-art"><div className="book-stack"><div className="floating-card">Editor's pick <Star size={14} fill="currentColor"/></div><div className="cover cover-one"><small>SIDDHI'S</small><strong>THE<br/>READING<br/>ROOM</strong><span>Stories worth keeping.</span></div><div className="cover cover-two">BOOK<br/>YOUR<br/>MOMENT</div></div></div>
    </div></section>
    <section className="benefits"><div className="container benefit-grid"><Benefit icon={<Truck/>} title="Fast delivery" text="Carefully packed and shipped quickly."/><Benefit icon={<ShieldCheck/>} title="Secure checkout" text="Your account and orders stay protected."/><Benefit icon={<RotateCcw/>} title="Easy returns" text="Simple support when a book isn't right."/><Benefit icon={<Heart/>} title="Reader first" text="Thoughtful picks for every kind of reader."/></div></section>
    <section className="section container"><div className="section-head"><div><div className="eyebrow">POPULAR RIGHT NOW</div><h2>Readers are loving these</h2></div><Link className="text-link" to="/books">View all <ArrowRight size={16}/></Link></div><div className="book-grid">{books.slice(0,4).map(b=><BookCard key={b.id} book={b}/>)}</div></section>
  </>
}
function Benefit({icon,title,text}){return <div className="benefit"><span>{icon}</span><div><b>{title}</b><small>{text}</small></div></div>}

function BookCard({book}){
 const {add}=useCart();
 return <article className="book-card"><Link to={'/books/'+book.id} className="book-image"><img src={book.imageUrl} alt={book.title}/><button onClick={e=>e.preventDefault()} className="heart"><Heart size={18}/></button>{book.originalPrice>book.price&&<span className="sale">SALE</span>}</Link><div className="book-info"><span className="category">{book.category}</span><Link to={'/books/'+book.id}><h3>{book.title}</h3></Link><p>{book.author}</p><div className="rating"><Star size={14} fill="currentColor"/><b>{book.rating}</b><span>({book.reviewCount})</span></div><div className="card-bottom"><div><strong>₹{book.price.toFixed(0)}</strong>{book.originalPrice&&<del>₹{book.originalPrice.toFixed(0)}</del>}</div><button className="add-btn" onClick={()=>add(book)}>Add</button></div></div></article>
}

function Books(){
 const [books,setBooks]=useState([]); const [loading,setLoading]=useState(true);
 const params=new URLSearchParams(useLocation().search); const q=params.get('q')||''; const category=params.get('category')||'';
 useEffect(()=>{setLoading(true);api.get('/books',{params:{q:q||undefined,category:category||undefined}}).then(r=>setBooks(r.data)).finally(()=>setLoading(false))},[q,category]);
 const cats=['All','Fiction','Finance','Self Help','Lifestyle','Productivity'];
 return <section className="section container books-page"><div className="page-title"><div><div className="eyebrow">THE COLLECTION</div><h1>{q?`Results for “${q}”`:'Explore our books'}</h1><p>Find something new to read, learn and keep.</p></div></div><div className="chips">{cats.map(c=><Link className={(category===(c==='All'?'':c))?'chip active':'chip'} to={c==='All'?'/books':'/books?category='+encodeURIComponent(c)} key={c}>{c}</Link>)}</div>{loading?<div className="loader">Loading books...</div>:books.length?<div className="book-grid">{books.map(b=><BookCard key={b.id} book={b}/>)}</div>:<div className="empty"><BookOpen size={42}/><h3>No books found</h3><p>Try a different title, author or category.</p></div>}</section>
}

function BookDetails(){
 const {id}=useParams(); const [book,setBook]=useState(null); const {add}=useCart();
 useEffect(()=>{api.get('/books/'+id).then(r=>setBook(r.data))},[id]);
 if(!book)return <div className="loader">Loading...</div>;
 return <section className="section container detail"><div className="detail-image"><img src={book.imageUrl} alt={book.title}/></div><div className="detail-copy"><span className="category">{book.category}</span><h1>{book.title}</h1><p className="author">by <b>{book.author}</b></p><div className="rating large"><Star size={18} fill="currentColor"/><b>{book.rating}</b><span>{book.reviewCount} reviews</span></div><p className="description">{book.description}</p><div className="price-row"><strong>₹{book.price.toFixed(0)}</strong>{book.originalPrice&&<del>₹{book.originalPrice.toFixed(0)}</del>}<span className="save">Save ₹{(book.originalPrice-book.price).toFixed(0)}</span></div><div className="detail-actions"><button className="btn btn-dark" onClick={()=>add(book)}>Add to cart <ShoppingBag size={18}/></button><Link className="btn btn-light" to="/cart">Go to cart</Link></div><div className="stock"><CheckCircle2 size={17}/> {book.stock>0?'In stock — ready to ship':'Currently unavailable'}</div></div></section>
}

function Cart(){
 const {cart,total,change,remove}=useCart(); const {user}=useAuth(); const navigate=useNavigate(); const [busy,setBusy]=useState(false); const [done,setDone]=useState(false);
 const checkout=async()=>{if(!user)return navigate('/login?next=/cart');setBusy(true);try{await api.post('/orders',{bookIds:cart.map(x=>x.id),total});setDone(true)}catch(e){alert(e.response?.data?.message||'Checkout failed')}finally{setBusy(false)}};
 if(done)return <section className="section container center-page"><div className="success"><CheckCircle2 size={56}/><h1>Order placed!</h1><p>Thank you for shopping with Siddhi's Bookstore.</p><Link className="btn btn-dark" to="/books">Continue shopping</Link></div></section>;
 return <section className="section container cart-page"><div className="page-title"><div><div className="eyebrow">YOUR BAG</div><h1>Shopping cart</h1></div></div>{!cart.length?<div className="empty"><ShoppingBag size={42}/><h3>Your cart is empty</h3><p>Add a few books and come back here.</p><Link className="btn btn-dark" to="/books">Explore books</Link></div>:<div className="cart-layout"><div className="cart-items">{cart.map(x=><div className="cart-item" key={x.id}><img src={x.imageUrl}/><div className="cart-meta"><Link to={'/books/'+x.id}><h3>{x.title}</h3></Link><p>{x.author}</p><strong>₹{x.price.toFixed(0)}</strong></div><div className="qty"><button onClick={()=>change(x.id,-1)}><Minus size={15}/></button><b>{x.qty}</b><button onClick={()=>change(x.id,1)}><Plus size={15}/></button></div><button className="remove" onClick={()=>remove(x.id)}><Trash2 size={18}/></button></div>)}</div><aside className="summary"><h2>Order summary</h2><div><span>Subtotal</span><b>₹{total.toFixed(0)}</b></div><div><span>Delivery</span><b className="free">FREE</b></div><hr/><div className="grand"><span>Total</span><b>₹{total.toFixed(0)}</b></div><button className="btn btn-dark full" disabled={busy} onClick={checkout}>{busy?'Placing order...':'Checkout securely'} <ArrowRight size={17}/></button><small className="secure"><ShieldCheck size={14}/> Secure checkout</small></aside></div>}</section>
}

function Login(){
 const {login}=useAuth(); const nav=useNavigate(); const [form,setForm]=useState({email:'',password:''}); const [error,setError]=useState(''); const [busy,setBusy]=useState(false);
 const submit=async e=>{e.preventDefault();setError('');if(!form.email||!form.password)return setError('Please fill in all fields.');setBusy(true);try{const r=await api.post('/auth/login',form);login(r.data);nav('/')}catch(e){setError(e.response?.data?.message||'Unable to sign in.')}finally{setBusy(false)}};
 return <AuthLayout title="Welcome back" subtitle="Sign in to continue your reading journey."><form className="form" onSubmit={submit}><Field label="Email" type="email" value={form.email} onChange={v=>setForm({...form,email:v})} placeholder="you@example.com"/><Field label="Password" type="password" value={form.password} onChange={v=>setForm({...form,password:v})} placeholder="••••••••"/>{error&&<div className="error">{error}</div>}<button className="btn btn-dark full" disabled={busy}>{busy?'Signing in...':'Sign in'} <ArrowRight size={17}/></button><p className="form-foot">New here? <Link to="/register">Create an account</Link></p></form></AuthLayout>
}
function Register(){
 const {login}=useAuth(); const nav=useNavigate(); const [form,setForm]=useState({name:'',email:'',password:''}); const [error,setError]=useState(''); const [busy,setBusy]=useState(false);
 const submit=async e=>{e.preventDefault();setError('');if(form.name.length<2||!form.email||form.password.length<6)return setError('Use a valid name, email and password of at least 6 characters.');setBusy(true);try{const r=await api.post('/auth/register',form);login(r.data);nav('/')}catch(e){setError(e.response?.data?.message||'Unable to create account.')}finally{setBusy(false)}};
 return <AuthLayout title="Create your account" subtitle="Save your cart, track orders and discover more books."><form className="form" onSubmit={submit}><Field label="Full name" value={form.name} onChange={v=>setForm({...form,name:v})} placeholder="Siddhi"/><Field label="Email" type="email" value={form.email} onChange={v=>setForm({...form,email:v})} placeholder="you@example.com"/><Field label="Password" type="password" value={form.password} onChange={v=>setForm({...form,password:v})} placeholder="At least 6 characters"/>{error&&<div className="error">{error}</div>}<button className="btn btn-dark full" disabled={busy}>{busy?'Creating...':'Create account'} <ArrowRight size={17}/></button><p className="form-foot">Already have an account? <Link to="/login">Sign in</Link></p></form></AuthLayout>
}
function Field({label,type='text',value,onChange,placeholder}){return <label className="field"><span>{label}</span><input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/></label>}
function AuthLayout({title,subtitle,children}){return <section className="auth-page"><div className="auth-card"><div className="auth-brand"><span className="brand-mark"><BookOpen size={20}/></span>Siddhi's Bookstore</div><h1>{title}</h1><p>{subtitle}</p>{children}</div></section>}

function Orders(){
 const {user}=useAuth(); const [orders,setOrders]=useState([]); const nav=useNavigate();
 useEffect(()=>{if(user)api.get('/orders').then(r=>setOrders(r.data)).catch(()=>{})},[user]);
 if(!user){nav('/login');return null}
 return <section className="section container"><div className="page-title"><div><div className="eyebrow">ACCOUNT</div><h1>My orders</h1></div></div>{orders.length?<div className="orders">{orders.map(o=><div className="order" key={o.id}><div><b>Order #{o.id}</b><small>{new Date(o.createdAt).toLocaleString()}</small></div><span>{o.status}</span><strong>₹{o.total.toFixed(0)}</strong></div>)}</div>:<div className="empty"><ShoppingBag size={42}/><h3>No orders yet</h3><p>Your completed purchases will appear here.</p><Link className="btn btn-dark" to="/books">Start shopping</Link></div>}</section>
}

function Footer(){return <footer><div className="container footer-grid"><div><Link className="brand" to="/"><span className="brand-mark"><BookOpen size={20}/></span><span>Siddhi's <b>Bookstore</b></span></Link><p>Books for curious minds, ambitious goals and quiet evenings.</p></div><div><b>Shop</b><Link to="/books">All books</Link><Link to="/books?category=Fiction">Fiction</Link><Link to="/books?category=Finance">Finance</Link></div><div><b>Account</b><Link to="/login">Sign in</Link><Link to="/register">Register</Link><Link to="/orders">My orders</Link></div></div><div className="container footer-bottom">© 2026 Siddhi's Bookstore · Made with a love for reading.</div></footer>}

function App(){return <AuthProvider><CartProvider><Header/><Routes><Route path="/" element={<Home/>}/><Route path="/books" element={<Books/>}/><Route path="/books/:id" element={<BookDetails/>}/><Route path="/cart" element={<Cart/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/orders" element={<Orders/>}/></Routes><Footer/></CartProvider></AuthProvider>}
createRoot(document.getElementById('root')).render(<BrowserRouter><App/></BrowserRouter>);
