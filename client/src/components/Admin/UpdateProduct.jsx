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
import toast from "react-hot-toast";
import { clearErrors, getProductDetails, updateProduct } from "../../actions/productActions";
import { useNavigate, useParams } from "react-router-dom";
import {UPDATE_PRODUCT_RESET} from "../../constants/productConstants";
import { Button } from "@mui/material";
import { AddPhotoAlternate, VideoLibrary } from "@mui/icons-material";

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
  const [videos,setVideos] = useState([]);
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
  },[dispatch,isUpdated,updateError,error,product,id,navigate])

  const updateProductSubmitHandler=(e)=>{
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name",name);
    myForm.set("price",price);
    myForm.set("description",description);
    myForm.set("stock",stock);
    myForm.set("category",category)

    images.forEach((image)=> myForm.append("images",image))

    videos.forEach((video)=> myForm.append("videos",video));
    
    // for (const [key, value] of myForm.entries()) {
    //   console.log(`${key}:`, value);
    // }

    dispatch(updateProduct({id,productData:myForm}));
  }

  useEffect(()=>{
    if(isUpdated){
      toast.success("Product updated Successfully");
      navigate("/admin/products");
      dispatch({type:UPDATE_PRODUCT_RESET})
  }
  },[isUpdated])

  // const updateProductImagesChange=(e)=>{
  //   const files = Array.from(e.target.files);
  //   setImages([]);
  //   setImagesPreview([]);
  //   setOldImages([]);

  //   files.forEach((file)=>{
  //       const reader = new FileReader();

  //       reader.onload=()=>{
  //           if(reader.readyState===2){
  //               setImages((old)=>[...old,reader.result]);
  //               setImagesPreview((old)=>[...old,reader.result]);
  //           }
  //       }
  //       reader.readAsDataURL(file);
  //   })
  // }

  const updateProductImagesChange =(e)=>{
    const files = Array.from(e.target.files);
    setOldImages([]);
    setImages(files);
  }

  const updateProductVideoChange = (e)=>{
    const files = Array.from(e.target.files);
    setVideos(files);
  }

  return (
    <Fragment>
    <MetaData title="Update Product" />
    <div className="flex mt-16 sm:mt-20 h-[125vh] bg-[#DDDDDD]">
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
            <div className="flex gap-4 my-4">
              <Button
                variant="outlined"
                component="label"
                startIcon={<AddPhotoAlternate/>}
                // className="flex-1"
                sx={{
                  fontSize: {
                    xs: "0.65rem", // Smaller text on mobile
                    sm: "0.875rem", 
                  },
                  flex:"1",
                  padding: {
                    xs: "6px 8px", // Smaller padding on mobile
                    sm: "12px 16px", 
                  },
                }}
              >
                Choose Images
              <input
                type="file"
                name="avatar"
                hidden
                accept="image/*"
                onChange={updateProductImagesChange}
                multiple
              />
              </Button>
              <Button
                variant="outlined"
                color="success"
                component="label"
                startIcon={<VideoLibrary/>}
                sx={{
                  fontSize: {
                    xs: "0.65rem", // Smaller text on mobile
                    sm: "0.875rem", 
                  },
                  flex:"1",
                  padding: {
                    xs: "6px 8px", // Smaller padding on mobile
                    sm: "12px 16px", 
                  },
                }}
              >
                Choose Videos
              <input
                type="file"
                name="videos"
                accept="video/*"
                hidden
                onChange={updateProductVideoChange}
                multiple
              />
              </Button>
            </div>
            <div className="flex gap-2 overflow-x-auto mt-2 md:mt-4 overflow-y-hidden">
              {oldImages && oldImages.map((image, index) => (
                <img key={index} src={image.url} alt="Product Preview" className="md:w-16 md:h-16 w-10 h-10  object-cover" />
              ))}
            </div>

             <div className="flex gap-2 overflow-x-auto md:mt-4 overflow-y-hidden">
              {images?.map((image, index) => (
                <img key={index} src={URL.createObjectURL(image)} alt="Product Preview" className="md:w-16 md:h-16 w-10 h-10  object-cover"/>
              ))}
            </div>

              <div className="flex gap-2 overflow-x-auto mt-2 md:mt-4 mb-3 overflow-y-hidden">
              {videos?.map((video, index) => (
                <video key={index} className="md:w-16 md:h-16 w-10 h-10 object-cover">
                  <source src={URL.createObjectURL(video)} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
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

export default UpdateProduct;
