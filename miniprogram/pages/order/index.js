Page({
  data: {
    fileUrl: 'cloud://cloud1-4gm1714uc326e5bf.636c-cloud1-4gm1714uc326e5bf-1384293786/mxbc-images/', // 图片路径前缀
    categories: [],      // 分类数据
    productList: [],     // 当前分类下商品数据
    activeCategoryId: '',// 当前选中分类id
  },

  onLoad() {
    this.loadCategoriesAndProducts()
  },

  // ① 加载分类与商品
  loadCategoriesAndProducts() {
    wx.cloud.callFunction({
      name: 'getProductLIst',
      data: {}, // 不传category_id -> 返回所有分类及商品聚合
      success: res => {
        console.log('云函数返回:', res)
        if (res.result.code === 0) {
          const categories = res.result.data
          const firstId = categories.length > 0 ? categories[0]._id : ''
          const firstProducts = categories.length > 0 ? categories[0].product_list : []
          this.setData({
            categories,
            activeCategoryId: firstId,
            productList: firstProducts
          })
        } else {
          wx.showToast({ title: '加载分类失败', icon: 'none' })
        }
      },
      fail: err => {
        console.error('加载分类失败：', err)
        wx.showToast({ title: '云函数异常', icon: 'error' })
      }
    })
  },

  // ② 点击左侧分类
  onCategoryTap(e) {
    const categoryId = e.currentTarget.dataset.id
    this.setData({ activeCategoryId: categoryId })

    // 再次调用云函数查该分类商品
    wx.cloud.callFunction({
      name: 'getProductLIst',
      data: { category_id: categoryId },
      success: res => {
        if (res.result.code === 0) {
          this.setData({
            productList: res.result.data
          })
        }
      },
      fail: err => {
        console.error('加载商品失败：', err)
      }
    })
  },

  // ③ 加入购物车事件（示例）
  onAddToCart(e) {
    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    })
  }
})
