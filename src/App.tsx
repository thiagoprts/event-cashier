import React, { useState, useEffect } from 'react';

// Interfaces for TypeScript type definitions
interface Product {
  id: number;
  name: string;
  price: number;
}

interface OrderItem extends Product {
  quantity: number;
}

interface ProductFormProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

interface OrderManagerProps {
  products: Product[];
  currentOrder: OrderItem[];
  setCurrentOrder: React.Dispatch<React.SetStateAction<OrderItem[]>>;
}

// Main App Component
function App() {
  // State to manage products, loaded from localStorage or initialized as empty
  // Os produtos são salvos automaticamente no localStorage para persistência de dados.
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : [];
  });

  // State to manage the current order, loaded from localStorage or initialized as empty
  // O pedido atual é salvo automaticamente no localStorage para persistência de dados.
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>(() => {
    const savedOrder = localStorage.getItem('currentOrder');
    return savedOrder ? JSON.parse(savedOrder) : [];
  });

  // State to manage the active tab
  const [activeTab, setActiveTab] = useState<'order' | 'products'>('order'); // 'order' or 'products'

  // Effect to save products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  // Effect to save currentOrder to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentOrder', JSON.stringify(currentOrder));
  }, [currentOrder]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-inter">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-4xl p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
          Gerenciador de Pedidos
        </h1>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('order')}
            className={`py-3 px-6 sm:px-8 text-lg font-medium transition-colors duration-200 
              ${activeTab === 'order' 
                ? 'border-b-4 border-indigo-600 text-indigo-700' 
                : 'text-gray-600 hover:text-indigo-700 hover:border-b-4 hover:border-indigo-200'
              } rounded-t-lg focus:outline-none`}
          >
            Fazer Pedido
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-6 sm:px-8 text-lg font-medium transition-colors duration-200 
              ${activeTab === 'products' 
                ? 'border-b-4 border-indigo-600 text-indigo-700' 
                : 'text-gray-600 hover:text-indigo-700 hover:border-b-4 hover:border-indigo-200'
              } rounded-t-lg focus:outline-none`}
          >
            Cadastro de Produtos
          </button>
        </div>

        {/* Conditional Tab Rendering */}
        {activeTab === 'order' ? (
          <OrderManager products={products} currentOrder={currentOrder} setCurrentOrder={setCurrentOrder} />
        ) : (
          <ProductForm products={products} setProducts={setProducts} />
        )}
      </div>
    </div>
  );
}

// Product Form Component
function ProductForm({ products, setProducts }: ProductFormProps) {
  const [productName, setProductName] = useState<string>('');
  const [productPrice, setProductPrice] = useState<string>('');
  const [message, setMessage] = useState<{ text: string; type: string }>({ text: '', type: '' }); // For success/error messages

  // Handles adding a new product
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate inputs
    if (!productName.trim() || isNaN(parseFloat(productPrice)) || parseFloat(productPrice) <= 0) {
      setMessage({ text: 'Por favor, preencha o nome e um preço válido para o produto.', type: 'error' });
      return;
    }

    const newProduct: Product = {
      id: Date.now(), // Unique ID for the product
      name: productName.trim(),
      price: parseFloat(productPrice),
    };

    setProducts([...products, newProduct]); // Add new product to the list
    setProductName(''); // Clear form fields
    setProductPrice('');
    setMessage({ text: 'Produto adicionado com sucesso!', type: 'success' }); // Show success message
    setTimeout(() => setMessage({ text: '', type: '' }), 3000); // Clear message after 3 seconds
  };

  // Handles deleting a product
  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id)); // Remove product by ID
    setMessage({ text: 'Produto removido com sucesso!', type: 'success' }); // Show success message
    setTimeout(() => setMessage({ text: '', type: '' }), 3000); // Clear message after 3 seconds
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-700 text-center">Cadastrar Novo Produto</h2>

      {/* Message Display */}
      {message.text && (
        <div className={`p-3 rounded-lg text-center font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Product Registration Form */}
      <form onSubmit={handleAddProduct} className="bg-gray-50 p-6 rounded-lg shadow-inner">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
            <input
              type="text"
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Ex: Pastel de Carne"
              required
            />
          </div>
          <div>
            <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
            <input
              type="number"
              id="productPrice"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              step="0.01"
              min="0.01"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Ex: 8.50"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Adicionar Produto
        </button>
      </form>

      {/* Product List */}
      <h3 className="text-xl font-semibold text-gray-700 mt-8 text-center">Produtos Cadastrados</h3>
      {products.length === 0 ? (
        <p className="text-center text-gray-500 italic">Nenhum produto cadastrado ainda.</p>
      ) : (
        <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg shadow-sm">
          {products.map((product) => (
            <li key={product.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200">
              <div>
                <p className="text-lg font-medium text-gray-800">{product.name}</p>
                <p className="text-gray-600">R$ {product.price.toFixed(2).replace('.', ',')}</p>
              </div>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-4 rounded-lg shadow-sm transition duration-300 ease-in-out transform hover:scale-105 text-sm"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Order Manager Component
function OrderManager({ products, currentOrder, setCurrentOrder }: OrderManagerProps) {
  // Function to add a product to the order or update its quantity
  const addToOrder = (productToAdd: Product) => {
    const existingItemIndex = currentOrder.findIndex(item => item.id === productToAdd.id);

    if (existingItemIndex > -1) {
      // If product exists, update quantity
      const updatedOrder = [...currentOrder];
      updatedOrder[existingItemIndex].quantity += 1;
      setCurrentOrder(updatedOrder);
    } else {
      // If product is new, add it with quantity 1
      setCurrentOrder([...currentOrder, { ...productToAdd, quantity: 1 }]);
    }
  };

  // Function to update the quantity of an item in the order
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromOrder(id); // If quantity is 0 or less, remove the item
      return;
    }
    setCurrentOrder(
      currentOrder.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Function to remove a product from the order
  const removeFromOrder = (id: number) => {
    setCurrentOrder(currentOrder.filter(item => item.id !== id));
  };

  // Function to clear the entire order
  const clearOrder = () => {
    setCurrentOrder([]);
  };

  // Calculate total price of the order
  const totalOrderPrice = currentOrder.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Available Products Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Produtos Disponíveis</h2>
        {products.length === 0 ? (
          <p className="text-center text-gray-500 italic">
            Nenhum produto cadastrado. Vá para a aba "Cadastro de Produtos" para adicioná-los.
          </p>
        ) : (
          <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg shadow-sm">
            {products.map((product) => (
              <li key={product.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200">
                <div>
                  <p className="text-lg font-medium text-gray-800">{product.name}</p>
                  <p className="text-gray-600">R$ {product.price.toFixed(2).replace('.', ',')}</p>
                </div>
                <button
                  onClick={() => addToOrder(product)}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-4 rounded-lg shadow-sm transition duration-300 ease-in-out transform hover:scale-105 text-sm"
                >
                  Adicionar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Current Order Section */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Seu Pedido</h2>

        {currentOrder.length === 0 ? (
          <p className="text-center text-gray-500 italic">O pedido está vazio. Adicione itens da lista de produtos.</p>
        ) : (
          <ul className="divide-y divide-gray-200 mb-6">
            {currentOrder.map((item) => (
              <li key={item.id} className="py-4 flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-lg font-medium text-gray-800">{item.name}</p>
                  <p className="text-gray-600">
                    R$ {item.price.toFixed(2).replace('.', ',')} x {item.quantity} ={' '}
                    <span className="font-semibold">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                  </p>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold w-9 h-9 rounded-full flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105 text-xl"
                  >
                    -
                  </button>
                  <span className="font-bold text-lg text-gray-800">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold w-9 h-9 rounded-full flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105 text-xl"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromOrder(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-3 rounded-lg text-xs transition duration-300 ease-in-out transform hover:scale-105 ml-2 sm:ml-3"
                  >
                    Remover
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Total Price and Clear Order Button */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
          <p className="text-xl sm:text-2xl font-bold text-gray-800">
            Total: <span className="text-indigo-600">R$ {totalOrderPrice.toFixed(2).replace('.', ',')}</span>
          </p>
          <button
            onClick={clearOrder}
            disabled={currentOrder.length === 0}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Limpar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
