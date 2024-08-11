import React, { useState, useRef, useEffect } from "react";

import {
  Row,
  Col,
  CardBody,
  Card,
  Input,
  Form,
  FormFeedback,
  Label,
  Button,
  Badge,
  InputGroup,
  InputGroupText,
  DropdownToggle,
  ButtonDropdown,
  DropdownMenu,
  DropdownItem,Collapse
} from "reactstrap";
import slugify from "slugify";
import Switch from "react-switch";

const shadow = {
  width: "100%",
  padding: "10px",
  boxShadow: "2px 2px 5px 0px rgba(255,255,255,0.8)",
  transition: "box-shadow 0.3s ease",
  borderRadius: "5px"
};

import * as Yup from "yup";
import { useFormik } from "formik";
import _ from "lodash";
import ShortUniqueId from "short-unique-id";
import { createProduct, updateProduct } from "api/backend/products";
import { useHistory } from "react-router-dom";
import toastr from "toastr";
import Select from "react-select";

import { getCategoriesPagination } from "api/backend/categories";

const uid = new ShortUniqueId({ length: 12, dictionary: "number" });

function EditProductForm({ product }) {
  const hiddenInputFileUploaderRef = useRef();
  const history = useHistory();

  // categories state for the selection input.
  const [mappedCategories, setMappedCategories] = useState([]);

  const [tagsInputCurrent, setTagsInputCurrent] = useState("");

  const [imageLocationInput, setImageLocationInput] = useState("front");

  // attributes
  const [colorsInputCurrent, setColorsInputCurrent] = useState("");
  const [sizesInputCurrent, setSizesInputCurrent] = useState("");
  const [decorationsInputCurrent, setDecorationsInputCurrent] = useState("");
  const [tieredPricingCollapse, setTieredPricingCollapse] = useState(false)
  const [tieredpricingCat,setTieredpricingCat]=useState([])


  // additionalCosts
  const [additionalCostsInputCurrent, setAdditionalCostsInputCurrent] =
    useState(null);

  const [locationMenuOpen, setLocationMenuOpen] = useState(false);
  const [decorationMenuOpen, setDecorationMenuOpen] = useState(false);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      _id: product?._id,
      name: product?.name || "",
      slug: product?.slug || "",
      seoTitle: product?.seoTitle || "",
      seoDescription: product?.seoDescription || "",
      description: product?.description || "",
      details: product?.details || "",
      sku: product?.sku || "",
      categories: product?.categories || [],
      mappedCategories: [], // these are mapped categories but the selected by input. Not all of them.
      tags: product?.tags || ["women", "men"],
      purchasablefrontheApp: product?.purchasablefrontheApp || true,
      isDesignable: product?.isDesignable || false,
      published: product?.published || false,

      // images, priniting areas
      images: product?.images || [],
      deletedImages: [], // will push any deleted images here.
      printingAreas: product?.printingAreas || [],

      // attributes
      colors: product?.colors || ["#FFFFFF", "#2E2E2E"],
      sizes: product?.sizes || ["XS", "S", "M", "L", "XL", "2XL"],
      decorations: product?.decorations || ["printing", "embroidery"],

      // pricing
      unitPrice: product?.unitPrice || 20,
      discount: product?.discount || { amount: 0, isPercent: true },
      additionalCosts: product?.additionalCosts || [],
      minimumQuantity: product?.minimumQuantity || 1,
      inventory: product?.inventory || 10,
      tieredPricing:product.tieredPricing || []
    },

    validationSchema: Yup.object({
      name: Yup.string().min(2).max(255).required("Product name is required."),
      slug: Yup.string().min(2).max(255).required("Product slug is required."),
      seoTitle: Yup.string().min(2).max(255).required("SEO Title is required."),
      seoDescription: Yup.string()
        .min(2)
        .max(255)
        .required("SEO Description is required."),

      description: Yup.string()
        .min(2)
        .max(10000)
        .required("Product Description is required."),

      sku: Yup.string()
        .min(12, "SKU must be 12 numeric characters")
        .max(12, "SKU must be 12 numeric characters")
        .required("SKU is required."),

      images: Yup.array().min(1).required(),
      printingAreas: Yup.array().min(1).required(),
      colors: Yup.array().min(1).required(),
      sizes: Yup.array().min(1).required(),
      decorations: Yup.array().min(1).required(),

      // pricing
      unitPrice: Yup.number()
        .min(1, "Unit Price must be grater that 1.")
        .required("Unit Price is required."),
      minimumQuantity: Yup.number()
        .min(1, "Minimum Quantity must be grater that 1.")
        .required("Minimum Quantity is required."),
      inventory: Yup.number()
        .min(1, "Inventory must be grater that 1.")
        .required("Inventory is required."),
    }),
    tieredPricing:Yup.array().min(1).required(),

    onSubmit: async values => {
      await handleProductUpdate(values);
    },
  });

  const handleOnNameBlur = e => {
    // assign slug on name blur.

    let value = e.target.value;

    let slugifiedValue = slugify(value, { lower: true });

    validation.setFieldValue("slug", slugifiedValue);

    validation.handleBlur(e);
  };

  const handleOnSlugBlur = e => {
    let value = e.target.value;

    let slugifiedValue = slugify(value, { lower: true });

    validation.setFieldValue("slug", slugifiedValue);

    validation.handleBlur(e);
  };

  const handleOnImageLocationBlur = e => {
    let value = e.target.value;

    let slugifiedValue = slugify(value, { lower: true });

    setImageLocationInput(slugifiedValue);
  };

  const handleAddNewTag = () => {
    if (!tagsInputCurrent) return;

    let trimmed = tagsInputCurrent.trim();

    let currentTags = validation.values.tags;
    let newTags = [...currentTags, trimmed];

    // set it
    validation.setFieldValue("tags", newTags);

    // reset input state
    setTagsInputCurrent("");
  };

  const handleRemoveTag = tag => {
    let oldTags = validation.values.tags;

    let filtered = _.filter(oldTags, function (t) {
      return t !== tag;
    });

    validation.setFieldValue("tags", filtered);
  };

  const generateSKU = () => {
    validation.setFieldValue("sku", uid());
  };

  // upload an image
  const clickHiddenInput = () => {
    hiddenInputFileUploaderRef.current.click();
  };

  const handleCustomImageUpload = e => {
    if (e.target.files && e.target.files[0]) {
      let imgObj = e.target.files[0];
      // initiate reader and convert blob to base64.
      let reader = new FileReader();
      reader.readAsDataURL(imgObj);

      reader.onload = e => {
        let imageUrl = e.target?.result;

        let oldImagesInState = validation.values.images;

        // set the image in state with key.
        let imgObjForState = {
          location: imageLocationInput,
          src: imageUrl,
        };

        let newImagesArray = [...oldImagesInState, imgObjForState];

        // set initial printing area with key.

        let oldPrintingAreas = validation.values.printingAreas;

        let printingAreaObj = {
          location: imageLocationInput,
          config: {
            width: "30%",
            height: "30%",
            top: "30%",
            left: "30%",
          },
        };

        let newPrintingAreas = [...oldPrintingAreas, printingAreaObj];
        validation.setFieldValue("printingAreas", newPrintingAreas);

        // this must be after the printingAreas set, since the map function will
        // loop over images, so If I set images before pringing areas,
        // so the printing areas doesn't break.
        validation.setFieldValue("images", newImagesArray);

        // reset location state.
        setImageLocationInput("");
      };
    }
  };
  const handleAddTier = () => {
    // Add a new tier with default values
    //console.log("...tieredpricingCat", [...tieredpricingCat]);
    setTieredpricingCat([
      ...tieredpricingCat,
      { min: 0, max: 0, discount: 0, isPercent: true, price: 0, finalprice: 0 },
    ]);
    validation.setFieldValue("tieredPricing", tieredpricingCat);
  };

  let extractPrintingAreaByLocation = location => {
    let target = _.find(validation.values.printingAreas, function (o) {
      return o.location === location;
    });

    return target?.config;
  };

  const handlePrintingAreaPropertyChange = (location, key, value) => {
    let oldPrintingAreas = validation.values.printingAreas;

    let targetPrintingAreaIndex = _.findIndex(oldPrintingAreas, function (o) {
      return o.location == location;
    });

    let targetPrintingArea = oldPrintingAreas[targetPrintingAreaIndex];

    targetPrintingArea.config[key] = value;

    // add the target
    validation.setFieldValue("printingAreas", oldPrintingAreas);
  };

  const handleRemoveImageAndPrintingArea = location => {
    // on removing an image that already is saved in the db
    // when product was created. I need to push its object
    // to deletedImages. So, I will check if the image starts with
    // http, means this image is already saved in the db.

    let oldPrintingAreas = validation.values.printingAreas;
    let oldImages = validation.values.images;

    // check if original image and push it to deleted.
    let imgObjToDelete = _.find(oldImages, function (o) {
      return o.location === location;
    });

    let isOriginalImage = imgObjToDelete.src.startsWith("http");

    // push to detletd if its original.
    if (isOriginalImage) {
      let oldDeletedImages = validation.values.deletedImages;

      validation.setFieldValue("deletedImages", [
        ...oldDeletedImages,
        imgObjToDelete,
      ]);
    }

    let filteredPrintingAreas = _.filter(oldPrintingAreas, function (o) {
      return o.location !== location;
    });

    let filteredImages = _.filter(oldImages, function (o) {
      return o.location !== location;
    });

    validation.setFieldValue("images", filteredImages);
    validation.setFieldValue("printingAreas", filteredPrintingAreas);
  };

  // attributes
  const handleAddNewColor = () => {
    if (!colorsInputCurrent) return;

    let trimmed = colorsInputCurrent.trim();

    let currentColors = validation.values.colors;
    let newColors = [...currentColors, trimmed];

    // set it
    validation.setFieldValue("colors", newColors);

    // reset input state
    setColorsInputCurrent("");
  };

  const handleRemoveColor = color => {
    let oldColors = validation.values.colors;

    let filtered = _.filter(oldColors, function (c) {
      return c !== color;
    });

    validation.setFieldValue("colors", filtered);
  };

  const handleAddNewSize = () => {
    if (!sizesInputCurrent) return;

    let trimmed = sizesInputCurrent.trim();

    let currentSizes = validation.values.sizes;
    let newSizes = [...currentSizes, trimmed];

    // set it
    validation.setFieldValue("sizes", newSizes);

    // reset input state
    setSizesInputCurrent("");
  };

  const handleRemoveSize = size => {
    let oldColors = validation.values.sizes;

    let filtered = _.filter(oldColors, function (s) {
      return s !== size;
    });

    validation.setFieldValue("sizes", filtered);
  };

  const handleAddNewDecoration = () => {
    if (!decorationsInputCurrent) return;

    let trimmed = decorationsInputCurrent.trim();

    let currentDecorations = validation.values.decorations;
    let newDecorations = [...currentDecorations, trimmed];

    // set it
    validation.setFieldValue("decorations", newDecorations);

    // reset input state
    setDecorationsInputCurrent("");
  };

  const handleRemoveDecoration = decoration => {
    let oldDecorations = validation.values.decorations;

    let filtered = _.filter(oldDecorations, function (d) {
      return d !== decoration;
    });

    validation.setFieldValue("decorations", filtered);
  };

  // additional Costs input listern to hide and show,
  // depending on the decorations and printing areas.
  useEffect(() => {
    if (
      !!validation.values.printingAreas.length &&
      !!validation.values.decorations.length
    ) {
      setAdditionalCostsInputCurrent({
        location: validation.values.printingAreas[0].location,
        decoration: validation.values.decorations[0],
        cost: 0,
      });
    } else {
      setAdditionalCostsInputCurrent(null);
      // remove additionalCosts from the main form state too
      // if we don't have decorations or images
      validation.setFieldValue("additionalCosts", []);
    }
  }, [validation.values.printingAreas, validation.values.decorations]);

  const handleAdditionalCostsInputChange = (key, value) => {
    setAdditionalCostsInputCurrent(obj => ({ ...obj, [key]: value }));
  };

  const handleAddNewAdditionalCost = () => {
    if (!additionalCostsInputCurrent.cost) return;

    // check if the same combinatnion of location-decoration
    // exist and override it.

    let currentAdditionalCosts = validation.values.additionalCosts;
    let newAdditionalCosts = [];

    // try to find the same combination
    let targetObjIndex = _.findIndex(currentAdditionalCosts, function (o) {
      return (
        o.location === additionalCostsInputCurrent.location &&
        o.decoration === additionalCostsInputCurrent.decoration
      );
    });

    // if don't have dupluication
    if (targetObjIndex === -1) {
      newAdditionalCosts = [
        ...currentAdditionalCosts,
        additionalCostsInputCurrent,
      ];
    } else {
      currentAdditionalCosts[targetObjIndex].cost =
        additionalCostsInputCurrent.cost;
      newAdditionalCosts = currentAdditionalCosts;
    }

    // set it
    validation.setFieldValue("additionalCosts", newAdditionalCosts);

    // reset input state
    setAdditionalCostsInputCurrent({
      location: validation.values.printingAreas[0].location,
      decoration: validation.values.decorations[0],
      cost: 0,
    });
  };

  const handleRemoveAdditonalCost = additionalCostObj => {
    let oldAdditionalCosts = validation.values.additionalCosts;

    let filtered = _.filter(oldAdditionalCosts, function (d) {
      return d !== additionalCostObj;
    });

    validation.setFieldValue("additionalCosts", filtered);
  };

  const handleProductUpdate = async values => {
    const response = await updateProduct(values);

    if (response.status === 200) {
      // everything went fine.
      toastr.success("The product was updated successfully.");
      history.push("/product/" + response.data.slug);
    } else if (response.status === 399) {
      validation.setErrors({
        slug: "This slug already exists for another product.",
      });

      toastr.error("OOPS! The slug is taken.");
      return;
    } else {
      toastr.error(
        "An error occured while creating your product.",
        response.message
      );

      return;
    }
  };

  // here after loading, will also, determine what product categories.
  // are already selected. Then we gonna create a mapping from the mongo original
  // shape to the input shape, and set them in formik state as mapped categories.
  const loadCategoriesList = async () => {
    const response = await getCategoriesPagination(
      { name: 1 },
      null,
      false,
      null
    );

    if (response.status === 200) {
      // need to map the categories to fit the select options.
      // the select opttion obj => {label, value}

      let mapped = [];

      let initialCategoriesMapped = []; // the categoreis already selected by this product.

      response.data.map(catObj => {
        mapped.push({ label: catObj.name, value: catObj.slug, id: catObj._id });
      });

      // set all the mapped categories
      setMappedCategories(mapped);

      // 2- detect what the product categories are and map them
      // to be set in the formik sate as the selected mappedCategories.

      if (product.categories && product.categories.length) {
        // loop over original shape and compare ids
        response.data.map(dbCatObj => {
          product.categories.map(selectedCatObj => {
            if (selectedCatObj._id === dbCatObj._id) {
              // we found a selected category.
              // map and push it to the array.
              // always push the db one details, in case name change.
              initialCategoriesMapped.push({
                label: dbCatObj.name,
                value: dbCatObj.slug,
                id: dbCatObj._id,
              });
            }
          });
        });

        // loop finished. set state in formik
        validation.setFieldValue("mappedCategories", initialCategoriesMapped);
      }
    }
  };

  const handleCategoriesChange = arrayOfMappedCategories => {
    // 1- store the slected mapped categories inside formik
    // mappedCategories, so input can display the selected.

    validation.setFieldValue("mappedCategories", arrayOfMappedCategories);

    // 2- map them to mongodb way and store in the formik state as categories.
    // this way alawys will have product categories synced.
    let originalFormatCategories = [];

    arrayOfMappedCategories.map(catObj => {
      originalFormatCategories.push({
        _id: catObj.id,
        name: catObj.label,
        slug: catObj.value,
      });
    });

    validation.setFieldValue("categories", originalFormatCategories);
  };

  // main use Effect.
  useEffect(() => {
    loadCategoriesList();
  }, []);

  return (
    <Card className="w-100 rounded-2 shadow-sm">
      <CardBody>
        <h5 className="text-white me-md-3">
          Edit Product with id: {product?._id}
        </h5>

        <div className="p-2 py-4">
          <Form
            id="main"
            className="form-horizontal"
            onSubmit={e => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
          >
            <Row>
              <Col xs={12} md={6}>
                <div className="mb-3">
                  <Label className="form-label">Product Name</Label>
                  <Input
                    name="name"
                    className="form-control"
                    placeholder="Enter Product's Name"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={handleOnNameBlur}
                    value={validation.values.name || ""}
                    invalid={
                      validation.touched.name && validation.errors.name
                        ? true
                        : false
                    }
                  />
                  {validation.touched.name && validation.errors.name ? (
                    <FormFeedback type="invalid">
                      {validation.errors.name}
                    </FormFeedback>
                  ) : null}
                </div>
              </Col>

              <Col xs={12} md={6}>
                <div className="mb-3">
                  <Label className="form-label">Product Slug</Label>
                  <Input
                    name="slug"
                    className="form-control"
                    placeholder="Enter Product's Slug"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={handleOnSlugBlur}
                    value={validation.values.slug || ""}
                    invalid={
                      validation.touched.slug && validation.errors.slug
                        ? true
                        : false
                    }
                  />
                  {validation.touched.slug && validation.errors.slug ? (
                    <FormFeedback type="invalid">
                      {validation.errors.slug}
                    </FormFeedback>
                  ) : null}
                </div>
              </Col>

              <Col xs={12} md={6}>
                <div className="mb-3">
                  <Label className="form-label">SEO Title</Label>
                  <Input
                    name="seoTitle"
                    className="form-control"
                    placeholder="Enter SEO Title"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.seoTitle || ""}
                    invalid={
                      validation.touched.seoTitle && validation.errors.seoTitle
                        ? true
                        : false
                    }
                  />
                  {validation.touched.seoTitle && validation.errors.seoTitle ? (
                    <FormFeedback type="invalid">
                      {validation.errors.seoTitle}
                    </FormFeedback>
                  ) : null}
                </div>
              </Col>

              <Col xs={12} md={6}>
                <div className="mb-3">
                  <Label className="form-label">SEO Description</Label>
                  <Input
                    name="seoDescription"
                    className="form-control"
                    placeholder="Enter SEO Description"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.seoDescription || ""}
                    invalid={
                      validation.touched.seoDescription &&
                      validation.errors.seoDescription
                        ? true
                        : false
                    }
                  />
                  {validation.touched.seoDescription &&
                  validation.errors.seoDescription ? (
                    <FormFeedback type="invalid">
                      {validation.errors.seoDescription}
                    </FormFeedback>
                  ) : null}
                </div>
              </Col>

              <Col xs={12} md={6}>
                <div className="mb-3">
                  <Label className="form-label">Description</Label>
                  <Input
                    name="description"
                    className="form-control"
                    placeholder="Enter Product's Description"
                    type="textarea"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.description || ""}
                    invalid={
                      validation.touched.description &&
                      validation.errors.description
                        ? true
                        : false
                    }
                  />
                  {validation.touched.description &&
                  validation.errors.description ? (
                    <FormFeedback type="invalid">
                      {validation.errors.description}
                    </FormFeedback>
                  ) : null}
                </div>
              </Col>

              <Col xs={12} md={6}>
                <div className="mb-3">
                  <Label className="form-label">
                    Additional Details (Optional)
                  </Label>
                  <Input
                    name="details"
                    className="form-control"
                    type="textarea"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.details || ""}
                    invalid={
                      validation.touched.details && validation.errors.details
                        ? true
                        : false
                    }
                  />
                  {validation.touched.details && validation.errors.details ? (
                    <FormFeedback type="invalid">
                      {validation.errors.details}
                    </FormFeedback>
                  ) : null}
                </div>
              </Col>

              <Col xs={12} md={6}>
                <div className="mb-3 d-flex">
                  <Label className="form-label me-2">
                    Purchasable From The App
                  </Label>

                  <Switch
                    id="purchasablefrontheApp"
                    height={20}
                    handleDiameter={22}
                    onColor={"#34c38f"}
                    offColor={"#f46a6a"}
                    checked={validation.values.purchasablefrontheApp}
                    onChange={(checked, e, id) =>
                      validation.setFieldValue("purchasablefrontheApp", checked)
                    }
                  />
                </div>
              </Col>

              <Col xs={12} md={6}>
                <div className="mb-3 d-flex">
                  <Label className="form-label me-2">
                    Product
                    {validation.values.isDesignable
                      ? " Designable"
                      : " Not Designable"}
                  </Label>

                  <Switch
                    id="isDesignable"
                    height={20}
                    handleDiameter={22}
                    onColor={"#34c38f"}
                    offColor={"#f46a6a"}
                    checked={validation.values.isDesignable}
                    onChange={(checked, e, id) =>
                      validation.setFieldValue("isDesignable", checked)
                    }
                  />
                </div>
              </Col>

              <Col xs={12} md={6}>
                <div className="mb-3">
                  <Label className="form-label me-2">Tags (Optional) </Label>
                  <div className="mb-2">
                    {validation &&
                      validation.values.tags.map((tag, idx) => (
                        <Badge
                          role={"button"}
                          key={tag + idx}
                          className="mx-1 mt-1 font-size-12 badge-soft-success"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            {tag}

                            <i className="bx bx-x font-size-16"></i>
                          </div>
                        </Badge>
                      ))}
                  </div>

                  <InputGroup>
                    <Input
                      name="tags"
                      className="form-control"
                      type="text"
                      value={tagsInputCurrent}
                      onChange={e =>
                        setTagsInputCurrent(e.target.value.toLowerCase())
                      }
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          handleAddNewTag();
                        }
                      }}
                    ></Input>

                    <Button color="primary" onClick={handleAddNewTag}>
                      Add Tag
                    </Button>
                  </InputGroup>
                </div>
              </Col>

              <Col xs={12} md={6}>
                <div className="mb-3">
                  <Label className="form-label me-2">Categories</Label>

                  <Select
                    options={mappedCategories}
                    isMulti
                    onChange={handleCategoriesChange}
                    value={validation.values.mappedCategories}
                    styles={{
                      menuPortal: provided => ({ ...provided, zIndex: 9999 }),
                      menu: provided => ({ ...provided, zIndex: 9999 }),
                    }}
                    theme={theme => ({
                      ...theme,

                      colors: {
                        ...theme.colors,
                        primary25: "#00ADB5",
                        primary50: "#00ADB5",
                        primary: "#00ADB5",
                        neutral0: "#393E46",
                        neutral10: "#00ADB5",
                        neutral20: "#00ADB5",
                        neutral40: "#00ADB5",
                        neutral50: "#bfc8e2",
                        neutral60: "#00ADB5",
                        neutral70: "red",
                        neutral80: "#bfc8e2",
                        neutral80: "white",
                        neutral90: "red",
                        dangerLight: "#bfc8e2",
                        danger: "white",
                      },
                    })}
                  />
                </div>
              </Col>

              <Col xs={12} md={6}>
                <div className="mb-3">
                  <Label className="form-label me-2">SKU</Label>
                  <InputGroup>
                    <Input
                      name="sku"
                      className="form-control"
                      type="text"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.sku || ""}
                      invalid={
                        validation.touched.sku && validation.errors.sku
                          ? true
                          : false
                      }
                    />

                    <Button color="primary" onClick={generateSKU}>
                      Generate SKU
                    </Button>
                    {validation.touched.sku && validation.errors.sku ? (
                      <FormFeedback type="invalid">
                        {validation.errors.sku}
                      </FormFeedback>
                    ) : null}
                  </InputGroup>
                </div>
              </Col>
            </Row>
            <Row className="mx-auto mt-4" style={shadow} onMouseEnter={()=> setTieredPricingCollapse(true)} onMouseLeave={()=> setTieredPricingCollapse(false)}>
        <h5 className="form-label me-2">Tiered Pricing</h5>

        <Collapse isOpen={tieredPricingCollapse}>
        <Row>
        {tieredpricingCat?.map((values, index) => (
          <>
            {/* <Label className="form-label me-2">{values.min}</Label> */}

            <Col xs={12} md={2}>
              <Label className="form-label"> Min</Label>
              <div className="mb-3">
                <InputGroup>
                  <Input
                    name={`values[${index}].min`}
                    className="form-control"
                    type="number"
                    placeholder="Min"
                    value={values.min || "0"}
                    // onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    onChange={e => {
                      const updatedTiers = [...tieredpricingCat];
                      updatedTiers[index].min = e.target.value;
                      setTieredpricingCat(updatedTiers);
                    }}
                  ></Input>
                </InputGroup>
              </div>
            </Col>
            <Col xs={12} md={2}>
              <Label className="form-label">Max</Label>
              <div className="mb-3">
                <InputGroup>
                  <Input
                    name={`values[${index}].max`}
                    className="form-control"
                    type="number"
                    placeholder="Max"
                    value={values.max || "0"}
                    // onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    onChange={e => {
                      const updatedTiers = [...tieredpricingCat];
                      updatedTiers[index].max = e.target.value;
                      setTieredpricingCat(updatedTiers);
                    }}
                  ></Input>
                </InputGroup>
              </div>
            </Col>
            <Col xs={12} md={2}>
              <Label className="form-label"> Price</Label>
              <div className="mb-3">
                <InputGroup>
                  <Input
                    name={`values[${index}].price`}
                    className="form-control"
                    type="number"
                    placeholder="price"
                    value={values.price || "0"}
                    // onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    onChange={e => {
                      const updatedTiers = [...tieredpricingCat];
                      updatedTiers[index].price = e.target.value;
                      setTieredpricingCat(updatedTiers);
                    }}
                  ></Input>
                </InputGroup>
              </div>
            </Col>
            <Col xs={12} md={1}>
              <Label className="form-label">Discount</Label>
              <div className="mb-3">
                <InputGroup>
                  <Input
                    name={`values[${index}].discount`}
                    className="form-control"
                    type="number"
                    placeholder="discount"
                    value={values.discount || "0"}
                    // onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    onChange={e => {
                      const updatedTiers = [...tieredpricingCat];
                      updatedTiers[index].discount = e.target.value;
                      if (updatedTiers[index].isPercent) {
                        updatedTiers[index].finalprice =
                          updatedTiers[index].price -
                          (updatedTiers[index].price *
                            updatedTiers[index].discount) /
                            100;
                      } else {
                        updatedTiers[index].finalprice =
                          updatedTiers[index].price -
                          updatedTiers[index].discount;
                      }
                      setTieredpricingCat(updatedTiers);
                    }}
                  ></Input>
                </InputGroup>
              </div>
            </Col>
            <Col xs={12} md={1}>
              <Label className="form-label">finalprice</Label>
              <div className="mb-3">
                <InputGroup>
                  <Input
                    name={`values[${index}].finalprice`}
                    className="form-control"
                    type="number"
                    placeholder="finalprice"
                    value={values.finalprice || "0"}
                    // onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    onChange={e => {
                      const updatedTiers = [...tieredpricingCat];
                      updatedTiers[index].finalprice = e.target.value;
                      setTieredpricingCat(updatedTiers);
                    }}
                  ></Input>
                </InputGroup>
              </div>
            </Col>
            <Col xs={12} md={2}>
              <label className="" style={{height: "14px"}}></label>
              <div className="mb-2">
                

                <InputGroupText className="d-flex">
                  <span className="me-2">Is Percent</span>

                  <Input
                    name={`values[${index}].isPercent`}
                    type="checkbox"
                    className="form-control"
                    checked={values.isPercent}
                    onChange={e => {
                      const updatedTiers = [...tieredpricingCat];
                      updatedTiers[index].isPercent = e.target.checked;
                      setTieredpricingCat(updatedTiers);
                    }}
                  />
                </InputGroupText>
              
              </div>
            </Col>
            <Col xs={12} md={2}>
                <label></label>
                <label className="" style={{height: "14px"}}></label>
                <div className="mb-3">

                <Button
                  size="sm"
                  // className="me-0 mb-md-1"s
                  style={{height: "100%", padding: "8px"}}
                  color="danger"
                  onClick={() => {
                    removeTieredPricing(index);
                  }}
                >
                  Delete
                </Button>
                </div>
            </Col>

            {/* <Col xs={12} md={3}>
          <div className="mb-3">
            <Button
              size="sm"
              className="me-0 mb-1 mb-md-1"
              color="danger"
              onClick={removeTieredPricing(index)}
            >
              Delete
            </Button>
          </div>
        </Col> */}
          </>
        ))}
        <Row>

        <Button color='primary' style={{width: "100px", height: "40px", marginLeft: "10px"}} onClick={handleAddTier}>Add Tier</Button>

        </Row>

        </Row>
        </Collapse>
        {/* <Label className="form-label me-2">Min</Label>

        <InputGroup>
          <Input
            name="tieredPricing[0][min]"
            className="form-control"
            type="number"
            placeholder="Min"
            value={validation.values.tieredPricing[0].min || "0"}
            // onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            onChange={e => {
              console.log(e.target.value);
              // validation.setFieldValue(
              //   "tieredPricing[0].min",
              //   e.target.checked
              // );
            }}
          ></Input>
        </InputGroup>
        <Label className="form-label me-2">Max</Label>

        <InputGroup>
          <Input
            name="tieredPricing[0][max]"
            className="form-control"
            type="number"
            placeholder="Max"
            value={validation.values.tieredPricing[0].max || "0"}
            // onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            onChange={e => {
              // validation.setFieldValue(
              //   "tieredPricing[0].max",
              //   e.target.checked
              // );
            }}
          ></Input>
        </InputGroup>
        <Label className="form-label me-2">Price</Label>

        <InputGroup>
          <Input
            name="tieredPricing[0][price]"
            className="form-control"
            type="number"
            placeholder="price"
            value={validation.values.tieredPricing[0].price || "0"}
            // onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            onChange={e => {
              // validation.setFieldValue(
              //   "tieredPricing[0].price",
              //   e.target.checked
              // );
            }}
          ></Input>
        </InputGroup> */}
      </Row>





            <br></br>
            <br></br>
            <br></br>
            <h5 className="text-white me-md-3">Images & Printing Areas</h5>

            <Row className="p-2 py-4 d-flex justify-content-center">
              <Col xs={12} md={6}>
                <div className="mb-3">
                  <Label className="form-label me-2">Location / Image</Label>
                  <p className="font-size-10">
                    Designer Images must be of width: <b>1000px</b> and height:
                    <b>1400px</b>
                  </p>

                  <p className="font-size-10">
                    You need to upload at least one image with a key location:{" "}
                    <b>front</b>
                  </p>
                  <InputGroup>
                    <input
                      ref={hiddenInputFileUploaderRef}
                      type="file"
                      accept="image/*"
                      id="hidden-input-upload"
                      className="d-none"
                      placeholder=""
                      onChange={handleCustomImageUpload}
                      onClick={e => (e.target.value = "")}
                    />
                    <Input
                      name="images"
                      className="form-control"
                      type="text"
                      placeholder="Enter Image Location here before you upload an image."
                      value={imageLocationInput}
                      onChange={e => setImageLocationInput(e.target.value)}
                      onBlur={e => handleOnImageLocationBlur(e)}
                    ></Input>

                    <Button
                      color="primary"
                      className="d-flex align-items-center"
                      onClick={() => {
                        if (!imageLocationInput) return;
                        clickHiddenInput();
                      }}
                    >
                      <i className="bx bxs-camera-plus me-1 font-size-18"></i>
                      Upload Image
                    </Button>
                  </InputGroup>
                </div>
              </Col>
            </Row>

            <Row>
              {validation &&
                !!validation.values.printingAreas.length &&
                !!validation.values.images.length &&
                validation.values.images.map((imgObj, idx) => {
                  //
                  let printingArea = extractPrintingAreaByLocation(
                    imgObj.location
                  );

                  return (
                    <Col key={location + idx} xs={12} md={6}>
                      <div className="d-flex flex-column align-items-center my-4">
                        <div className="d-flex my-2 align-items-center">
                          <h4>{imgObj.location}</h4>
                        </div>

                        <div
                          style={{
                            width: 300,
                            height: 420,
                            backgroundColor: "white",
                            display: "flex",
                            borderRadius: 4,
                            overflow: "hidden",
                            position: "relative",
                          }}
                        >
                          <img src={imgObj.src} />

                          <div
                            style={{
                              position: "absolute",
                              width: printingArea?.width || "20%",
                              height: printingArea?.height || "20%",
                              top: printingArea?.top || "20%",
                              left: printingArea?.left || "20%",
                              border: "2px solid #00ADB5",
                            }}
                          />

                          <div
                            role={"button"}
                            onClick={() =>
                              handleRemoveImageAndPrintingArea(imgObj.location)
                            }
                            className="bg-danger d-flex align-items-center justify-content-center"
                            style={{
                              position: "absolute",
                              right: 2,
                              top: 2,
                              borderRadius: 20,
                              width: 22,
                              height: 22,
                            }}
                          >
                            <span className="font-size-20 text-white">x</span>
                          </div>
                        </div>

                        <div className="d-flex mt-4">
                          <div className="mx-1">
                            <Label>Width %</Label>
                            <Input
                              onChange={e =>
                                handlePrintingAreaPropertyChange(
                                  imgObj.location,
                                  "width",
                                  e.target.value
                                )
                              }
                              value={printingArea?.width}
                            />
                          </div>

                          <div>
                            <Label>Height %</Label>
                            <Input
                              onChange={e =>
                                handlePrintingAreaPropertyChange(
                                  imgObj.location,
                                  "height",
                                  e.target.value
                                )
                              }
                              value={printingArea?.height}
                            />
                          </div>

                          <div className="mx-1">
                            <Label>Top %</Label>
                            <Input
                              onChange={e =>
                                handlePrintingAreaPropertyChange(
                                  imgObj.location,
                                  "top",
                                  e.target.value
                                )
                              }
                              value={printingArea?.top}
                            />
                          </div>

                          <div>
                            <Label>Left %</Label>
                            <Input
                              onChange={e =>
                                handlePrintingAreaPropertyChange(
                                  imgObj.location,
                                  "left",
                                  e.target.value
                                )
                              }
                              value={printingArea?.left}
                            />
                          </div>
                        </div>
                      </div>
                    </Col>
                  );
                })}
            </Row>

            <br></br>
            <br></br>
            <br></br>
            <h5 className="text-white me-md-3">Product Attributes</h5>

            <Row>
              <Col xs={12} md={6}>
                <div className="mb-3">
                  <Label className="form-label me-2">Colors</Label>
                  <div className="mb-2">
                    {validation &&
                      validation.values.colors.map((color, idx) => (
                        <Badge
                          role={"button"}
                          key={color + idx}
                          className="mx-1 mt-1 font-size-12 badge-soft-secondary"
                          onClick={() => handleRemoveColor(color)}
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            {color}
                            <div
                              style={{
                                width: 12,
                                height: 12,
                                backgroundColor: color,
                                borderRadius: 4,
                                marginLeft: 4,
                              }}
                            />

                            <i className="bx bx-x font-size-16"></i>
                          </div>
                        </Badge>
                      ))}
                  </div>

                  <InputGroup>
                    <Input
                      name="colors"
                      className="form-control"
                      type="text"
                      value={colorsInputCurrent}
                      onChange={e =>
                        setColorsInputCurrent(e.target.value.toUpperCase())
                      }
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          handleAddNewColor();
                        }
                      }}
                    ></Input>

                    <Button color="primary" onClick={handleAddNewColor}>
                      Add Color
                    </Button>
                  </InputGroup>
                </div>
              </Col>

              <Col xs={12} md={6}>
                <div className="mb-3">
                  <Label className="form-label me-2">Sizes</Label>
                  <div className="mb-2">
                    {validation &&
                      validation.values.sizes.map((size, idx) => (
                        <Badge
                          role={"button"}
                          key={size + idx}
                          className="mx-1 mt-1 font-size-12 badge-soft-secondary"
                          onClick={() => handleRemoveSize(size)}
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            {size}

                            <i className="bx bx-x font-size-16"></i>
                          </div>
                        </Badge>
                      ))}
                  </div>

                  <InputGroup>
                    <Input
                      name="sizes"
                      className="form-control"
                      type="text"
                      value={sizesInputCurrent}
                      onChange={e =>
                        setSizesInputCurrent(e.target.value.toUpperCase())
                      }
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          handleAddNewSize();
                        }
                      }}
                    ></Input>

                    <Button color="primary" onClick={handleAddNewSize}>
                      Add Size
                    </Button>
                  </InputGroup>
                </div>
              </Col>

              <Col xs={12} md={6}>
                <div className="mb-3">
                  <Label className="form-label me-2">Decorations</Label>
                  <div className="mb-2">
                    {validation &&
                      validation.values.decorations.map((decoration, idx) => (
                        <Badge
                          role={"button"}
                          key={decoration + idx}
                          className="mx-1 mt-1 font-size-12 badge-soft-secondary"
                          onClick={() => handleRemoveDecoration(decoration)}
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            {decoration}

                            <i className="bx bx-x font-size-16"></i>
                          </div>
                        </Badge>
                      ))}
                  </div>

                  <InputGroup>
                    <Input
                      name="tags"
                      className="form-control"
                      type="text"
                      value={decorationsInputCurrent}
                      onChange={e =>
                        setDecorationsInputCurrent(e.target.value.toLowerCase())
                      }
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          handleAddNewDecoration();
                        }
                      }}
                    ></Input>

                    <Button color="primary" onClick={handleAddNewDecoration}>
                      Add Decoration
                    </Button>
                  </InputGroup>
                </div>
              </Col>
            </Row>

            <br></br>
            <br></br>
            <br></br>
            <h5 className="text-white me-md-3">Pricing & Inventory</h5>

            <Row>
              <Col xs={12} md={6}>
                <div className="mb-3">
                  <Label className="form-label me-2">Unit Price</Label>

                  <InputGroup>
                    <InputGroupText>$</InputGroupText>
                    <Input
                      name="unitPrice"
                      className="form-control"
                      type="number"
                      value={validation.values.unitPrice || "0"}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={
                        validation.touched.unitPrice &&
                        validation.errors.unitPrice
                          ? true
                          : false
                      }
                    ></Input>
                    {validation.touched.unitPrice &&
                    validation.errors.unitPrice ? (
                      <FormFeedback type="invalid">
                        {validation.errors.unitPrice}
                      </FormFeedback>
                    ) : null}
                  </InputGroup>
                </div>
              </Col>

              <Col xs={12} md={6}>
                <div className="mb-3">
                  <Label className="form-label me-2">Discount</Label>

                  <InputGroup>
                    <Input
                      name="discount[amount]"
                      className="form-control"
                      type="number"
                      placeholder="Discount Amount"
                      value={validation.values.discount.amount || "0"}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                    ></Input>

                    <InputGroupText className="d-flex">
                      <span className="me-2">Is Percent</span>

                      <Input
                        name="discount[isPercent]"
                        type="checkbox"
                        className="form-control"
                        checked={validation.values.discount.isPercent}
                        onChange={e => {
                          validation.setFieldValue(
                            "discount.isPercent",
                            e.target.checked
                          );
                        }}
                      />
                    </InputGroupText>
                  </InputGroup>
                </div>
              </Col>

              <div className="d-flex justify-content-center my-2">
                <span className="font-size-16 me-2">
                  Final Unit Price Will Be:{" "}
                </span>

                {(validation.values.discount.amount &&
                  validation.values.discount.isPercent && (
                    <span className="font-size-16 fw-bold text-white">
                      ${" "}
                      {validation.values.unitPrice -
                        (validation.values.unitPrice *
                          validation.values.discount.amount) /
                          100}
                    </span>
                  )) ||
                  (validation.values.discount.amount &&
                    !validation.values.discount.isPercent && (
                      <span className="font-size-16 fw-bold text-white">
                        ${" "}
                        {validation.values.unitPrice -
                          validation.values.discount.amount}
                      </span>
                    )) || (
                    <span className="font-size-16 fw-bold text-white">
                      {" "}
                      $ {validation.values.unitPrice}
                    </span>
                  )}
              </div>
            </Row>

            {!!additionalCostsInputCurrent && (
              <Row>
                <Col xs={12} md={12}>
                  <div className="mb-3">
                    <Label className="form-label me-2">Additional Costs</Label>

                    <div className="mb-2">
                      {validation &&
                        validation.values.additionalCosts.map(
                          (additionalCostObj, idx) => (
                            <Badge
                              role={"button"}
                              key={
                                additionalCostObj.location +
                                "-" +
                                additionalCostObj.decoration +
                                idx
                              }
                              className="mx-1 mt-1 font-size-12 badge-soft-success"
                              onClick={() =>
                                handleRemoveAdditonalCost(additionalCostObj)
                              }
                            >
                              <div className="d-flex align-items-center justify-content-between">
                                {additionalCostObj.location +
                                  "-" +
                                  additionalCostObj.decoration +
                                  ": +$" +
                                  additionalCostObj.cost}

                                <i className="bx bx-x font-size-16"></i>
                              </div>
                            </Badge>
                          )
                        )}
                    </div>

                    <InputGroup>
                      <ButtonDropdown
                        isOpen={locationMenuOpen}
                        toggle={() => setLocationMenuOpen(v => !v)}
                      >
                        <DropdownToggle
                          color="primary"
                          className="d-flex align-items-center"
                        >
                          {additionalCostsInputCurrent.location}
                          <i className="bx bx-caret-down ms-2"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          {validation.values.printingAreas.map(
                            printingAreaObj => (
                              <DropdownItem
                                key={printingAreaObj.location}
                                onClick={() => {
                                  handleAdditionalCostsInputChange(
                                    "location",
                                    printingAreaObj.location
                                  );
                                }}
                              >
                                {printingAreaObj.location}
                              </DropdownItem>
                            )
                          )}
                        </DropdownMenu>
                      </ButtonDropdown>

                      <ButtonDropdown
                        isOpen={decorationMenuOpen}
                        toggle={() => setDecorationMenuOpen(v => !v)}
                      >
                        <DropdownToggle
                          color="primary rounded-0"
                          className="d-flex align-items-center"
                        >
                          {additionalCostsInputCurrent.decoration}
                          <i className="bx bx-caret-down ms-2"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          {validation.values.decorations.map(decoration => (
                            <DropdownItem
                              key={decoration}
                              onClick={() => {
                                handleAdditionalCostsInputChange(
                                  "decoration",
                                  decoration
                                );
                              }}
                            >
                              {decoration}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </ButtonDropdown>

                      <Input
                        name="additionalCosts"
                        className="form-control"
                        type="number"
                        placeholder="Cost"
                        value={additionalCostsInputCurrent.cost}
                        onChange={e => {
                          handleAdditionalCostsInputChange(
                            "cost",
                            e.target.value
                          );
                        }}
                        onBlur={e => {
                          handleAdditionalCostsInputChange(
                            "cost",
                            e.target.value
                          );
                        }}
                        onKeyDown={e => {
                          if (e.key === "Enter") {
                            handleAddNewAdditionalCost();
                          }
                        }}
                      ></Input>

                      <Button
                        color="primary"
                        onClick={handleAddNewAdditionalCost}
                      >
                        Add
                      </Button>
                    </InputGroup>
                  </div>
                </Col>
              </Row>
            )}

            <Row className="my-2">
              <Col xs={12} md={6}>
                <div className="mb-3">
                  <Label className="form-label me-2">
                    Minimum Quantity To Order
                  </Label>

                  <Input
                    name="minimumQuantity"
                    className="form-control"
                    type="number"
                    placeholder="Enter Minimum Quantity"
                    value={validation.values.minimumQuantity}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    invalid={
                      validation.touched.minimumQuantity &&
                      validation.errors.minimumQuantity
                        ? true
                        : false
                    }
                  ></Input>
                  {validation.touched.minimumQuantity &&
                  validation.errors.minimumQuantity ? (
                    <FormFeedback type="invalid">
                      {validation.errors.minimumQuantity}
                    </FormFeedback>
                  ) : null}
                </div>
              </Col>

              <Col xs={12} md={6}>
                <div className="mb-3">
                  <Label className="form-label me-2">Inventory</Label>

                  <Input
                    name="inventory"
                    className="form-control"
                    type="number"
                    placeholder="Enter Inventory"
                    value={validation.values.inventory}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    invalid={
                      validation.touched.inventory &&
                      validation.errors.inventory
                        ? true
                        : false
                    }
                  ></Input>

                  {validation.touched.inventory &&
                  validation.errors.inventory ? (
                    <FormFeedback type="invalid">
                      {validation.errors.inventory}
                    </FormFeedback>
                  ) : null}
                </div>
              </Col>
            </Row>

            <Row className="d-flex mt-4 justify-content-center justify-content-md-end">
              <Col xs={12} md={6}>
                <div className="mt-3 d-flex justify-content-center justify-content-md-end">
                  <Button
                    className="mx-2"
                    onClick={() => {
                      validation.setFieldValue("published", false);
                      validation.handleSubmit();
                    }}
                    color="danger"
                  >
                    Save As Draft
                  </Button>
                  <Button
                    onClick={() => {
                      validation.setFieldValue("published", true);
                      validation.handleSubmit();
                    }}
                    color="success"
                  >
                    Save & Publish
                  </Button>
                </div>

                <div className="mt-3 d-flex"></div>
              </Col>
            </Row>
          </Form>
        </div>
      </CardBody>
    </Card>
  );
}

export default EditProductForm;
