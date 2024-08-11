import React, { Fragment, useEffect, useState } from "react";
import "./NewProduct.css";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "./SideBar";
import MetaData from "../layouts/MetaData";
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import StorageIcon from '@mui/icons-material/Storage';
// import {
//   FormHelperText,
//   Grid,
//   Input,
//   InputLabel,
//   TextField,
// } from "@mui/material";
import toast from "react-hot-toast";
import { clearErrors, getProductDetails, updateProduct } from "../../actions/productActions";
import { useNavigate, useParams } from "react-router-dom";
import {UPDATE_PRODUCT_RESET} from "../../constants/productConstants";
import { Button } from "@mui/material";

const UpdateProduct = () => {
    const {id} = useParams();
  const dispatch = useDispatch();
  const { error:updateError, isUpdated,loading } = useSelector((state) => state.deleteProduct);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [oldImages,setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const navigate = useNavigate();

  const {error,product} = useSelector(state=>state.productDetails)

  const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Electronics",
    "Camera",
    "SmartPhones",
    "Cars",
    "Shoes",
    "Watch",
    "women",
    "men",
  ];

  useEffect(()=>{
    if(product && product._id!== id){
        dispatch(getProductDetails(id));
    }
    else{
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setCategory(product.category);
        setStock(product.stock);
        setOldImages(product.images);
    }
    if(updateError){
        toast.error(updateError);
        dispatch(clearErrors());
    }
    if(error){
        toast.error(error);
        dispatch(clearErrors());
    }
    if(isUpdated){
        toast.success("Product updated Successfully");
        navigate("/admin/products");
        dispatch({type:UPDATE_PRODUCT_RESET})
    }
  },[dispatch,updateError,updateError,error,product,id,navigate])

  const updateProductSubmitHandler=(e)=>{
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name",name);
    myForm.set("price",price);
    myForm.set("description",description);
    myForm.set("stock",stock);
    myForm.set("category",category)

    images.forEach((image)=>(
        myForm.append("images",image)
    ))

    dispatch(updateProduct({id,productData:myForm}));
  }

  const updateProductImagesChange=(e)=>{
    const files = Array.from(e.target.files);
    setImages([]);
    setImagesPreview([]);
    setOldImages([]);

    files.forEach((file)=>{
        const reader = new FileReader();

        reader.onload=()=>{
            if(reader.readyState===2){
                setImages((old)=>[...old,reader.result]);
                setImagesPreview((old)=>[...old,reader.result]);
            }
        }
        reader.readAsDataURL(file);
    })
  }
  return (
    <Fragment>
    <MetaData title="Update Product" />
    <div className="dashboard">
      <SideBar />
      <div className="newProductContainer">
        <form
          className="createProductForm"
          encType="multipart/form-data"
          onSubmit={updateProductSubmitHandler}
        >
          <h1>Update Product</h1>
            <div>
                <SpellcheckIcon/>
                <input
                type="text"
                placeholder="Product Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <AttachMoneyIcon />
              <input
                type="number"
                placeholder="Price"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
                <DescriptionIcon/>
                <textarea placeholder="Product Description"
                value={description}
                cols={30}
                rows={1}
                onChange={(e)=>{setDescription(e.target.value)}}></textarea>
            </div>
            <div>
            <AccountTreeIcon/>
                <select value={category} onChange={(e)=>{setCategory(e.target.value)}}>
                    <option value="">
                        Choose Category
                    </option>
                   { categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                   ))}
                </select>
            </div>
            <div>
            <StorageIcon />
              <input
                type="number"
                placeholder="Stock"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
            <div id="createProductFormFile">
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={updateProductImagesChange}
                multiple
              />
            </div>
            <div id="createProductFormImage">
              {oldImages && oldImages.map((image, index) => (
                <img key={index} src={image.url} alt="Product Preview" />
              ))}
            </div>

             <div id="createProductFormImage">
              {imagesPreview.map((image, index) => (
                <img key={index} src={image} alt="Product Preview" />
              ))}
            </div>

            <Button
            id="createProductBtn"
            type="submit"
            disabled={loading? true: false}>
                Update
            </Button>
        </form>
      </div>
    </div>
  </Fragment>
  );
};



const convertBase64ToBuffer = (base64Image) => {
    let buffer;
  
    if (base64Image.startsWith("data")) {
      // the prefix needs to be chunked.
      let cleanBase46 = base64Image.split("base64,")[1];
      buffer = Buffer.from(cleanBase46, "base64");
    } else {
      // it is chunked
      buffer = Buffer.from(base64Image, "base64");
    }
    return buffer;
  };
  
  const convertBufferToBase64 = (buffer, withPrefix = true) => {
    let base64 = buffer.toString("base64");
  
    // need the prefix
    if (withPrefix) {
      let prefixedBase46 = "data:image/png;base64," + base64;
      return prefixedBase46;
    }
  
    return base64;
  };
  
  const removePrefixFromBase64 = (base64Image) => {
    let newBase46 = base64Image.split("base64,")[1];
    return newBase46;
  };
  
  const addPrefixToBase64 = (nonPrefixedBase64) => {
    let prefixedBase46 = "data:image/png;base64," + nonPrefixedBase64;
  
    return prefixedBase46;
  };
  
  const checkIsBase64AndNotUrl = (string) => {
    if (string.startsWith("http")) {
      // its url, return false.
      return false;
    } else {
      return true;
    }
  };
  
  module.exports.convertBase64ToBuffer = convertBase64ToBuffer;
  module.exports.convertBufferToBase64 = convertBufferToBase64;
  module.exports.removePrefixFromBase64 = removePrefixFromBase64;
  module.exports.addPrefixToBase64 = addPrefixToBase64;
  module.exports.checkIsBase64AndNotUrl = checkIsBase64AndNotUrl;
  

export default UpdateProduct;


async function uploadImageToStorage(imageBuffer, fileNameWithFullPath) {
    try {
      console.log("Line 267",fileNameWithFullPath)
      let file = bucket.file(fileNameWithFullPath);
      // push buffer to the storage.
      await file.save(imageBuffer, preDefinedOptions);
  
      // get public url
  
      let publicURL = file.publicUrl();
  
      return publicURL;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  router.post("/createSample",async(req, res, next) => {
   
    try {
      console.log("Line 18");
      const {Images , Videos , ...other} = req.body;
       const sampleInstance =new Sampling(other);    // it will create the new sample in db 
        console.log("17....",Images)

      const uploadimageArray= await uploadSampleImagesToStorage(
        sampleInstance._id,
        Images
      )
      // || uploadimageArray.length === 0.
      if(!uploadimageArray){
        return res.json({message:"Sample Images Could not uploaded to the storage"})
      }
      
      // const uploadVideoArray= await uploadSampleVideosToStorage(
      //   sampleInstance._id,
      //   Videos)
      const uploadVideoArray = await uploadVideosToCloudinary(
        Videos,
        sampleInstance._id
      );
  
      if (!uploadVideoArray) {
        return res.json({ message: "Sample Videos Could not be uploaded to the storage" });
      }
      
      sampleInstance.Images=uploadimageArray;
      sampleInstance.Videos=uploadVideoArray;

      const response= await sampleInstance.save();

      res.status(201).json({
        response,
        message: "Data uploaded successfully",
        success: true,
      });
    } catch (error) {
      next(error); // Pass errors to the error handler
    }
  });