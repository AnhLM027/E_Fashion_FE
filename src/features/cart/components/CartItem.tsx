// 'use client';

// import React from 'react';
// // import Image from 'next/image';
// import type { CartItem as ICartItem } from '../types/cart.type';
// import { formatCurrency } from '../../../utils/format';
// import './CartItem.css';

// interface CartItemProps {
//   item: ICartItem;
//   onUpdateQuantity: (quantity: number) => void;
//   onRemove: () => void;
// }

// export const CartItem: React.FC<CartItemProps> = ({
//   item,
//   onUpdateQuantity,
//   onRemove,
// }) => {
//   return (
//     <div className="cart-item">
//       <div className="cart-item__image">
//         {/* <Image
//           src={item.product.thumbnail || "/placeholder.svg"}
//           alt={item.product.name}
//           width={100}
//           height={100}
//           className="cart-item__image-img"
//         /> */}
//       </div>

//       <div className="cart-item__details">
//         <h3 className="cart-item__name">{item.product.name}</h3>
//         <p className="cart-item__category">{item.product.category}</p>
//         {item.size && <p className="cart-item__size">Size: {item.size}</p>}
//         {item.color && <p className="cart-item__color">Color: {item.color}</p>}
//       </div>

//       <div className="cart-item__quantity">
//         <button
//           className="cart-item__quantity-btn"
//           onClick={() => onUpdateQuantity(item.quantity - 1)}
//           aria-label="Decrease quantity"
//         >
//           −
//         </button>
//         <span className="cart-item__quantity-value">{item.quantity}</span>
//         <button
//           className="cart-item__quantity-btn"
//           onClick={() => onUpdateQuantity(item.quantity + 1)}
//           aria-label="Increase quantity"
//         >
//           +
//         </button>
//       </div>

//       <div className="cart-item__price">
//         <div className="cart-item__unit-price">
//           {formatCurrency(item.product.price)}
//         </div>
//         <div className="cart-item__total-price">
//           {formatCurrency(item.totalPrice)}
//         </div>
//       </div>

//       <button
//         className="cart-item__remove"
//         onClick={onRemove}
//         aria-label="Remove from cart"
//       >
//         ×
//       </button>
//     </div>
//   );
// };
