"use client";

type Props = {
  product: string;
  quantity: number;
//   price?: number;
};


const AddToCart = ({ product, quantity,  }: Props) => {


  const handleAdd = () => {
      console.log("clicked", { product, quantity,  });
  };

  return (
    <button
      onClick={handleAdd}
      className="bg-yellow-500 text-white px-4 py-2 rounded-2xl"
    >
      Add to Cart
    </button>
  );
};

export default AddToCart;