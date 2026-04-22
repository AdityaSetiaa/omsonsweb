"use client";
import { useCartStore } from "@/Store/store";

export default function Cart() {
  const cart = useCartStore((s) => s.cart);
  const increment = useCartStore((s) => s.incrementQty);
  const decrement = useCartStore((s) => s.decrementQty);
  const remove = useCartStore((s) => s.removeFromCart);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#EAEDED] font-[Arial,sans-serif]">
      <div className="max-w-5xl mx-auto px-4 py-4">
        

        <div className="flex overflow-y-scroll gap-4 items-start flex-col lg:flex-row">
          {/* Cart Items */}
          <div className="flex-1 w-full  bg-white border border-gray-300 rounded px-6 py-4"> 
            <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-0">
              <h2 className="text-2xl font-normal text-[#0F1111]">Shopping Cart</h2>
              <span className="text-sm text-[#565959] ">Price</span>
            </div>

            {cart.length === 0 ? (
              <p className="text-center py-10 text-[#565959] mt-6">Your cart is empty.</p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-4 border-b border-gray-200 last:border-0"
                >
                  {/* Image placeholder */}
                  <div className="w-24 h-24 bg-[#F0F2F2] rounded flex items-center justify-center shrink-0 text-xs text-gray-400">
                    IMG
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <p className="text-base text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer leading-snug mb-1">
                      {item.name}
                    </p>
                    <p className="text-xs text-[#007600] mb-1">In Stock</p>
                    <p className="text-xs text-[#565959] mb-2">Sold by: Amazon Retail India</p>

                    {/* Controls */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center rounded bg-[#F0F2F2] overflow-hidden">
                        <button
                          onClick={() => decrement(item.id)}
                          className="w-10 h-10 flex items-center justify-center text-lg text-[#0F1111] border rounded bg-yellow-500 hover:bg-gray-300 font-light"
                        >
                          −
                        </button>
                        <span className="px-2 w-10 h-10 text-sm font-medium text-[#0F1111] min-w-[28px] text-center flex items-center justify-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increment(item.id)}
                          className="w-10 h-10 flex items-center justify-center text-lg text-[#0F1111] border rounded bg-yellow-500 hover:bg-gray-300 font-light"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-gray-300 text-sm">|</span>
                      <button
                        onClick={() => remove(item.id)}
                        className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline"
                      >
                        Delete
                      </button>
                      <span className="text-gray-300 text-sm">|</span>
                      {/* <button className="text-sm text-[#007185] hover:underline">
                        Save for later
                      </button> */}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-[#0F1111]">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-[#565959]">
                        ₹{item.price.toLocaleString("en-IN")} each
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* Subtotal bottom row */}
            {cart.length > 0 && (
              <div className="text-right pt-3 text-base text-[#0F1111]">
                Subtotal ({itemCount} items):{" "}
                <span className="font-bold text-lg">
                  ₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-[280px] bg-white border border-gray-300 rounded p-5 sticky top-4">
            
            <p className="text-lg text-[#0F1111] mb-1">
              Subtotal ({itemCount} items):{" "}
              <span className="font-bold">
                ₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </p>
           
            <button className="w-full bg-gradient-to-b from-[#FFD814] to-[#F7CA00] border border-[#FCD200] rounded-full py-2 text-sm text-[#0F1111] hover:from-[#F7CA00] hover:to-[#EEB902] transition-colors">
              Proceed to Buy
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
}