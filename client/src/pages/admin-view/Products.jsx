import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/admin-view/Layout';
import PageLoader from '../../components/admin-view/PageLoader';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newProduct, setNewProduct] = useState({
        product: '',
        price: '',
        description: '',
        image: '',
        category: '',
        sizes: [{ size: '', countInStock: '' }],
    });


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setProducts(response.data);
            } catch (err) {
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };


    const handleSizeChange = (index, e) => {
        const { name, value } = e.target;
        const sizes = [...newProduct.sizes];
        sizes[index][name] = value;
        setNewProduct({ ...newProduct, sizes });
    };

    
    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/products', newProduct, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setProducts([...products, response.data]);
            setNewProduct({
                product: '',
                price: '',
                description: '',
                image: '',
                category: '',
                sizes: [{ size: '', countInStock: '' }],
            });
        } catch (err) {
            console.error('Error adding product:', err);
        }
    };

    
    const handleDeleteProduct = async (productId) => {
        try {
            await axios.delete(`/api/products/${productId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setProducts(products.filter(product => product._id !== productId));
        } catch (err) {
            console.error('Error deleting product:', err);
        }
    };

    if (loading) {
        return <PageLoader title="Products" variant="products" />;
    }

    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-4">Products</h1>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <form onSubmit={handleAddProduct}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Product Name</label>
                        <input
                            type="text"
                            name="product"
                            value={newProduct.product}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={newProduct.price}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={newProduct.description}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Image URL</label>
                        <input
                            type="text"
                            name="image"
                            value={newProduct.image}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Category</label>
                        <select
                            name="category"
                            value={newProduct.category}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="jewerely">Jewelry</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Sizes</label>
                        {newProduct.sizes.map((size, index) => (
                            <div key={index} className="flex mb-2">
                                <input
                                    type="text"
                                    name="size"
                                    value={size.size}
                                    onChange={(e) => handleSizeChange(index, e)}
                                    className="w-1/2 p-2 border border-gray-300 rounded mr-2"
                                    placeholder="Size"
                                    required
                                />
                                <input
                                    type="number"
                                    name="countInStock"
                                    value={size.countInStock}
                                    onChange={(e) => handleSizeChange(index, e)}
                                    className="w-1/2 p-2 border border-gray-300 rounded"
                                    placeholder="Stock"
                                    required
                                />
                            </div>
                        ))}
                    </div>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Product</button>
                </form>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left">ID</th>
                            <th className="text-left">Product</th>
                            <th className="text-left">Price</th>
                            <th className="text-left">Description</th>
                            <th className="text-left">Image</th>
                            <th className="text-left">Category</th>
                            <th className="text-left">Sizes</th>
                            <th className="text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id} className="border-t">
                                <td className="py-2">{product._id}</td>
                                <td className="py-2">{product.product}</td>
                                <td className="py-2">${product.price}</td>
                                <td className="py-2">{product.description}</td>
                                <td className="py-2">
                                    <img src={product.image} alt={product.product} className="w-16 h-16 object-cover" />
                                </td>
                                <td className="py-2">{product.category}</td>
                                <td className="py-2">
                                    {product.sizes.map((size, index) => (
                                        <div key={index}>
                                            Size: {size.size}, Stock: {size.countInStock}
                                        </div>
                                    ))}
                                </td>
                                <td className="py-2">
                                    <button
                                        onClick={() => handleDeleteProduct(product._id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default AdminProducts;