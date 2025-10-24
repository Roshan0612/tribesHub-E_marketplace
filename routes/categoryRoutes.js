const express =require("express");
const router  = express.Router();
const {createCategoryController,updateCategoryController,
       getAllCategoryController,getSingleCategoryController,
       deleteCategoryController } = require("../controllers/categoryController.js");

const { isAdmin, requireSignIn } =require("../middlewares/authmiddleware.js");



router.post("/create-category", requireSignIn, isAdmin, createCategoryController);

router.put("/update-category/:id",requireSignIn,isAdmin,updateCategoryController);

// Public: fetch categories — allow unauthenticated access so filters are visible to all users
router.get("/get-category", getAllCategoryController);

router.get("/get-single-category/:slug",requireSignIn,isAdmin,getSingleCategoryController);

router.delete("/delete-category/:id",requireSignIn,isAdmin,deleteCategoryController);

module.exports =router;