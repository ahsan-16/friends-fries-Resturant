import MenuPage from "./MenuPage";
import { menuItems } from "../data/menu";

export function BurgersPage() {
  return <MenuPage title="BURGERS" subtitle="Handcrafted" emoji="🍔" items={menuItems.burgers} tags={["spicy", "crispy", "double", "cheese"]} />;
}

export function PizzaPage() {
  return <MenuPage title="PIZZA" subtitle="Freshly Baked" emoji="🍕" items={menuItems.pizza} tags={["classic", "premium", "spicy", "creamy", "stuffed"]} />;
}

export function ShawarmaPage() {
  return <MenuPage title="SHAWARMA & WRAPS" subtitle="Fresh Rolled" emoji="🌯" items={menuItems.shawarma} tags={["wrap", "grilled", "crispy", "desi", "cheese"]} />;
}

export function FriesPage() {
  return <MenuPage title="FRIES & SIDES" subtitle="Crispy Golden" emoji="🍟" items={menuItems.fries} tags={["classic", "loaded", "fusion", "chicken", "large"]} />;
}

export function DrinksPage() {
  return <MenuPage title="DRINKS & JUICES" subtitle="Fresh & Chilled" emoji="🥤" items={menuItems.drinks} tags={["milkshake", "icecream shake", "fresh juice", "soda", "premium"]} />;
}
