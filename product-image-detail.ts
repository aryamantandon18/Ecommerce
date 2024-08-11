import React from "react";
import CustomImageMagnifier from "./custom-image-magnifier"; // Adjust the path according to your project structure

interface Props {
  src?: any;
  imgBackgroundColor?: string;
  style?: any;
  className?: string;
  [key: string]: any;
}

const ProductImageDetail: React.FC<Props> = ({
  src,
  imgBackgroundColor = "#FFFFFF",
  style,
  alt,
  activeImgBorder,
  ...otherProps
}) => {

  return (
    <div className="flex ">
      <CustomImageMagnifier
        src={src}
        alt={alt}
        width={350}
        height={450}
        zoomLevel={3}
      />
    </div>
  );
};

export default ProductImageDetail;
