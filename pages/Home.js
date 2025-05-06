import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const Home = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [apiLoad, setApiLoad] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ Loader state

  const [editProductId, setEditProductId] = useState(null);
  const [editProductName, setEditProductName] = useState('');
  const [editProductPrice, setEditProductPrice] = useState('');
  const [editProductDescription, setEditProductDescription] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  const baseUrl = "https://ecom-server-three.vercel.app/";

  const addProduct = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(`${baseUrl}add-product`, {
        name: productName,
        price: productPrice,
        description: productDescription,
      })
      .then(() => {
        setProductName('');
        setProductDescription('');
        setProductPrice('');
        setApiLoad(!apiLoad);
        Swal.fire('Success!', 'Product added successfully!', 'success');
      })
      .catch((err) => {
        console.log(err);
        Swal.fire('Error!', 'Failed to add product.', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const confirmDelete = (productId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This product will be deleted permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProduct(productId);
      }
    });
  };

  const deleteProduct = (productId) => {
    setLoading(true);
    axios
      .delete(`${baseUrl}delete-product/${productId}`)
      .then(() => {
        setApiLoad(!apiLoad);
        Swal.fire('Deleted!', 'Product has been deleted.', 'success');
      })
      .catch((err) => {
        console.log(err);
        Swal.fire('Error!', 'Failed to delete product.', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleEditClick = (product) => {
    setEditProductId(product.id);
    setEditProductName(product.name);
    setEditProductPrice(product.price.toString());
    setEditProductDescription(product.description);
    setShowEditModal(true);
  };

  const editProduct = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .put(`${baseUrl}edit-product/${editProductId}`, {
        name: editProductName,
        price: editProductPrice,
        description: editProductDescription,
      })
      .then(() => {
        setApiLoad(!apiLoad);
        setEditProductId(null);
        setShowEditModal(false);
        Swal.fire('Updated!', 'Product updated successfully!', 'success');
      })
      .catch((err) => {
        console.log(err);
        Swal.fire('Error!', 'Failed to update product.', 'error');
      })
      .finally(() => {
        setLoading(false);
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
      {/* ✅ Fullscreen Spinner */}
      {loading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex justify-content-center align-items-center"
          style={{ zIndex: 9999 }}
        >
          <Spinner animation="border" variant="primary" style={{ width: '5rem', height: '5rem' }} />
        </div>
      )}

      {/* Add Product Form */}
      <div className="card p-4 shadow-sm">
        <h2 className="text-center mb-4">Add New Product</h2>
        <form onSubmit={addProduct}>
          <div className="mb-3">
            <label className="form-label">Name:</label>
            <input
              type="text"
              className="form-control"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Price:</label>
            <input
              type="text"
              className="form-control"
              required
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description:</label>
            <textarea
              className="form-control"
              required
              rows={4}
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              disabled={loading}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            Submit
          </button>
        </form>
      </div>

      {/* Product List */}
      <div className="mt-5">
        <h2 className="text-center mb-4">Product List</h2>
        <div className="row">
          {allProducts.map((eachProduct) => (
            <div key={eachProduct.id} className="col-12 col-sm-6 col-lg-4 mb-3">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h6 className="card-title">Name: {eachProduct.name}</h6>
                  <h6 className="card-subtitle mb-2 text-muted">
                    Price: ${eachProduct.price}
                  </h6>
                  <p className="card-text">Description: {eachProduct.description}</p>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-warning"
                      onClick={() => handleEditClick(eachProduct)}
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => confirmDelete(eachProduct.id)}
                      disabled={loading}
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

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={editProduct}>
            <div className="mb-3">
              <label className="form-label">Name:</label>
              <input
                type="text"
                className="form-control"
                required
                value={editProductName}
                onChange={(e) => setEditProductName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Price:</label>
              <input
                type="text"
                className="form-control"
                required
                value={editProductPrice}
                onChange={(e) => setEditProductPrice(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description:</label>
              <textarea
                className="form-control"
                required
                rows={4}
                value={editProductDescription}
                onChange={(e) => setEditProductDescription(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button type="submit" variant="primary" className="w-100" disabled={loading}>
              Save Changes
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Home;
