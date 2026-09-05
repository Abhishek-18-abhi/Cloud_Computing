import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { useCart } from "../context/useCart";
import products, { categories, formatPrice } from "../data/products";

function Products() {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products
      .filter((product) => selectedCategory === "All" || product.category === selectedCategory)
      .filter((product) => {
        if (!query) {
          return true;
        }

        return [
          product.name,
          product.brand,
          product.category,
          product.description,
          product.tags.join(" "),
        ].join(" ").toLowerCase().includes(query);
      })
      .sort((first, second) => {
        if (sortBy === "price-low") {
          return first.price - second.price;
        }

        if (sortBy === "price-high") {
          return second.price - first.price;
        }

        return Number(second.featured) - Number(first.featured);
      });
  }, [search, selectedCategory, sortBy]);

  return (
    <>
      <Navbar />

      <main className="products-page">
        <section className="catalog-hero">
          <div>
            <span className="section-label">Electronics catalog</span>
            <h1>Shop {products.length} curated tech products</h1>
            <p>Search, filter by category, sort by price, and add products to a persistent cart.</p>
          </div>
        </section>

        <section className="catalog-controls" aria-label="Product filters">
          <label className="search-control">
            Search products
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search product, brand, or feature"
            />
          </label>

          <label>
            Sort by
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </label>
        </section>

        <div className="category-pills">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={selectedCategory === category ? "active" : ""}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="catalog-summary">
          Showing <strong>{filteredProducts.length}</strong> of {products.length} products
          {(search || selectedCategory !== "All" || sortBy !== "featured") && (
            <button
              className="clear-filters"
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
                setSortBy("featured");
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        <section className="products-container">
          {filteredProducts.map((product) => (
            <article className="card" key={product.id}>
              {product.featured && <span className="product-badge">Featured</span>}
              <button
                className="image-button"
                type="button"
                onClick={() => setSelectedProduct(product)}
              >
                <img src={product.img} alt={product.name} className="card-image" />
              </button>

              <div className="card-content">
                <div className="product-meta">
                  <span>{product.brand}</span>
                  <strong>{product.category}</strong>
                </div>

                <span className="product-assurance">Carefully selected • Ready to order</span>

                <h2>{product.name}</h2>
                <p>{product.description}</p>

                <div className="tag-row">
                  {product.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>

              <div className="card-footer">
                <div>
                  <strong className="price">{formatPrice(product.price)}</strong>
                  <span className="price-note">Listed price</span>
                </div>
                <span className="availability">In stock</span>
              </div>

              <div className="card-actions">
                <button type="button" className="outline-btn" onClick={() => setSelectedProduct(product)}>
                  View
                </button>
                <button type="button" className="card-btn" onClick={() => addToCart(product)}>
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </section>

        {filteredProducts.length === 0 && (
          <div className="empty-state">
            <h2>No products found</h2>
            <p>Try a different category or search term.</p>
          </div>
        )}
      </main>

      {selectedProduct && (
        <div className="modal-layer" role="dialog" aria-modal="true">
          <div className="product-modal">
            <button
              type="button"
              className="modal-close"
              onClick={() => setSelectedProduct(null)}
            >
              Close
            </button>
            <img src={selectedProduct.img} alt={selectedProduct.name} />
            <div>
              <span className="section-label">{selectedProduct.category}</span>
              <h2>{selectedProduct.name}</h2>
              <p>{selectedProduct.description}</p>
              <ul className="details-list">
                <li>Brand: {selectedProduct.brand}</li>
                <li>Category: {selectedProduct.category}</li>
                <li>Availability: In stock</li>
                <li>Listed price: {formatPrice(selectedProduct.price)}</li>
              </ul>
              <div className="modal-price">
                <strong>{formatPrice(selectedProduct.price)}</strong>
                <span>Listed price</span>
              </div>
              <button type="button" className="card-btn" onClick={() => addToCart(selectedProduct)}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Products;
