import { useState, useEffect } from 'react'

const categories = ['All', 'Electronics', 'Fashion', 'Kitchen', 'Sports']

export default function App() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState('store')
  const [form, setForm] = useState({ name: '', email: '', address: '', card: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [activeCategory, search])

  const fetchProducts = async () => {
    setLoading(true)
    let url = 'https://web-production-2e9f5.up.railway.app/products?'
    if (activeCategory !== 'All') url += `category=${activeCategory}&`
    if (search) url += `search=${search}`
    const res = await fetch(url)
    const data = await res.json()
    setProducts(data)
    setLoading(false)
  }

  const addToCart = (product) => {
    setCart([...cart, product])
    setCartOpen(true)
  }

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0)

  const handleOrder = async () => {
    await fetch('https://web-production-2e9f5.up.railway.app/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        address: form.address,
        total: total,
        items: cart.map(i => i.name)
      })
    })
    setCart([])
    setCartOpen(false)
    setPage('success')
  }

  // SUCCESS PAGE
  if (page === 'success') {
    return (
      <div style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '100px 20px' }}>
        <div style={{ fontSize: '80px' }}>🎉</div>
        <h1 style={{ fontSize: '36px', margin: '20px 0 10px' }}>Order Placed!</h1>
        <p style={{ color: 'gray', fontSize: '18px' }}>Thanks {form.name}, your order is on its way!</p>
        <button
          onClick={() => { setPage('store'); setForm({ name: '', email: '', address: '', card: '' }) }}
          style={{ marginTop: '30px', background: '#000', color: '#fff', border: 'none', padding: '15px 40px', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
        >
          Back to Store
        </button>
      </div>
    )
  }

  // CHECKOUT PAGE
  if (page === 'checkout') {
    return (
      <div style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
        <button onClick={() => setPage('store')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', marginBottom: '20px' }}>← Back to Store</button>
        <h1 style={{ marginBottom: '30px' }}>Checkout</h1>

        <div style={{ background: '#f9f9f9', borderRadius: '10px', padding: '20px', marginBottom: '30px' }}>
          <h3 style={{ margin: '0 0 15px' }}>Order Summary</h3>
          {cart.map((item, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <span>{item.image} {item.name}</span>
              <span style={{ fontWeight: 'bold' }}>${item.price}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontWeight: 'bold', fontSize: '18px' }}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {[
            { label: 'Full Name', key: 'name', placeholder: 'Diana' },
            { label: 'Email', key: 'email', placeholder: 'diana@email.com' },
            { label: 'Shipping Address', key: 'address', placeholder: 'Yerevan, Armenia' },
            { label: 'Card Number', key: 'card', placeholder: '1234 5678 9012 3456' },
          ].map(field => (
            <div key={field.key}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>{field.label}</label>
              <input
                type="text"
                placeholder={field.placeholder}
                value={form[field.key]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box' }}
              />
            </div>
          ))}

          <button
            onClick={handleOrder}
            disabled={!form.name || !form.email || !form.address || !form.card}
            style={{
              background: form.name && form.email && form.address && form.card ? '#000' : '#ccc',
              color: '#fff', border: 'none', padding: '15px', borderRadius: '5px',
              cursor: form.name && form.email && form.address && form.card ? 'pointer' : 'not-allowed',
              fontSize: '16px', marginTop: '10px'
            }}
          >
            Place Order — ${total.toFixed(2)}
          </button>
        </div>
      </div>
    )
  }

  // STORE PAGE
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <div style={{ background: '#000', color: '#fff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <h2 style={{ margin: 0 }}>🛍️ DD Store</h2>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', width: '250px', fontSize: '14px', outline: 'none' }}
        />
        <button onClick={() => setCartOpen(!cartOpen)} style={{ background: '#fff', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
          Cart ({cart.length})
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px', padding: '20px 30px', borderBottom: '1px solid #eee' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '8px 20px', borderRadius: '20px', border: '1px solid #000',
              background: activeCategory === cat ? '#000' : '#fff',
              color: activeCategory === cat ? '#fff' : '#000',
              cursor: 'pointer', fontWeight: 'bold', fontSize: '14px'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, padding: '30px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'gray' }}>
              <p style={{ fontSize: '40px' }}>⏳</p>
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'gray' }}>
              <p style={{ fontSize: '40px' }}>🔍</p>
              <p style={{ fontSize: '18px' }}>No products found</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: cartOpen ? 'repeat(3, 1fr)' : 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
              {products.map(product => (
                <div key={product.id} style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '60px' }}>{product.image}</div>
                  <h3 style={{ margin: '10px 0 5px' }}>{product.name}</h3>
                  <p style={{ color: 'gray', fontSize: '14px', margin: '0 0 5px' }}>{product.category}</p>
                  <p style={{ fontWeight: 'bold', fontSize: '18px', margin: '0 0 10px' }}>${product.price}</p>
                  <button
                    onClick={() => addToCart(product)}
                    style={{ background: '#000', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', width: '100%' }}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartOpen && (
          <div style={{ width: '320px', background: '#f9f9f9', borderLeft: '1px solid #ddd', padding: '20px', minHeight: '100vh', position: 'sticky', top: '60px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Your Cart</h3>
              <button onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            {cart.length === 0 ? (
              <p style={{ color: 'gray' }}>Your cart is empty</p>
            ) : (
              <>
                {cart.map((item, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>{item.image} {item.name}</p>
                      <p style={{ margin: 0, color: 'gray', fontSize: '13px' }}>${item.price}</p>
                    </div>
                    <button onClick={() => removeFromCart(index)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '16px' }}>🗑️</button>
                  </div>
                ))}
                <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '2px solid #000' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px' }}>
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => { setCartOpen(false); setPage('checkout') }}
                    style={{ width: '100%', background: '#000', color: '#fff', border: 'none', padding: '15px', borderRadius: '5px', cursor: 'pointer', marginTop: '15px', fontSize: '16px' }}
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}