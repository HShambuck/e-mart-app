import api from '../axios'
import ENDPOINTS from '../endpoints'

const productService = {
  getProducts: async (params = {}) => {
    const res = await api.get(ENDPOINTS.PRODUCTS.BASE, { params })
    return res.data
  },
  getProduct: async (id) => {
    const res = await api.get(ENDPOINTS.PRODUCTS.BY_ID(id))
    return res.data
  },
  getMyProducts: async (params = {}) => {
    const res = await api.get(ENDPOINTS.PRODUCTS.MY, { params })
    return res.data
  },
  createProduct: async (data) => {
    const res = await api.post(ENDPOINTS.PRODUCTS.BASE, data)
    return res.data
  },
  updateProduct: async (id, data) => {
    const res = await api.put(ENDPOINTS.PRODUCTS.BY_ID(id), data)
    return res.data
  },
  deleteProduct: async (id) => {
    const res = await api.delete(ENDPOINTS.PRODUCTS.BY_ID(id))
    return res.data
  },
  uploadImages: async (id, files) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('images', file))
    const res = await api.post(ENDPOINTS.PRODUCTS.IMAGES(id), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },
}

export default productService