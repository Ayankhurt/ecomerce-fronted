import axios from 'axios';
import { useEffect, useState } from 'react';

const Home = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [apiLoad, setApiLoad] = useState(false);

  const baseUrl = "https://ecom-server-three.vercel.app/";

  const addProduct = (e) => {
    e.preventDefault();
    axios
      .post(`${baseUrl}add-product`, {
        name: productName,
        price: productPrice,
        description: productDescription,
      })
      .then((res) => {
        console.log(res.data);
        setProductName('');
        setProductDescription('');
        setProductPrice('');
        setApiLoad(!apiLoad);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axios
      .get(`${baseUrl}get-products`)
      .then((res) => {
        setAllProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [apiLoad]);

  return (
    <div className="container py-5">
      <div className="card p-4 shadow-sm">
        <h2 className="text-center mb-4">Add New Product</h2>
        <form onSubmit={addProduct}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name:
            </label>
            <input
              type="text"
              id="name"
              className="form-control"
              required
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">
              Price:
            </label>
            <input
              type="text"
              id="price"
              className="form-control"
              required
              placeholder="Product Price"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description:
            </label>
            <textarea
              id="description"
              className="form-control"
              required
              placeholder="Product Description"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              rows={4}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Submit
          </button>
        </form>
      </div>

      <div className="mt-5">
        <h2 className="text-center mb-4">Product List</h2>
        <div className="row">
          {allProducts?.map((eachProduct, i) => (
            <div
              key={eachProduct.id || i}
              className="col-12 col-sm-6 col-lg-4 mb-3"
            >
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h6 className="card-title">
                    Name: {eachProduct?.name}
                  </h6>
                  <h6 className="card-subtitle mb-2 text-muted">
                    Price: ${eachProduct?.price}
                  </h6>
                  <p className="card-text">
                    Description: {eachProduct?.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;