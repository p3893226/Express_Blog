const db = require('../models')

const { Category } = db

const categoryController = {
  getAll: async (req, res) => {
    const categories = await Category.findAll({
      order: [['createdAt', 'DESC']]
    })
    res.render('category/categoryList', {
      categories
    })
  },
  add: async (req, res, next) => {
    const { categoryName } = req.body
    if (!categoryName) {
      req.flash('errorMessage', '錯誤：請輸入資料')
      return next()
    }
    try {
      await Category.create({
        categoryName
      })
      res.redirect('/categoryList')
    } catch (err) {
      req.flash('errorMessage', err.toString())
      return next()
    }
  },
  update: async (req, res, next) => {
    try {
      const category = await Category.findOne({
        where: {
          id: req.params.id
        }
      })
      res.render('category/update_category', {
        category
      })
    } catch (err) {
      req.flash('errorMessage', err.toString())
      return next()
    }
  },
  handleUpdate: async (req, res, next) => {
    const { categoryName } = req.body
    if (!categoryName) {
      req.flash('errorMessage', '錯誤：請輸入資料')
      return next()
    }
    try {
      const category = await Category.findOne({
        where: {
          id: req.params.id
        }
      })
      await category.update({
          categoryName
        })
      res.redirect('/categoryList')
    } catch (err) {
      req.flash('errorMessage', err.toString())
      return next()
    }
  },
  handleDelete: async (req, res, next) => {
    try {
      const category = await Category.findOne({
        where: {
          id: req.params.id
        }
      })
      await category.destroy()
      res.redirect('/categoryList')
    } catch (err) {
      req.flash('errorMessage', err.toString())
      return next()
    } 
  }
}

module.exports = categoryController
