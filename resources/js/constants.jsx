export const ORDER_STATUS_CLASS_MAP = {
  pending: "bg-amber-500",
  awaiting_payment: "bg-purple-500",
  awaiting_fulfillment: "bg-blue-500",
  cancelled: "bg-red-500",
  completed: "bg-green-500",
  refunded: "bg-gray-500",
};

export const ORDER_STATUS_TEXT_MAP = {
  pending: "Pending",
  awaiting_payment: "Awaiting Payment",
  awaiting_fulfillment: "Awaiting Fulfillment",
  cancelled: "Cancelled",
  completed: "Completed",
  refunded: "Refunded",
};

export const REPORT_TYPE_TEXT_MAP = {
  stock_levels: "Stock Levels",
  inventory_focusing: "Inventory Focusing",
  sales: "Sales",
  product_returns: "Product Returns",
  purchase_order: "Purchase Order",
};

export const REPORT_TYPE_MAP = {
  stock_levels: "bg-gray-600",
  inventory_focusing: "bg-green-600",
  sales: "bg-amber-600",
  product_returns: "bg-blue-600",
  purchase_order: "bg-red-600",
};

export const TRANSACTION_TYPE_TEXT_MAP = {
  purchase: "Purchase",
  sale: "Sale",
  adjustment: "Adjustment",
};

export const TRANSACTION_MAP = {
  purchase: "Purchase",
  sale: "Sale",
  adjustment: "Adjustment",
};
