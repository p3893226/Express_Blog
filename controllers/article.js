const db = require('../models')

const { Article, Category } = db

const articleController = {
  index: async (req, res) => {
    const articles = await Article.findAll({
      include: Category,
      order: [['createdAt', 'DESC']],
      limit: 5
    })
    res.render('index',{ 
      articles
    })
  },
  about: (req, res) => {
    res.render('article/about')
  },
  getAll: async (req, res) => {
    const articles = await Article.findAll({
      include: Category,
      order: [['createdAt', 'DESC']]
    })
    res.render('article/articleList', {
      articles
    })
  },
  admin: async (req, res) => {
    const articles = await Article.findAll({
      include: Category,
      order: [['createdAt', 'DESC']]
    })
    res.render('article/admin', {
      articles
    })
  },
  get: async (req, res) => {
    const article = await Article.findOne({
      where: {
        id: req.params.id
      },
      include: Category
    })
      res.render('article/read', {
        article
      })
  },
  add: async (req, res, next) => {
    try{
      const categories = await Category.findAll({
        order: [['createdAt', 'DESC']]
      })
      res.render('article/add_article', {
        categories
      })
    }catch(err){
      req.flash('errorMessage', err.toString())
      return next()
    }
  },
  handleAdd: async (req, res, next) => {
    const { categoryId, title, content } = req.body
    if (!categoryId || !title || !content) {
      req.flash('errorMessage', '錯誤：請輸入資料')
      return next()
    }
    try {
      await Article.create({
        CategoryId: categoryId,
        title,
        content
      })
      res.redirect('/')
    } catch (err) {
      req.flash('errorMessage', err.toString())
      return next()
    }
  },
  update: async (req, res, next) => {
    try {
      const article = await Article.findOne({
        where: {
          id: req.params.id
        },
        include: Category
      })
      const categories = await Category.findAll()
      res.render('article/update_article', {
        article,
        categories
      })
    } catch (err) {
      req.flash('errorMessage', err.toString())
      return next()
    }
  },
  handleUpdate: async (req, res, next) => {
    const { categoryId, title, content } = req.body
    if (!categoryId || !title || !content) {
      req.flash('errorMessage', '錯誤：請輸入資料')
      return next()
    }
    try {
      const article = await Article.findOne({
        where: {
          id: req.params.id
        }
      })
      await article.update({
        CategoryId: categoryId,
        title,
        content
      })
      res.redirect(`/read/${req.params.id}`)
    } catch (err) {
      req.flash('errorMessage', err.toString())
      return next()
    }
  },
  handleDelete: async (req, res, next) => {
    try {
      const article = await Article.findOne({
        where: {
          id: req.params.id
        }
      })
      await article.destroy()
        res.redirect('/')
    } catch (err){
      req.flash('errorMessage', err.toString())
      return next()
    }
  }
}

module.exports = articleController
