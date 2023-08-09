const { validateParameters } = require("../helpers/validar");
const path = require ("path");
const Article = require("../model/Article");
const fs = require("fs");

const test = (req, res) => {
    return res.status(200).json({
        message:"Test section for articles"
    });
}

const courses = (req, res) => {
    // Create object to save
    let article = new Article(parameters);
    console.log(article);
    return res.status(200).json([{
        course: "PHP",
        author: "Gera",
        url: "google.mx"
    },
    {
        course: "Home",
        author: "Gera VG",
        url: "google.mx"
    }]);
}

const save = (req, res) => {
    // get data
    let parameters = req.body;

    //validate data
    try {
        validateParameters(parameters); 
    }catch(error){
        return res.status(500).json({
            status: "error",
            message: "Something went wrong with your data"
        })
    }

    // Create object to save
    let article = new Article(parameters);

    //Assign values to object
    article.save()
        .then((articleSaved) => {
            return res.status(200).json({
                status: "success",
                article: articleSaved,
                message: "Successfully saved"
            })
        }).catch((error) => {
            return res.status(400).json({
                status: error,
                message: "Error trying to save article "
            })
        })    
}

const getArticles = async (req, res) => {
    try {
      let articles = await Article.find({})
                                    .sort({date: -1})
                                    .exec();
      if(req.params.num && !isNaN(req.params.num)){
        articles = await Article.find({})
                                .sort({date: -1})
                                .limit(parseInt(req.params.num))
                                .exec();       
      }
  
      if (!articles || articles.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "Couldn't find articles",
        });
      }
  
      return res.status(200).send({
        status: "success",
        total: articles.length,
        articles,
      });

    } catch (error) {
      return res.status(404).json({
        status: "error",
        message: "An error occurred while fetching articles",
      });
    }
};

const getArticle = (req, res) => {
    let id = req.params.id;
  
    Article.findById(id)
      .then((article) => {
        if (!article) {
          return res.status(404).json({
            status: "error",
            message: "Article not found",
          });
        }
  
        return res.status(200).send({
          status: "success",
          article,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          status: "error",
          message: "An error occurred while fetching the article",
        });
      });
};

const deleteArticle = (req, res) => {
    let id = req.params.id;
    try {
        Article.findOneAndDelete({_id:id})
        .then((articleRemoved) => {
            if(!articleRemoved){
                return res.status(404).json({
                    status: "error",
                    message: "Error trying to find the article"
                });
            }

            return res.status(200).json({
                status: "success",
                article: articleRemoved,
                message: "Successfully deleted"
            });
        })
        
    } catch (error) {
        return res.status(500).json({
            status: error,
            message: "Error trying to delete article"
        });        
    }
};

const updateArticle = (req, res) => {
    const id = req.params.id;
    const parameters = req.body;

    try {
        validateParameters(parameters); 
    }catch(error){
        return res.status(400).json({
            status: error,
            message: "Something went wrong with your data"
        });
    }

    try {
        Article.findOneAndUpdate({_id:id}, parameters,{new:true})
        .then((article) =>{
            if(!article){
                return res.status(404).json({
                    status: "error",
                    message: "Error trying to find the article"
                });
            }
    
            return res.status(200).json({
                status: "success",
                article: article,
                message: "Successfully updated"
            });
        })
        
    } catch (error) {
        return res.status(500).json({
            status: error,
            message: "Error trying to update article"
        });        
    }
    
};

const uploadImage = (req, res) => {

    const upladedFile = req.file;
    const fileSize = parseInt(req.headers["content-length"]);
    const id = req.params.id;

    if(fileSize > 500000){
        fs.unlink(upladedFile.path, (error) =>{
            return res.status(404).json({            
                status: "error",
                message: "Image too big, try with less than 300KB",
                size: fileSize
            })
        });
    }else{
        if(upladedFile.mimetype == "image/jpg" ||
        upladedFile.mimetype == "image/gif" ||
        upladedFile.mimetype == "image/png" ||
        upladedFile.mimetype == "image/jpeg"){

            try {
                Article.findOneAndUpdate({_id:id}, {image:upladedFile.filename},{new:true})
                .then((article) =>{
                    if(!article){
                        return res.status(404).json({
                            status: "error",
                            message: "Error trying to find the article"
                        });
                    }
            
                    return res.status(200).json({
                        status: "success",
                        article: article,
                        file: upladedFile
                    });
                })
                
            } catch (error) {
                return res.status(500).json({
                    status: error,
                    message: "Error trying to update article"
                });        
            }
   
        }else{
            fs.unlink(upladedFile.path, (error) =>{
                return res.status(404).json({            
                    status: "error",
                    message: "mimetype incorrect",
                    mimetype: upladedFile.mimetype
                })
            });
        }
        
    }
}    

const showImage = (req, res) => {
    let getFile = req.params.file;
    let pathFile = "./images/articles/" + getFile;

    fs.stat(pathFile, (error, image) => {
        if(image){
            return res.sendFile(path.resolve(pathFile));
        }else{
            return res.status(404).json({
                status: "error",
                message: "Image doesn't exists",
                image: image,
                file: getFile,
                path: pathFile
            })
        }
    })
}

const browser = async (req, res) => {
    let query = req.params.query;

    let findArticle = await Article.find({"$or":[
        {"title": {"$regex": query, "$options": "i"}},
        {"content": {"$regex": query, "$options": "i"}}
    ]})
    .sort({date: -1})
    .exec()
    
    try {
        if(!findArticle || findArticle.length <= 0){
            return res.status(404).json({
                status: "error",
                message: "Articles related not founded"
            });
        }

        return res.status(200).json({
            status: "success",
            articles: findArticle
        })
        
    } catch (error) {
        return res.status(404).json({
            status: "error",
            message: "Oops! something was wrong"
        });
    }

}

module.exports = {
    test,
    courses,
    save,
    getArticles,
    getArticle,
    deleteArticle,
    updateArticle,
    uploadImage,
    showImage,
    browser
}