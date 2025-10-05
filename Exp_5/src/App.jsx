import React from 'react';
import './App.css'; 
import img1 from './assests/image1.jpg'
import img2 from './assests/image2.jpg'
import img3 from './assests/image3.jpg'
import img4 from './assests/image4.jpg'
import img5 from './assests/image5.jpg'
import img6 from './assests/image6.jpg'
// Header Component
function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-title">
          <a href="#" className="header-link">My Book Store</a>
        </h1>
        <nav className="nav">
          <a href="#" className="nav-link">Home</a>
          <a href="#featured" className="nav-link">Books</a>
          <a href="#categories" className="nav-link">Categories</a>
          <a href="#contact" className="nav-link">Contact</a>
        </nav>
        <div className="search-bar">
          <input type="text" placeholder="Search books..." className="search-input" />
        </div>
      </div>
    </header>
  );
}

// Hero Section Component
function HeroSection() {
  return (
    <section className="hero-section">
      <h2 className="hero-title">Discover Your Next Great Read!</h2>
      <p className="hero-subtitle">Explore a vast collection of books across various genres.</p>
      <button className="hero-button">
        Shop Now
      </button>
      <img src="https://placehold.co/1200x400/ADD8E6/000000?text=Bookstore+Banner" alt="Bookstore Banner" className="hero-image" />
    </section>
  );
}

// Book Card Component
function BookCard({ image, title, author, price }) {
  return (
    <div className="book-card">
      <img src={image} alt="Book Cover" className="book-cover" />
      <div className="book-details">
        <h3 className="book-title">{title}</h3>
        <p className="book-author">By {author}</p>
        <p className="book-price">${price}</p>
        <button className="add-to-cart-btn">Add to Cart</button>
      </div>
    </div>
  );
}

// Featured Books Component
function FeaturedBooks() {
  const books = [
    { id: 1, image: img1, title: 'The Lorem Ipsum Saga', author: 'Jane Doe', price: '19.99' },
    { id: 2, image: img2, title: 'Adventures in CSS', author: 'John Smith', price: '24.50' },
    { id: 3, image: img3, title: 'The HTML Handbook', author: 'Alice Wonderland', price: '15.00' },
    { id: 4, image: img4, title: 'JavaScript Mastery', author: 'Bob Builder', price: '29.95' },
    { id: 5, image: img5, title: 'The Art of Storytelling', author: 'Clara Narrator', price: '18.75' },
    { id: 6, image: img6, title: 'Cooking with Code', author: 'Chef Byte', price: '22.00' },
  ];

  return (
    <section id="featured" className="featured-books">
      <h2 className="section-title">Featured Books</h2>
      <div className="book-grid">
        {books.map(book => (
          <BookCard
            key={book.id}
            image={book.image}
            title={book.title}
            author={book.author}
            price={book.price}
          />
        ))}
      </div>
    </section>
  );
}

// Categories Component
function Categories() {
  const categories = [
    { name: 'Fiction', class: 'fiction' },
    { name: 'Non-Fiction', class: 'non-fiction' },
    { name: 'Science Fiction', class: 'science-fiction' },
    { name: 'Fantasy', class: 'fantasy' },
    { name: 'Mystery', class: 'mystery' },
    { name: 'Biography', class: 'biography' },
    { name: 'History', class: 'history' },
    { name: "Children's", class: 'children' },
  ];

  return (
    <section id="categories" className="categories-section">
      <h2 className="section-title">Browse Categories</h2>
      <div className="category-grid">
        {categories.map((cat, index) => (
          <div key={index} className={`category-card ${cat.class}`}>
            <p className="category-name">{cat.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// Footer Component
function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="footer-container">
        <p className="footer-text">&copy; 2025 My Book Store. All rights reserved.</p>
        <p className="footer-text-small">Contact us: info@mybookstore.com | Phone: (123) 456-7890</p>
        <div className="social-links">
          <a href="#" className="social-link">Facebook</a>
          <a href="#" className="social-link">Twitter</a>
          <a href="#" className="social-link">Instagram</a>
        </div>
      </div>
    </footer>
  );
}

// Main App Component
function App() {
  return (
    <div className="body">
      <Header />
      <main className="main-content">
        <HeroSection />
        <FeaturedBooks />
        <Categories />
      </main>
      <Footer />
    </div>
  );
}

export default App;