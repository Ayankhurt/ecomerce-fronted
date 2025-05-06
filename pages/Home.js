import axios from 'axios';
import { useEffect, useState } from 'react';

const Home = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [apiLoad, setApiLoad] = useState(false);

  // State for editing a product
  const [editProductId, setEditProductId] = useState(null);
  const [editProductName, setEditProductName] = useState('');
  const [editProductPrice, setEditProductPrice] = useState('');
  const [editProductDescription, setEditProductDescription] = useState('');

  const baseUrl = "https://ecom-server-three.vercel.app/"; // Replace with "http://localhost:5001/" if running locally

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

  const deleteProduct = (productId) => {
    axios
      .delete(`${baseUrl}delete-product/${productId}`)
      .then((res) => {
        console.log(res.data);
        setApiLoad(!apiLoad);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEditClick = (product) => {
    setEditProductId(product.id);
    setEditProductName(product.name);
    setEditProductPrice(product.price.toString());
    setEditProductDescription(product.description);
  };

  const editProduct = (e) => {
    e.preventDefault();
    console.log('Editing Product with ID:', editProductId);
    console.log('Edit Data:', {
      name: editProductName,
      price: editProductPrice,
      description: editProductDescription,
    });

    axios
      .put(`${baseUrl}edit-product/${editProductId}`, {
        name: editProductName,
        price: editProductPrice,
        description: editProductDescription,
      })
      .then((res) => {
        console.log('Edit Response:', res.data);
        setApiLoad(!apiLoad); // Refresh the product list
        setEditProductId(null); // Reset edit state to close modal
      })
      .catch((err) => {
        console.log('Edit Error:', err);
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
      {/* Add Product Form */}
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

      {/* Product List */}
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
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-warning"
                      data-bs-toggle="modal"
                      data-bs-target="#editProductModal"
                      onClick={() => handleEditClick(eachProduct)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteProduct(eachProduct.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Product Modal */}
      <div
        className="modal fade"
        id="editProductModal"
        tabIndex="-1"
        aria-labelledby="editProductModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editProductModalLabel">
                Edit Product
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={editProduct}>
                <div className="mb-3">
                  <label htmlFor="editName" className="form-label">
                    Name:
                  </label>
                  <input
                    type="text"
                    id="editName"
                    className="form-control"
                    required
                    value={editProductName}
                    onChange={(e) => setEditProductName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="editPrice" className="form-label">
                    Price:
                  </label>
                  <input
                    type="text"
                    id="editPrice"
                    className="form-control"
                    required
                    value={editProductPrice}
                    onChange={(e) => setEditProductPrice(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="editDescription" className="form-label">
                    Description:
                  </label>
                  <textarea
                    id="editDescription"
                    className="form-control"
                    required
                    value={editProductDescription}
                    onChange={(e) => setEditProductDescription(e.target.value)}
                    rows={4}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  data-bs-dismiss="modal"
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;