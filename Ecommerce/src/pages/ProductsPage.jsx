import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import ProductCard from '../components/ProductCard';
import { categories, products } from '../data/products';

const priceOptions = [100, 150, 200, 250, 300];

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => ({
    category: searchParams.get('category') ?? 'all',
    search: searchParams.get('search') ?? '',
    maxPrice: 300,
    minRating: 0,
    sort: 'featured',
  }));

  useEffect(() => {
    setFilters((current) => ({ ...current, category: searchParams.get('category') ?? 'all', search: searchParams.get('search') ?? '' }));
  }, [searchParams]);

  const visibleProducts = useMemo(() => {
    const query = filters.search.trim().toLowerCase();

    return [...products]
      .filter((product) => (filters.category === 'all' ? true : product.category === filters.category))
      .filter((product) => product.price <= filters.maxPrice)
      .filter((product) => product.rating >= filters.minRating)
      .filter((product) => {
        if (!query) return true;
        return [product.name, product.category, product.description, product.badge].join(' ').toLowerCase().includes(query);
      })
      .sort((left, right) => {
        if (filters.sort === 'price-low') return left.price - right.price;
        if (filters.sort === 'price-high') return right.price - left.price;
        if (filters.sort === 'rating') return right.rating - left.rating;
        if (filters.sort === 'name') return left.name.localeCompare(right.name);
        return Number(right.featured) - Number(left.featured);
      });
  }, [filters]);

  const categoriesWithAll = useMemo(() => [{ id: 'all', label: 'All categories' }, ...categories], []);

  return (
    <div className="page-stack">
      <section className="section-heading">
        <div>
          <span className="eyebrow">Product catalog</span>
          <h1>Filter by category, price, rating, and sort order.</h1>
        </div>
      </section>

      <section className="catalog-layout">
        <aside className="filters card">
          <div className="filter-group">
            <label htmlFor="search">Search</label>
            <input id="search" type="search" value={filters.search} onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} placeholder="Search the catalog" />
          </div>
          <div className="filter-group">
            <label htmlFor="category">Category</label>
            <select id="category" value={filters.category} onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))}>
              {categoriesWithAll.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="price">Max price: ${filters.maxPrice}</label>
            <input id="price" type="range" min="0" max="300" step="5" value={filters.maxPrice} onChange={(event) => setFilters((current) => ({ ...current, maxPrice: Number(event.target.value) }))} />
            <div className="range-labels">{priceOptions.map((price) => <span key={price}>${price}</span>)}</div>
          </div>
          <div className="filter-group">
            <label htmlFor="rating">Minimum rating</label>
            <select id="rating" value={filters.minRating} onChange={(event) => setFilters((current) => ({ ...current, minRating: Number(event.target.value) }))}>
              <option value="0">Any rating</option>
              <option value="4">4 stars and up</option>
              <option value="4.5">4.5 stars and up</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="sort">Sort by</label>
            <select id="sort" value={filters.sort} onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))}>
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="rating">Highest rating</option>
              <option value="name">Name</option>
            </select>
          </div>
        </aside>

        <div className="catalog-results">
          <div className="catalog-summary card">
            <span>{visibleProducts.length} products found</span>
            <p>Showing results for {filters.category === 'all' ? 'all categories' : filters.category}.</p>
          </div>

          {visibleProducts.length ? (
            <section className="product-grid">
              {visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </section>
          ) : (
            <EmptyState title="No products match those filters." description="Try widening the price range or changing the category." actionLabel="Reset filters" actionTo="/products" />
          )}
        </div>
      </section>
    </div>
  );
}