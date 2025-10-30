// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化当前云环境
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// 数据库引用
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  const { category_id } = event

  try {
    // ✅ 情况1：未传分类id —— 查询所有分类及其商品
    if (!category_id) {
      const res = await db.collection('categories')
        .aggregate()
        .lookup({
          from: 'products',       // 被关联的集合
          localField: '_id',      // 分类集合的字段
          foreignField: 'category_id', // 商品集合中对应字段（你原代码漏了这个）
          as: 'product_list'      // 输出数组字段名
        })
        .project({
          _id: 1,
          name: 1,
          product_list: 1
        })
        .end()

      return {
        code: 0,
        msg: '查询全部分类成功',
        data: res.list
      }
    }

    // ✅ 情况2：传入分类id —— 查询该分类下的商品
    const res = await db.collection('products')
      .where({
        category_id: category_id
      })
      .get()

    return {
      code: 0,
      msg: '查询分类商品成功',
      data: res.data
    }

  } catch (err) {
    console.error('查询失败:', err)
    return {
      code: -1,
      msg: '查询失败',
      error: err
    }
  }
}
