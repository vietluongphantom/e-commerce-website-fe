import config from '@/configs/appBase';
import httpAuth from '@/infrastructures/apiHttpAuth';


export default {
  jwtToken() {
    console.log(httpAuth);
    return httpAuth.get(config.baseApiUrl + '/jwt');
  },
  // USER
  getAllUserRecommend() {
    return httpAuth.get(config.baseApiUrl + '/follow/recommend');
  },
  getAllUser() {
    return httpAuth.get(config.baseApiUrl + '/user/all');
  },
  getInfoUser() {
    return httpAuth.get(config.baseApiUrl + '/api/v1/user/profile');
  },
  updateProfileUser(newUser) {
    return httpAuth.post(config.baseApiUrl + '/api/v1/user/updateProfile', newUser);
  },
  changePw(newPw) {
    return httpAuth.post(config.baseApiUrl + '/api/v1/changePassword/', newPw);
  },

  //INFOR
  getUser(role) {
    return httpAuth.get(`${config.baseApiUrl}/api/v1/${role}/me`);
  },

  //PRODCUT USER
  getAllProduct(keyword, sort, fromPrice, toPrice, brandId, categoryIds, selectStar) {
    return httpAuth.get(
      config.baseApiUrl +
        `/api/products/user?sort=${sort}&keyword=${keyword}&fromPrice=${fromPrice}&toPrice=${toPrice}&brand-ids=${brandId}&category-ids=${categoryIds}&rate=${selectStar}`
    );
  },
  getProductById(id) {
    return httpAuth.get(`${config.baseApiUrl}/api/products/${id}`);
  },
  getQuantityByAttribute(id, ans) {
    return httpAuth.get(`${config.baseApiUrl}/api/v1/sku/values/ok/${id}?values-ids=${ans}`);
  },
  addCart(id, quantity) {
    return httpAuth.post(config.baseApiUrl + '/api/cart-items', { productItemId: id, quantity: quantity });
  },
  quantityCart() {
    return httpAuth.get(config.baseApiUrl + '/api/cart-items/quantity');
  },

  //CATEGORY
  getAllCategory(page, size, searchQuery) {
    return httpAuth.get(config.baseApiUrl + `/categories?page=${page - 1}&size=${size}&name=${searchQuery}`);
  },
  deleteCategory(id) {
    return httpAuth.delete(`${config.baseApiUrl}/categories/${id}`);
  },
  editCategory(id, name, status) {
    return httpAuth.put(`${config.baseApiUrl}/categories/${id}`, { name: name, status: status });
  },
  addCategory(name) {
    return httpAuth.post(config.baseApiUrl + '/categories', { name: name, status: true });
  },
  getCategory(id) {
    console.log(httpAuth.get(`${config.baseApiUrl}/categories/${id}`));
    return httpAuth.get(`${config.baseApiUrl}/categories/${id}`);
  },

  //SELLER INFO
  getSeller() {
    return httpAuth.get(config.baseApiUrl + '/api/v1/seller/information');
  },
  updateUserInfo(newUserInfo) {
    return httpAuth.put(config.baseApiUrl + '/api/v1/seller/information', newUserInfo);
  },
  getShop() {
    return httpAuth.get(config.baseApiUrl + '/api/v1/shop');
  },
  updateShopInfo(newShopInfo) {
    return httpAuth.put(config.baseApiUrl + '/api/v1/shop', newShopInfo);
  },
  getShopById(id) {
    return httpAuth.get(`${config.baseApiUrl}/api/v1/shop/${id}`);
  },
  getInfoShopByUserId(id) {
    return httpAuth.get(`${config.baseApiUrl}/api/v1/shop/user/${id}`);
  },
  getBasicInfo() {
    return httpAuth.get(`${config.baseApiUrl}/api/v1/seller/basicInfor`);
  },

  //WAREHOUSE
  getAllWarehouse(page, size, searchQuery) {
    return httpAuth.get(`${config.baseApiUrl}/api/v1/warehouse?page=${page - 1}&size=${size}&name=${searchQuery}`);
  },
  deleteWarehouse(id) {
    // console.log(`${config.baseApiUrl}/api/v1/warehouse/${id}`);
    return httpAuth.delete(`${config.baseApiUrl}/api/v1/warehouse/${id}`);
  },
  addWarehouse(newWarehouse) {
    return httpAuth.post(config.baseApiUrl + '/api/v1/warehouse', newWarehouse);
  },
  getDetailWarehouse(id) {
    return httpAuth.get(`${config.baseApiUrl}/api/v1/warehouse/${id}`);
  },
  updateWarehouse(id, newWarehouse) {
    return httpAuth.put(`${config.baseApiUrl}/api/v1/warehouse/${id}`, newWarehouse);
  },

  //ADMIN

  // getListSeller(page, size) {
  //   return httpAuth.get(`${config.baseApiUrl}/api/v1/user/sellers?page=${page - 1}&size=${size}`);
  // },

  getListSeller(page, size) {
    return httpAuth.get(`${config.baseApiUrl}/api/v1/user/sellers`);
  },

  getDetailSeller(id) {
    return httpAuth.get(`${config.baseApiUrl}/api/v1/admin/sellers/${id}`);
  },

  getListUser(page, size) {
    return httpAuth.get(`${config.baseApiUrl}/api/v1/user/users`);
  },
  getDetailUser(id) {
    return httpAuth.get(`${config.baseApiUrl}/api/v1/admin/users/${id}`);
  },
  addUser(newUser) {
    return httpAuth.post(config.baseApiUrl + '/api/v1/admin/users/add', newUser);
  },
  // editStatusUser(id, status) {
  //   return httpAuth.put(config.baseApiUrl + '/api/v1/users/updateUserStatus',id,  status);
  // },
  // editStatusUser(id, status) {
  // return httpAuth.put(config.baseApiUrl + '/api/v1/users/updateUserStatus', { id, status });
  // },
  //   editStatusUser(userId, status) {
  //   console.log('Received user ID:', userId);
  //    console.log('Received status:', status);
  //   return httpAuth.put(config.baseApiUrl + '/api/v1/users/updateUserStatus', { userId, status });
  // },
  editStatusUser(data) {
    return httpAuth.put(config.baseApiUrl + '/api/v1/user/updateUserStatus', data);
  },

  getInfoSellerByAdmin(id) {
    return httpAuth.get(`${config.baseApiUrl}/api/v1/seller/information/${id}`);
  },

  getInfoShopByAdmin(id) {
    return httpAuth.get(`${config.baseApiUrl}/api/v1/shop/information/${id}`);
  },

  //SUPPLY
  getAllExport(page, size, searchName, searchId) {
    return httpAuth.get(`${config.baseApiUrl}/api/v1/inventory/export?page=${page - 1}&size=${size}&skuCode=${searchId}&name=${searchName}`);
  },

  getAllImport(page, size, searchName, searchId) {
    return httpAuth.get(`${config.baseApiUrl}/api/v1/inventory/import?page=${page - 1}&size=${size}&skuCode=${searchId}&name=${searchName}`);
  },

  //BRAND
  getAllBrand(page, size, searchQuery) {
    return httpAuth.get(config.baseApiUrl + `/api/brands?page=${page - 1}&size=${size}&name=${searchQuery}`);
  },
  deleteBrand(id) {
    return httpAuth.delete(`${config.baseApiUrl}/api/brands/${id}`);
  },
  editBrand(id, name, status) {
    return httpAuth.put(`${config.baseApiUrl}/api/brands/${id}`, { name: name, status: status });
  },
  addBrand(name) {
    return httpAuth.post(config.baseApiUrl + '/api/brands', { name: name, status: true });
  },
  getListProduct(page, size, search) {
    return httpAuth.get(`${config.baseApiUrl}/api/products/seller?page=${page - 1}&size=${size}&keyword=${search}`);
  },

  //PRODUCT
  createProduct(formData) {
    return httpAuth.post(`${config.baseApiUrl}/api/products`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getListProductS(page, size, search) {
    console.log('page bao nhiêu', page, size, search);
    return httpAuth.get(`${config.baseApiUrl}/api/products/seller?page=${page - 1}&size=${size}&keyword=${search}`);
  },

  getProduct(id) {
    return httpAuth.get(`${config.baseApiUrl}/api/products/${id}`);
  },
  updateProduct(formData, id) {
    return httpAuth.put(`${config.baseApiUrl}/api/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  deleteProduct(id) {
    return httpAuth.delete(`${config.baseApiUrl}/api/products/${id}`);
  },

  //CART
  getAllCart(page) {
    return httpAuth.get(`${config.baseApiUrl}/api/cart-items?page=${page - 1}`);
  },
  getItemCart(id) {
    return httpAuth.get(`${config.baseApiUrl}/api/v1/sku/${id}`);
  },
  updateCartItem(id, quantity) {
    return httpAuth.put(config.baseApiUrl + '/api/cart-items/update', { id: id, quantity: quantity });
  },
  deleteCartItem(id) {
    return httpAuth.delete(`${config.baseApiUrl}/api/cart-items/${id}`);
  },

  //VOUCHER
  getAllVoucher(page, size, searchQuery) {
    return httpAuth.get(`${config.baseApiUrl}/api/vouchers/search/name?name=${searchQuery}&page=${page - 1}&size=${size}`);
  },
  getUserVoucher(id) {
    return httpAuth.get(`${config.baseApiUrl}/api/vouchers/getVouchers/${id}`);
  },
  addVoucher(itemId, id) {
    console.log(itemId, id);
    return httpAuth.post(config.baseApiUrl + '/api/cart-items/apply-voucher', { cartItemId: itemId, voucherId: id });
  },
  getCartPrice(itemId) {
    return httpAuth.get(`${config.baseApiUrl}/api/checkout/total-price?selectedCartItems=${itemId}`);
  },
  createVoucher(voucher) {
    return httpAuth.post(`${config.baseApiUrl}/api/vouchers/createNewVoucher`, voucher);
  },
  getVoucherById(id) {
    return httpAuth.get(`${config.baseApiUrl}/api/vouchers/getAllVouchers/${id}`);
  },
  updateVoucher(id, newVoucher) {
    return httpAuth.post(`${config.baseApiUrl}/api/vouchers/getAllVouchers/updateVoucher/${id}`, newVoucher);
  },
  deleteVoucher(id) {
    return httpAuth.delete(`${config.baseApiUrl}/api/vouchers/getAllVouchers/deleteVoucher/${id}`);
  },

  //PAYMENT
  payment(selectedCartItems) {
    return httpAuth.post(config.baseApiUrl + '/api/checkout/checkout_cart', {
      selectedCartItems: selectedCartItems,
      method: true,
      note: 'Ghi chú thanh toán'
    });
  },

  //ATTRIBUTE
  createAttributeProduct(attribute, id) {
    return httpAuth.post(`${config.baseApiUrl}/api/v1/product-attribute/${id}`, attribute);
  },

  getListAttributeProduct(id) {
    return httpAuth.get(`${config.baseApiUrl}/api/v1/product-attribute/all-product-attribute/${id}`);
  },

  deleteAttributeProduct(id) {
    return httpAuth.delete(`${config.baseApiUrl}/api/v1/product-attribute/${id}`);
  },

  //AttRIBUTE VALUES
  createAttributeValues(attributeValue) {
    return httpAuth.post(`${config.baseApiUrl}/api/attribute-values`, attributeValue);
  },

  getListAttributeValues(id) {
    return httpAuth.get(`${config.baseApiUrl}/api/attribute-values/${id}`);
  },

  //PRODUCT ITEM
  getListProductItem(id, page, size) {
    return httpAuth.get(`${config.baseApiUrl}/api/v1/sku/list-sku/${id}?page=${page - 1}&size=${size}`);
  },
  deleteProductItem(id) {
    return httpAuth.delete(`${config.baseApiUrl}/api/v1/sku/${id}`);
  },

  createProductItem(formData) {
    return httpAuth.post(`${config.baseApiUrl}/api/v1/sku`, formData);
  },
  getProductItem(id) {
    return httpAuth.get(`${config.baseApiUrl}/api/v1/sku/${id}`);
  },
  updateProductItem(formData) {
    return httpAuth.put(`${config.baseApiUrl}/api/v1/sku`, formData);
  },
  getListProductItemByProductId(id) {
    return httpAuth.get(`${config.baseApiUrl}/api/v1/sku/product/${id}`);
  },
  //Inventory
  getAllInventory(page, size, searchQuery, skuCode) {
    return httpAuth.get(`${config.baseApiUrl}/api/v1/inventory?page=${page - 1}&size=${size}&name=${searchQuery}&skuCode=${skuCode}`);
  },
  addInventory(formData) {
    return httpAuth.post(`${config.baseApiUrl}/api/v1/inventory/import`, formData);
  },
  //Orders
  getAllOrder(page, size, searchQuery, skuCode) {
    return httpAuth.get(`${config.baseApiUrl}/api/orders?page=${page - 1}&size=${size}&name=${searchQuery}&skuCode=${skuCode}`);
  },
  getAllOrderUser() {
    return httpAuth.get(`${config.baseApiUrl}/api/orders/user`);
  },
  getAllOrderAdmin() {
    return httpAuth.get(`${config.baseApiUrl}/api/orders/admin`);
  },
  getOrder(id) {
    // console.log(httpAuth.get(`${config.baseApiUrl}/api/orders/${id}`));
    return httpAuth.get(`${config.baseApiUrl}/api/orders/${id}`);
  },
  // editOrder(id, status) {
  //   return httpAuth.put(`${config.baseApiUrl}/api/orders/${id}/status`, {  status: status });
  // },
//   editOrder(id, status) {
//   return httpAuth.put(`${config.baseApiUrl}/api/orders/${id}/status`, status);
// },
  editOrder(id, status) {
    return httpAuth.put(`${config.baseApiUrl}/api/orders/${id}/status?status=${status}`);
  },
    //Image
    upLoadImage(img) {
      return httpAuth.post(`${config.baseApiUrl}/api/products/uploads`, img, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },

    //chat
    getShopList() {
      return httpAuth.get(`${config.baseApiUrl}/api/chat/list-messages`);
    },
    //chat
    // createNewMessage(content, recipientId) {
    //   return httpAuth.post(`${config.baseApiUrl}/api/chat/chat`,{content,recipientId});
    // },
    fetchAllMessage(id) {
      return httpAuth.get(`${config.baseApiUrl}/api/chat/messages/${id}`);
    },
};
