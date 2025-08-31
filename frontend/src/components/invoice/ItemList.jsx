import React, { useEffect, useRef } from "react";
import axios from "axios";
import Button from "../ui/Button";
import InvoiceItem from "./InvoiceItem";
import { Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const ItemList = ({
  invoice,
  onUpdate,
  onAddItem,
  onRemoveItem,
  onFirstVisit,
}) => {
  const { currentUser, isAuthenticated } = useAuth();
  const userId = currentUser?._id || null;
  const hasNotifiedRef = useRef(false);

  useEffect(() => {
    if (onFirstVisit && !hasNotifiedRef.current) {
      onFirstVisit();
      hasNotifiedRef.current = true;
    }
  }, [onFirstVisit]);

  const calculateTotal = () => {
    return invoice.items.reduce((total, item) => total + item.amount, 0);
  };

  const handleItemUpdate = (itemId, field, value) => {
    const updatedItems = invoice.items.map((item) => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };

        if (field === "quantity" || field === "unitPrice") {
          updatedItem.amount = updatedItem.quantity * updatedItem.unitPrice;
        }

        return updatedItem;
      }
      return item;
    });

    onUpdate("items", updatedItems);
  };

  const handleAddItem = async () => {
    const lastItem = invoice.items[invoice.items.length - 1];
    const description = lastItem?.description?.trim();

    if (description && isAuthenticated) {
      try {
        const { data: existing } = await axios.get(
          `${
            import.meta.env.BACKEND_URL || "http://localhost:5000"
          }/api/suggestions?q=${description}&userId=${userId}`
        );

        const isAlreadySaved = existing.some((s) => s.name === description);

        if (!isAlreadySaved) {
          await axios.post(
            `${
              import.meta.env.BACKEND_URL || "http://localhost:5000"
            }/api/suggestions`,
            {
              name: description,
              userId,
            }
          );
        }
      } catch (err) {
        console.error("❌ Error saving suggestion:", err);
      }
    }

    onAddItem();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Items</h3>
        <Button
          variant="success"
          onClick={handleAddItem}
          className="cursor-pointer"
        >
          <Plus size={16} className="mr-2" />
          Add Item
        </Button>
      </div>

      <div className="space-y-4">
        {invoice.items.map((item) => (
          <InvoiceItem
            key={item.id}
            item={{ ...item, userId }} // 👈 userId still passed for future flexibility
            onUpdate={handleItemUpdate}
            onRemove={onRemoveItem}
            canRemove={invoice.items.length > 1}
          />
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <div className="w-64">
          <div className="flex justify-between items-center py-3 text-xl font-bold border-t">
            <span>Total:</span>
            <span>₹{calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemList;
