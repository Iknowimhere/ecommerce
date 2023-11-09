const {Schema,model}=require('mongoose')

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "title field cant be empty"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "description field cant be empty"],
    },
    price: {
      type: Number,
      required: [true, "price field cant be empty"],
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 1,
      max: [10, "rating should be between 1 to 10"],
    },
    stock: {
      type: Number,
      default: 1,
    },
    brand: {
      type: String,
      required: [true, "brand field cant be empty"],
    },
    category: {
      type: String,
      required: [true, "category field cant be empty"],
    },
    thumbnail: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw43TbPxjvcdVxslELcnG0OrSmLPRUl_r_OWrRpfg&s",
    },
    images: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);
const Product=model('products',productSchema)
module.exports=Product;