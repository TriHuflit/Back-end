const News = require("../models/News");
const DetailNews = require("../models/DetailNews");
const cloudinary = require("../ultis/cloudinary");
class NewsController {
  //[GET] api/news
  async index(req, res) {
    const news = await News.find({});
    return res.status(200).json({ success: true, news });
  }
  //[GET] api/news/:slug
  async detail(req, res) {
    const news = await News.findOne({ slug: req.params.slug });
    if (!news) {
      return res
        .status(404)
        .json({ success: false, message: "News Not Found" });
    }
    const detailNews = await DetailNews.find({ idNews: news._id });
    return res.status(200).json({ success: true, detailNews });
  }
  //[POST] api/news/store
  async store(req, res) {
    const { author, title, content } = req.body;
    const image = await cloudinary.uploader.upload(req.body.image);
    const news = await new News({
      author,
      title,
      content,
      image: {
        url: image.secure_url,
        cloud_id: image.public_id,
      },
    });
    news.save();
    if (news) {
      return res
        .status(200)
        .json({ success: true, message: "Add News Successfully !!!" });
    }
    return res.status(400).json({ success: false, message: "Add News Failed" });
  }
  //[POST] api/news/delete/:slug
  async delete(req, res) {
    const news = await News.findOne({ slug: req.params.slug });
    if (!news) {
      return res
        .status(404)
        .json({ success: false, message: "News Not Found" });
    }
    try {
      await cloudinary.uploader.destroy(news.image.cloud_id);
      await News.deleteOne({ _id: news._id });
      return res
        .status(200)
        .json({ success: true, message: "Delete News Successfully !!!" });
    } catch (err) {
      return res.status(500).json(err);
    }
  }
  //[GET] api/news/edit/:slug
  async edit(req, res) {
    const news = await News.findOne({ slug: req.params.slug });
    if (!news) {
      return res
        .status(404)
        .json({ success: false, message: "News Not Found" });
    }
    return res.status(200).json({ success: true, news });
  }
  //[POST] api/news/update/:slug
  async update(req, res) {
    const { author, title, content } = req.body;

    const news = await News.findOne({ slug: req.params.slug });
    if (!news) {
      return res
        .status(404)
        .json({ success: false, message: "News Not Found" });
    }
    try {
      await cloudinary.uploader.destroy(news.image.cloud_id);
      const image = await cloudinary.uploader.upload(req.body.image);
      let updateNews = {
        author,
        title,
        content,
        image: {
          url: image.secure_url,
          cloud_id: image.public_id,
        },
      };
      const Newsupdate = await News.findByIdAndUpdate(
        { _id: news._id },
        updateNews,
        { new: true }
      );
      if (!Newsupdate) {
        return res
          .status(400)
          .json({ success: false, message: "Update News Failed" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Update News Successfully" });
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}
module.exports = new NewsController();
