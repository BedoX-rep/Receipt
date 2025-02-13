
export default function Products() {
  const products = [
    {
      name: "Ray-Ban Aviator",
      category: "Sunglasses",
      price: "$169.99",
      description: "Classic aviator style with premium metal frame"
    },
    {
      name: "Oakley Sport",
      category: "Sunglasses",
      price: "$199.99",
      description: "Performance sports sunglasses with UV protection"
    },
    {
      name: "Gucci Square",
      category: "Eyeglasses",
      price: "$299.99",
      description: "Luxury square frames with signature design"
    },
    {
      name: "Tom Ford Round",
      category: "Eyeglasses",
      price: "$389.99",
      description: "Sophisticated round frames in titanium"
    },
    {
      name: "Prada Classic",
      category: "Sunglasses",
      price: "$279.99",
      description: "Timeless design with premium acetate frame"
    },
    {
      name: "Versace Bold",
      category: "Eyeglasses",
      price: "$329.99",
      description: "Bold geometric frames with iconic details"
    }
  ];

  return (
    <div className="products-page">
      <h1 className="title">Our Collections</h1>
      <div className="categories">
        <button className="category-btn active">All</button>
        <button className="category-btn">Sunglasses</button>
        <button className="category-btn">Eyeglasses</button>
      </div>
      <div className="products-grid">
        {products.map((product, index) => (
          <div key={index} className="product-card">
            <div className="product-image"></div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <span className="category">{product.category}</span>
              <p>{product.description}</p>
              <div className="price">{product.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
