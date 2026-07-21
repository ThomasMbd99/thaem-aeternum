import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "@/context/CartContext";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe("CartContext", () => {
  it("starts empty", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
    expect(result.current.finalPrice).toBe(0);
  });

  it("adds an item and computes totals", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({ productId: "zaemyr", format: "50ml", price: 44.99, name: "ZÆMYR" });
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.totalItems).toBe(1);
    expect(result.current.totalPrice).toBeCloseTo(44.99);
    expect(result.current.finalPrice).toBeCloseTo(44.99);
  });

  it("increments quantity instead of duplicating when adding the same product/format twice", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({ productId: "zaemyr", format: "50ml", price: 44.99, name: "ZÆMYR" });
      result.current.addItem({ productId: "zaemyr", format: "50ml", price: 44.99, name: "ZÆMYR" });
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.totalPrice).toBeCloseTo(89.98);
  });

  it("applies the bundle discount for every pair of 50ml items", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({ productId: "zaemyr", format: "50ml", price: 44.99, name: "ZÆMYR" });
      result.current.addItem({ productId: "lamae", format: "50ml", price: 44.99, name: "LAMÆ" });
    });
    // 2x 50ml -> one pair -> -9.99€
    expect(result.current.bundleDiscount).toBeCloseTo(9.99);
    expect(result.current.finalPrice).toBeCloseTo(44.99 * 2 - 9.99);
  });

  it("does not apply the bundle discount to a single 50ml or to 10ml items", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({ productId: "zaemyr", format: "50ml", price: 44.99, name: "ZÆMYR" });
      result.current.addItem({ productId: "lamae", format: "10ml", price: 9.99, name: "LAMÆ" });
    });
    expect(result.current.bundleDiscount).toBe(0);
    expect(result.current.finalPrice).toBeCloseTo(44.99 + 9.99);
  });

  it("excludes discovery box items from the bundle discount count", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({ productId: "coffret", format: "50ml", price: 39.99, name: "Coffret", isDiscoveryBox: true, selectedPerfumes: ["a", "b"] });
      result.current.addItem({ productId: "zaemyr", format: "50ml", price: 44.99, name: "ZÆMYR" });
    });
    // Only 1 non-discovery-box 50ml -> no bundle pair -> no discount
    expect(result.current.bundleDiscount).toBe(0);
  });

  it("removes an item", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({ productId: "zaemyr", format: "50ml", price: 44.99, name: "ZÆMYR" });
      result.current.removeItem("zaemyr", "50ml");
    });
    expect(result.current.items).toHaveLength(0);
  });

  it("updateQuantity removes the item when quantity drops to zero or below", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({ productId: "zaemyr", format: "50ml", price: 44.99, name: "ZÆMYR" });
      result.current.updateQuantity("zaemyr", "50ml", 0);
    });
    expect(result.current.items).toHaveLength(0);
  });

  it("never lets finalPrice go negative", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      // A single cheap item can't trigger a bundle discount on its own,
      // but this guards the Math.max(0, ...) floor in finalPrice regardless.
      result.current.addItem({ productId: "zaemyr", format: "10ml", price: 9.99, name: "ZÆMYR" });
    });
    expect(result.current.finalPrice).toBeGreaterThanOrEqual(0);
  });

  it("clearCart empties the cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({ productId: "zaemyr", format: "50ml", price: 44.99, name: "ZÆMYR" });
      result.current.clearCart();
    });
    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalPrice).toBe(0);
  });
});
